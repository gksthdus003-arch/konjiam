# Codex Project Entry

Use this file as the default entry point for Codex in any copied project.

Read in this order:
1. `.Codex/README.md`
2. `.Codex/CODEX_INTEGRATION_GUIDE.md`
3. `.Codex/SUBAGENTS.md`

Core rules:
- Treat `.Codex/` as the active Codex instruction layer for this repository.
- Preserve `.claude/` as reference material unless the user explicitly asks to migrate or edit it.
- For any non-trivial task, prefer a multi-agent workflow:
  - main agent owns planning, coordination, and final synthesis
  - sub-agents own bounded investigation, implementation, or verification
- Spawn sub-agents early when work can be parallelized safely.
- Do not assume Claude hooks, slash commands, or `skill-rules.json` automation exist in Codex.
- Recreate important automation as explicit checklists and deliberate habits.

Default execution policy:
- Small task: work directly, no delegation required
- Medium task: consider one explorer or reviewer sub-agent
- Large task: default to at least one explorer plus one worker or reviewer when scopes do not overlap
