# Codex Integration Guide Template

Use this file as the reusable project template for Codex CLI.

## 1. Purpose

This repository uses `AGENTS.md` plus `.Codex/` as the project instruction layer for Codex CLI.

The goal is to make Codex:
- read stable project rules first
- adapt to the actual repository structure
- prefer multi-agent execution for work that benefits from parallelism
- avoid pretending unsupported automation exists

## 2. Startup Rule

Start Codex CLI from the project root, where `AGENTS.md` lives.

Recommended terminal habit:
1. `cd` into the project root
2. start Codex CLI there
3. make your first request repository-specific

Suggested first prompt:
"Inspect this repository and update `.Codex/CODEX_INTEGRATION_GUIDE.md` so it matches the real stack, folders, commands, and constraints. Keep `AGENTS.md` as the entry point and preserve any legacy reference docs."

## 3. What Codex Should Always Check

Before substantial work, Codex should check:
- `AGENTS.md`
- `.Codex/CODEX_INTEGRATION_GUIDE.md`
- `.Codex/SUBAGENTS.md`
- the actual repository structure

If legacy instructions exist, treat them as reference material:
- `.claude/`
- `CLAUDE_INTEGRATION_GUIDE.md`
- other prior assistant-specific docs

## 4. Template Values To Replace Per Project

Replace the placeholders below after copying this template.

### Project summary
- Project name: `[PROJECT_NAME]`
- Project type: `[web app | backend service | monorepo | library | mobile app | other]`
- Primary languages: `[LANGUAGES]`
- Primary frameworks: `[FRAMEWORKS]`

### Important directories
- App code: `[APP_DIRS]`
- Tests: `[TEST_DIRS]`
- Docs: `[DOC_DIRS]`
- Infra or scripts: `[INFRA_DIRS]`

### Common commands
- Install: `[INSTALL_COMMAND]`
- Dev: `[DEV_COMMAND]`
- Test: `[TEST_COMMAND]`
- Lint: `[LINT_COMMAND]`
- Build: `[BUILD_COMMAND]`

### Constraints
- Package manager: `[npm | pnpm | yarn | bun | cargo | uv | other]`
- Runtime: `[node | python | docker | mixed | other]`
- Review policy: `[REVIEW_POLICY]`
- Testing expectations: `[TEST_EXPECTATIONS]`
- Deployment or security notes: `[DEPLOYMENT_NOTES]`

## 5. Default Codex Working Agreement

Codex should:
- inspect before editing
- make the smallest safe change that solves the task
- verify affected behavior when practical
- explain assumptions when the repo does not make them obvious
- preserve unrelated user changes

Codex should not:
- assume automation from another assistant runtime exists here
- rewrite project-wide conventions without checking local structure
- run destructive commands unless explicitly asked

## 6. Multi-Agent By Default

For this template, Codex should lean toward multi-agent execution whenever the task is not trivial.

Recommended default:
- trivial task: no sub-agent required
- moderate task: spawn one explorer or reviewer
- larger task: spawn one explorer plus one worker or reviewer if file ownership can stay separate

Good sub-agent candidates:
- repository structure survey
- locating relevant code paths
- drafting documentation
- reviewing for regressions
- implementing isolated changes in disjoint files

Bad sub-agent candidates:
- the next critical-path step
- tiny one-file edits
- work likely to collide in the same file

## 7. Manual Replacements For Claude-Style Automation

If the source project came from a Claude-oriented setup, use these translations:

- skills -> reusable Codex guidance docs or project playbooks
- agents -> Codex sub-agent roles
- hooks -> explicit checklists
- slash commands -> documented workflows
- activation rules -> deliberate manual selection based on task and touched files

## 8. First Customization Pass

After copying this template into a new project, ask Codex to do this:

1. inspect the repository layout
2. replace all placeholders in this file
3. update `.Codex/SUBAGENTS.md` with project-specific examples
4. add any missing project commands
5. note any unsupported legacy automation

## 9. Ongoing Maintenance

Update this file when these change:
- framework or stack
- main package commands
- test strategy
- repository layout
- team review expectations
