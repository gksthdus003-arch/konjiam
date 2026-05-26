# Codex Sub-Agent Template

Use this file to make Codex operate in a deliberate multi-agent style.

## 1. Operating Principle

The main agent should coordinate the work.
Sub-agents should handle bounded tasks that can run in parallel or reduce risk.

Main agent responsibilities:
- understand the user goal
- form the high-level plan
- decide what should stay on the critical path
- assign scoped work
- integrate results
- deliver the final answer

Sub-agent responsibilities:
- focused exploration
- isolated implementation
- independent review or verification

## 2. Default Delegation Policy

When the task is non-trivial, prefer delegation rather than working entirely alone.

Suggested policy:
- simple request: no sub-agent
- moderate request: one sub-agent
- complex request: two or more sub-agents when scopes are independent

Examples of moderate requests:
- feature work across multiple files
- documentation created from several source files
- bug fixing with uncertain root cause

Examples of complex requests:
- refactors across separate modules
- architecture reviews plus implementation
- migration work from one assistant workflow to another

## 3. Recommended Sub-Agent Types

### Explorer

Use for:
- finding relevant files
- summarizing architecture
- comparing candidate approaches
- checking how an existing system currently works

Prompt pattern:
"Inspect `[SCOPE]`. Do not edit files. Return relevant paths, current behavior, risks, and recommendations."

### Worker

Use for:
- isolated implementation
- bounded documentation updates
- test creation or repair in a limited scope

Prompt pattern:
"Own `[FILES_OR_DIRS]`. Make the requested change only in that scope. Do not revert unrelated work by others. Return changed files and verification."

### Reviewer

Use for:
- code review
- regression hunting
- test gap detection
- architecture risk review

Prompt pattern:
"Review `[SCOPE]` for bugs, regressions, risks, and missing tests. Report findings first, ordered by severity."

## 4. Safe Delegation Rules

- Give each worker a clearly owned file set
- Avoid overlapping writes
- Do not wait on sub-agents unless blocked
- Keep critical-path tasks local when immediate judgment is required
- Reuse a sub-agent for follow-up questions when context matters

## 5. Project Customization Fields

Replace these after copying into a new repository:

- Backend areas: `[BACKEND_AREAS]`
- Frontend areas: `[FRONTEND_AREAS]`
- Test areas: `[TEST_AREAS]`
- Docs areas: `[DOC_AREAS]`
- Common review hotspots: `[REVIEW_HOTSPOTS]`

## 6. Suggested Project-Specific Triggers

By default, spawn a sub-agent when the task involves:
- multiple directories
- unclear ownership
- several competing implementation paths
- code changes plus review
- code changes plus documentation
- migration from older repo conventions

## 7. Copy-Paste Prompt Starters

Explorer starter:
"Inspect this repository area and summarize the files, current behavior, and risks. Do not edit anything."

Worker starter:
"Own this scoped change, edit only the listed files, and report exactly what changed plus how you verified it."

Reviewer starter:
"Review the touched area for bugs, regressions, and missing tests. Findings first, brief summary second."

## 8. Important Reality Check

This file can push Codex toward a multi-agent style, but it does not guarantee blind delegation on every task.
Delegation still needs to be safe, scoped, and useful.
