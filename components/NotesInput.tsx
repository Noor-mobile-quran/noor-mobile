import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";

interface Props {
  surah: number;
  ayah: number;
  existingNote?: string;
  onSave: (note: string) => void;
}

export function NotesInput({ surah, ayah, existingNote, onSave }: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState(existingNote ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(text);
    setIsEditing(false);
  };

  if (!isEditing && !text) {
    return (
      <TouchableOpacity
        onPress={() => setIsEditing(true)}
        style={[styles.addButton, { borderColor: colors.border }]}
        accessibilityLabel="Add note for this ayah"
        accessibilityRole="button"
        accessibilityHint="Double tap to add a personal note"
      >
        <Svg width={14} height={14} viewBox="0 0 24 24">
          <Path
            d="M12 5v14M5 12h14"
            stroke={colors.textSecondary}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
        <Text
          style={[
            styles.addLabel,
            { color: colors.textSecondary, fontFamily: fonts.latin.regular },
          ]}
        >
          Add note
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { borderColor: colors.border, backgroundColor: colors.surfaceElevated },
      ]}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Your notes..."
        placeholderTextColor={colors.textSecondary}
        multiline
        style={[
          styles.input,
          { color: colors.textPrimary, fontFamily: fonts.latin.regular },
        ]}
        autoFocus={isEditing}
        accessibilityLabel="Note input"
      />
      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: colors.accent }]}
        accessibilityLabel="Save note"
        accessibilityRole="button"
      >
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Path
            d="M5 13l4 4L19 7"
            stroke={colors.bg}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
    marginBottom: 12,
  },
  addLabel: {
    fontSize: 13,
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    minHeight: 44,
    textAlignVertical: "top",
    padding: 0,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
