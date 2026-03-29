#!/usr/bin/env python3
"""
Generate vector embeddings for all 6,236 Quran ayahs.
Outputs a SQLite database bundled with the app for offline semantic search.

Requirements:
    pip install sentence-transformers

Usage:
    python scripts/generate_embeddings.py
"""

import json
import sqlite3
import struct
from datetime import datetime, timezone
from pathlib import Path

from sentence_transformers import SentenceTransformer

MODEL_NAME = "intfloat/multilingual-e5-small"
DIMENSIONS = 384
BATCH_SIZE = 128

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
SURAHS_DIR = PROJECT_DIR / "assets" / "data" / "surahs"
OUTPUT_DIR = PROJECT_DIR / "assets" / "embeddings"
DB_PATH = OUTPUT_DIR / "ayah_vectors.db"


def load_all_ayahs():
    """Load all ayahs from 114 surah JSON files."""
    ayahs = []
    for surah_num in range(1, 115):
        path = SURAHS_DIR / f"{surah_num:03d}.json"
        if not path.exists():
            print(f"  WARNING: {path.name} not found, skipping")
            continue
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        surah_ayahs = data.get("ayahs", [])
        count = 0
        for ayah in surah_ayahs:
            text = (ayah.get("text_translation") or "").strip()
            if not text:
                print(f"  WARNING: empty translation for {surah_num}:{ayah.get('number_in_surah')}")
                text = f"Surah {surah_num}, Ayah {ayah.get('number_in_surah')}"
            ayahs.append({
                "surah": surah_num,
                "ayah": ayah["number_in_surah"],
                "text": text,
            })
            count += 1
        print(f"Processing surah {surah_num}/114... ({count} ayahs)")
    return ayahs


def create_db(db_path):
    """Create SQLite database with schema."""
    db_path.parent.mkdir(parents=True, exist_ok=True)
    if db_path.exists():
        db_path.unlink()
    conn = sqlite3.connect(str(db_path))
    conn.execute("""
        CREATE TABLE ayah_embeddings (
            surah INTEGER,
            ayah INTEGER,
            embedding BLOB,
            PRIMARY KEY (surah, ayah)
        )
    """)
    conn.execute("""
        CREATE TABLE metadata (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    """)
    conn.commit()
    return conn


def embed_to_blob(embedding):
    """Pack a float32 array into a BLOB."""
    return struct.pack(f"{DIMENSIONS}f", *embedding)


def blob_to_embed(blob):
    """Unpack a BLOB back into a list of floats."""
    return list(struct.unpack(f"{DIMENSIONS}f", blob))


def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x * x for x in a) ** 0.5
    norm_b = sum(x * x for x in b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


def verify(conn):
    """Spot-check cosine similarity of known-similar ayahs."""
    pairs = [
        # Al-Fatihah 1:5 (worship) vs Al-Baqarah 2:21 (worship command)
        ((1, 5), (2, 21), "worship"),
        # Al-Fatihah 1:6 (guidance) vs Al-Baqarah 2:2 (guidance for the God-conscious)
        ((1, 6), (2, 2), "guidance"),
        # Al-Baqarah 2:183 (fasting) vs Al-Baqarah 2:185 (Ramadan)
        ((2, 183), (2, 185), "fasting/Ramadan"),
    ]
    print("\nVerification — cosine similarity of related ayahs:")
    for (s1, a1), (s2, a2), label in pairs:
        row1 = conn.execute(
            "SELECT embedding FROM ayah_embeddings WHERE surah=? AND ayah=?",
            (s1, a1),
        ).fetchone()
        row2 = conn.execute(
            "SELECT embedding FROM ayah_embeddings WHERE surah=? AND ayah=?",
            (s2, a2),
        ).fetchone()
        if row1 and row2:
            sim = cosine_similarity(blob_to_embed(row1[0]), blob_to_embed(row2[0]))
            print(f"  {s1}:{a1} vs {s2}:{a2} ({label}): {sim:.4f}")
        else:
            print(f"  {s1}:{a1} vs {s2}:{a2} ({label}): MISSING DATA")


def main():
    print(f"Loading model: {MODEL_NAME}")
    model = SentenceTransformer(MODEL_NAME)

    print(f"\nLoading ayahs from {SURAHS_DIR}")
    ayahs = load_all_ayahs()
    print(f"\nTotal ayahs loaded: {len(ayahs)}")

    print(f"\nCreating database: {DB_PATH}")
    conn = create_db(DB_PATH)

    # Prepend e5 instruction prefix and encode in batches
    texts = [f"passage: {a['text']}" for a in ayahs]
    print(f"\nEncoding {len(texts)} ayahs in batches of {BATCH_SIZE}...")

    embeddings = model.encode(
        texts,
        normalize_embeddings=True,
        batch_size=BATCH_SIZE,
        show_progress_bar=True,
    )

    print("Writing to database...")
    conn.executemany(
        "INSERT INTO ayah_embeddings (surah, ayah, embedding) VALUES (?, ?, ?)",
        [
            (a["surah"], a["ayah"], embed_to_blob(embeddings[i]))
            for i, a in enumerate(ayahs)
        ],
    )

    conn.executemany(
        "INSERT INTO metadata (key, value) VALUES (?, ?)",
        [
            ("model_name", MODEL_NAME),
            ("dimensions", str(DIMENSIONS)),
            ("total_ayahs", str(len(ayahs))),
            ("generated_at", datetime.now(timezone.utc).isoformat()),
        ],
    )
    conn.commit()

    verify(conn)

    conn.close()
    db_size_mb = DB_PATH.stat().st_size / (1024 * 1024)
    print(f"\nDone! Database: {DB_PATH} ({db_size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
