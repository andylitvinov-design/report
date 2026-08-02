# PsiTherapy Integration With Homeopath and Alchemy Method

## Source hierarchy

1. Practitioner-entered values for the current client in the ChatGPT project `Homeopath`.
2. Canonical method registry: `andylitvinov-design/alchemy-method/method-source-registry.json`.
3. Canonical method/report logic in `andylitvinov-design/alchemy-method`.
4. Report-agent standards in `andylitvinov-design/ai-projects-brain`.
5. This repository for UI, cabinet, PDF, questionnaire, and runtime implementation.

This repository must not redefine Dao, Wu Xing, psycho-homeopathy, Bach, remedy, or session interpretation rules.

## Project meanings

- **Homeopath**: ChatGPT practitioner workflow where client values are entered and a report draft is generated.
- **PsiTherapy**: client-facing portal at `https://psitherapy.vercel.app/`.
- **report repo**: implementation source for PsiTherapy and the beautiful report design.
- **alchemy-method**: source of truth for interpretation.

## Required report pipeline

```text
entered values
→ normalized structured case
→ canonical interpretation
→ practitioner review
→ approved report payload
→ PsiTherapy visual rendering
→ PDF/client cabinet
```

## Required report metadata

Every persisted or exported report should support:

- `client_id` (private/anonymized as appropriate)
- `report_id`
- `created_at`
- `reviewed_at`
- `practitioner_approved`
- `method_version`
- `method_commit_sha`
- `report_schema_version`
- `source_values`
- `interpretation`
- `uncertainty_notes`
- `next_review_date`

## Agent rules

Before changing report content or report-generation logic:

1. Read this file.
2. Read `alchemy-method/KNOWLEDGE-HUB.md`.
3. Read `alchemy-method/method-source-registry.json`.
4. Read `alchemy-method/portal/PSITHERAPY-HOMEOPATH-INTEGRATION.md`.
5. Read the relevant canonical method/report files.
6. Use this repo only for product implementation and visual delivery.

Do not:
- invent missing client values;
- silently alter values entered in Homeopath;
- publish without practitioner approval;
- expose identifiable client data in public examples;
- make autonomous medical diagnoses or guarantees.

## Business flow

```text
landing
→ intake/test
→ Homeopath analysis draft
→ practitioner-approved report
→ monthly plan
→ weekly check-ins
→ second-session review
→ next cycle or completion
```

This is the preferred future architecture for PsiTherapy.
