# Codex Starter Pack

This folder is a reusable Codex CLI template for new projects.

Copy these items into the root of a new project:
- `AGENTS.md`
- `.Codex/README.md`
- `.Codex/CODEX_INTEGRATION_GUIDE.md`
- `.Codex/SUBAGENTS.md`

Recommended first-run flow:
1. Paste the files into the new project root.
2. Open a terminal in that project root.
3. Start Codex CLI from that root directory.
4. In the first request, ask Codex to inspect the repository and tailor `.Codex/CODEX_INTEGRATION_GUIDE.md` to the actual stack, folders, and commands.

What Codex should always reference:
- the root `AGENTS.md`
- the `.Codex/` folder
- the real repository structure

What to customize per project:
- tech stack and frameworks
- key directories
- build, test, lint, and dev commands
- deployment or environment constraints
- preferred review and validation habits

Important note:
- There is usually no special terminal command needed beyond starting Codex from the project root where `AGENTS.md` exists.
- If you start Codex outside the project root, it may not pick up the right repository instructions.
