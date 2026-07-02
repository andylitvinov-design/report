# PsiTherapy Firebase Migration

Issue source: `andylitvinov-design/psihotavr#145`.

## Discovery

| Item | Found value |
|---|---|
| Repo | `andylitvinov-design/report` |
| Local implementation | `report-client-cabinet` worktree family |
| Package/runtime | Vite + React |
| Live URL | `https://psitherapy.vercel.app/` |
| Deployment provider | Vercel project `psitherapy` |
| Current Supabase project | `psitherapy`, ref `juzezltvilqozvmuxrvu` |
| Supabase usage | Google Auth only |
| Supabase tables used by code | none found |
| Supabase RPC/storage used by code | none found |
| Auth model | Google login for cabinet/profile |
| File uploads | none found |
| Admin area | no Firebase/Supabase-backed admin data path found |
| Critical flows | login, `/profile`, first intake, self-analysis, advanced AI analysis, results views |

## Current Supabase object map

| Supabase object | Type | Used by code path | Data sensitivity | Firebase target | Migration notes |
|---|---|---|---|---|---|
| `auth.users` | Auth user store | `src/lib/authClient.js` Google login/session lookup | private | Firebase Authentication users | Exported through Auth Admin API before cutover; import/recreate users through Firebase Auth policy as needed. |
| `profiles` | table | not found | n/a | n/a | REST check returned not found; no code usage. |
| `forms` | table | not found | n/a | `forms/{formId}` when backend persistence is added | Current forms/tests are static/local browser state. |
| `questionnaire_submissions` | table | not found | n/a | `submissions/{submissionId}` when backend persistence is added | Current first intake result stays in `localStorage`. |
| `test_results` | table | not found | n/a | `testResults/{resultId}` when backend persistence is added | Current generated results stay in `localStorage`. |
| `leads` | table | not found | n/a | `leads/{leadId}` when lead capture is added | No live data path found. |
| Supabase Storage buckets | storage | not found | n/a | Firebase Storage only if uploads are introduced | No upload path found. |

## Backup status

- Backup directory: `/Users/andriilitvinov/projects/MYPROJECTS/_runtime_backups/psitherapy-supabase-20260702/`
- Auth export: `auth-users-page1.json`
- Backup summary: `backup-summary.json`
- User count at export time: `1`
- Full `supabase db dump` was not usable without `SUPABASE_DB_PASSWORD`; the app has no code usage of public Supabase tables, so the export scope is Auth users plus table absence checks.
- Do not commit backup files.

## Firebase project setup

Recommended project id: `psitherapy` or `psitherapy-prod`.

Enable:

- Firebase Authentication with Google provider.
- Cloud Firestore for future form/submission/result persistence.
- Firebase Storage only if uploads are introduced.

Authorized domains:

- `psitherapy.vercel.app`
- `localhost`

Deployable config files in this repo:

- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`

Required Vercel env names:

| Variable | Runtime | Notes |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | frontend | Public Firebase web config. |
| `VITE_FIREBASE_AUTH_DOMAIN` | frontend | Must match Firebase Auth domain. |
| `VITE_FIREBASE_PROJECT_ID` | frontend | Firebase project id. |
| `VITE_FIREBASE_STORAGE_BUCKET` | frontend | Public Firebase web config; Storage can remain unused. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | frontend | Public Firebase web config. |
| `VITE_FIREBASE_APP_ID` | frontend | Public Firebase web config. |
| `VITE_ADMIN_EMAIL` | frontend | Existing app setting. |

Keep these old Supabase env names until Firebase production login is verified:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Cutover checklist

1. Confirm Firebase CLI or Console access for the Firebase project.
2. Enable Firebase Auth Google provider.
3. Add the authorized domains above.
4. Add the Firebase env names to Vercel Production and Preview.
5. Deploy Firestore rules/indexes.
6. Deploy this branch to a preview and verify `/login` and `/profile`.
7. Merge/deploy production.
8. Verify `https://psitherapy.vercel.app/build-info.json` matches the deployed SHA.
9. Verify Google login opens and returns to `/profile`.
10. Verify first intake/self-analysis/advanced-analysis still work.
11. Only after successful live verification, remove obsolete Supabase env names and mark Supabase `psitherapy` safe to pause/remove.

## Smoke test

| Flow | Expected result |
|---|---|
| `/` signed out | login screen or cabinet auth gate, no crash |
| `/login` | Firebase Google button enabled when Firebase envs exist |
| `/profile` signed out | login screen, no raw backend error |
| Google login | returns to `/profile` and shows cabinet |
| first intake | can complete and show local result |
| advanced AI analysis | can save local result |
| Firestore public read | cannot list private `submissions`, `testResults`, or `leads` |

## Rollback

- Keep the old Supabase project active until Firebase live verification passes.
- Keep Vercel Supabase env names until cutover is verified.
- If Firebase login fails, restore the last production deployment and keep Supabase Auth active.
