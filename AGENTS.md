# Global Autonomous Project Rules

Before working in this repository, read and apply the shared project-brain rules:

- `https://raw.githubusercontent.com/andylitvinov-design/ai-projects-brain/main/systems/autonomous-project-executor.md`
- `https://raw.githubusercontent.com/andylitvinov-design/ai-projects-brain/main/systems/agent-rules.md`
- `https://raw.githubusercontent.com/andylitvinov-design/ai-projects-brain/main/systems/codex-project-workflow.md`
- `https://raw.githubusercontent.com/andylitvinov-design/ai-projects-brain/main/projects/report/PROJECT.md`

Default mode: work autonomously for safe read-only, docs, diagnosis, planning, branch, patch, test, and PR work. Ask only before risky actions: secrets/env changes, deletion, merge to `main`, production deploy, financial/account/access changes, irreversible changes, or broad rewrites.

## Repo-specific safety

- Project purpose, hosting, and important files need verification before implementation work.
- Do not assume a live URL, deploy target, or runtime stack until repo-local docs/config confirm it.
- Mark unclear assumptions as `needs verification`.

## Final report

Always report changed files, checks run, checks not run, risks, and whether project memory needs updates.
