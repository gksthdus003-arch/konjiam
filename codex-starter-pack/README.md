# Codex Starter Pack Bundle

This folder is the copy-paste bundle for a new project.

## Files to copy into a new project root

- `AGENTS.md`
- `.Codex/README.md`
- `.Codex/CODEX_INTEGRATION_GUIDE.md`
- `.Codex/SUBAGENTS.md`

## Suggested usage

1. Copy `AGENTS.md` and the `.Codex/` folder into the new project root.
2. Open a terminal in that new project root.
3. Start Codex CLI there.
4. Use this first prompt:

```text
Inspect this repository and update .Codex/CODEX_INTEGRATION_GUIDE.md so it matches the real stack, folders, commands, and constraints. Keep AGENTS.md as the entry point.
```

## Notes

- The most important part is starting Codex from the same directory that contains `AGENTS.md`.
- The template pushes Codex toward a multi-agent style for non-trivial work.
- After the first inspection pass, update placeholders in `.Codex/CODEX_INTEGRATION_GUIDE.md` and `.Codex/SUBAGENTS.md`.
