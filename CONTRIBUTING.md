# Contributing to Noor

Thank you for your interest in contributing to Noor. This guide will help you get started.

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/noor-mobile.git
   cd noor-mobile
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make your changes in the feature branch.
2. Test on both iOS and Android when possible.
3. Run the formatter before committing:
   ```bash
   npx prettier --write .
   ```
4. Write clear, descriptive commit messages.

## Submitting a Pull Request

1. Push your branch to your fork.
2. Open a Pull Request against the `main` branch of this repository.
3. Fill in the PR template with a description of your changes.
4. Wait for review -- a maintainer will respond within a few days.

## Code Style

- **TypeScript** for all source files. No `any` types unless absolutely necessary.
- **NativeWind** (Tailwind CSS) for styling. Avoid inline `StyleSheet.create` in new code.
- **Prettier** handles formatting. The project uses the default Prettier config.
- Keep components small and focused. One component, one file.
- Use descriptive variable and function names. The code should read like prose.

## Quran Content Guidelines

Noor handles sacred text. When working with Quran data or display:

- Never alter, truncate, or paraphrase Quranic text.
- Arabic text must always render right-to-left with proper diacritics.
- Translations should be clearly labeled as translations, not as the Quran itself.

## Reporting Issues

Open a GitHub issue with:
- A clear title describing the problem.
- Steps to reproduce the issue.
- Expected vs. actual behavior.
- Device, OS version, and app version.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
