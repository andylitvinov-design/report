# /audit — UI Polish Skill Addendum

Status: optional addendum for `/audit`  
External skill: `jakubkrehel/make-interfaces-feel-better`

Install command when supported by the local agent environment:

```bash
npx skills add jakubkrehel/make-interfaces-feel-better
```

Verified project-local install for Codex + Claude Code:

```bash
npx skills add jakubkrehel/make-interfaces-feel-better --skill make-interfaces-feel-better --agent codex claude-code -y
```

Expected local install result:

- `.agents/skills/make-interfaces-feel-better/` is available to Codex;
- `.claude/skills/make-interfaces-feel-better` points to that project skill for Claude Code;
- `skills-lock.json` pins the external source and hash.

Source URL:

```txt
https://jakub.kr/skills/make-interfaces-feel-better
```

## Purpose

Use this addendum to make audited interfaces feel better, not only technically correct.

This addendum does not replace the core `/audit` protocol. It is an extra UI polish layer after the audit has already checked UX clarity, desktop/mobile layout, interaction, persistence, auth/privacy, code risks, and regression risks.

## If the external skill is installed

If the agent environment has `make-interfaces-feel-better` installed, load and apply it during `/audit`.

The audit issue should include:

```md
## UI polish / make-interfaces-feel-better pass
| Area | Finding | Improvement direction | Implementation note |
|---|---|---|---|
```

## If the external skill is not installed

Do not block the audit.

State in the GitHub issue:

```txt
External UI polish skill not verified/installed in this environment.
Install when supported: npx skills add jakubkrehel/make-interfaces-feel-better
```

Then run the local UI polish checklist below.

## Local UI polish checklist

Evaluate:

1. Visual hierarchy: main action clarity, one clear page goal, quieter secondary actions.
2. Spacing and rhythm: card density, section breathing room, compact but usable mobile spacing.
3. Text density: shorter labels, hints, bullets, collapsed details, natural Russian copy.
4. Motion and feedback: clear loading, gentle success/failure, no distracting transitions.
5. Perceived quality: calm trustworthy feel, consistent colors/borders/shadows/typography, no raw debug UI.
6. Mobile feel: comfortable touch targets, important controls above the fold, balanced sticky/bottom surfaces.
7. Performance feel: reduced visual noise, explained slow areas, conditional expensive UI.

## Required output in audit issue

When this addendum applies, add:

```md
## UI polish pass
- External skill used: YES / NO / NOT VERIFIED
- Install command if missing: `npx skills add jakubkrehel/make-interfaces-feel-better`

| Polish layer | Status | Finding | Recommended improvement |
|---|---|---|---|
| Visual hierarchy | PASS / ISSUE / NOT VERIFIED | | |
| Spacing/rhythm | PASS / ISSUE / NOT VERIFIED | | |
| Text density | PASS / ISSUE / NOT VERIFIED | | |
| Feedback/motion | PASS / ISSUE / NOT VERIFIED | | |
| Perceived quality | PASS / ISSUE / NOT VERIFIED | | |
| Mobile feel | PASS / ISSUE / NOT VERIFIED | | |
| Performance feel | PASS / ISSUE / NOT VERIFIED | | |
```

## Delivery handoff

Do not create vague "make it nicer" tasks. Convert polish findings into concrete implementation instructions:

- which component/card/section;
- what to reduce/move/reorder;
- what text to shorten;
- what spacing/layout to change;
- what mobile breakpoint to verify;
- what should not be touched.

The copy-pasteable handoff prompt must still start with `/delivery`.
