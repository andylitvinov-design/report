# /audit-fin

`/audit-fin` is sufficient by itself.

Mode: diagnostic, not implementation.

Source of truth:

```txt
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/ry-agent-audit-modes.md
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/audit-fin-loop.md
https://github.com/andylitvinov-design/reiki-yggdrasil/blob/main/docs/audit-fin-failed-repair.md
docs/audit-fin-deep-technical-implementation.md
```

Project mapping:

```txt
https://2mentalica.vercel.app -> andylitvinov-design/report
```

Required chain:

```txt
numeric target -> numeric contract -> visible value -> code/data inspection -> implementation trace -> source-layer matrix -> first divergence layer -> focused hypotheses -> issue -> /delivery prompt
```

Mandatory implementation trace:

```txt
visible value -> component -> state/selection -> data source -> parsing -> formula/helper -> aggregation -> hydration/cache -> formatting -> rendering -> tests
```

Before writing the issue, identify the first layer where expected value becomes wrong actual value.

The issue must include:

- numeric implementation trace;
- inspected files/functions/components;
- expected vs actual;
- first divergence layer;
- confirmed vs likely/unverified findings;
- implementation map;
- deterministic verification plan;
- ready-to-run `/delivery` prompt.

Use labels:

```txt
CODE VERIFIED
API VERIFIED
RUNTIME VERIFIED
DATA VERIFIED
LIKELY
NOT VERIFIED
```

The handoff prompt must start with `/delivery` as the first non-empty line.
