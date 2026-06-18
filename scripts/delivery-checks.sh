#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
status_file="${1:-$root/.delivery/status.json}"

cd "$root"

run_if_script_exists() {
  local script_name="$1"
  if [ -f package.json ] && node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['$script_name'] ? 0 : 1)"; then
    echo "== Running npm run $script_name =="
    npm run "$script_name"
  else
    echo "== Skipping $script_name: script not found =="
  fi
}

require_file() {
  local file="$1"
  if [ ! -f "$file" ]; then
    echo "Missing required shared delivery file: $file" >&2
    exit 1
  fi
}

require_text() {
  local pattern="$1"
  local file="$2"
  if ! grep -Eiq "$pattern" "$file"; then
    echo "Missing required pattern '$pattern' in $file" >&2
    exit 1
  fi
}

echo "== Checking /delivery docs =="
required_shared_files=(
  "AGENTS.md"
  ".claude/commands/delivery.md"
  ".claude/skills/delivery/SKILL.md"
  "docs/delivery-loop-program.md"
  "docs/delivery-loop-technical-details.md"
  "docs/delivery-loop-source-patterns-and-live-proof.md"
  ".delivery/status.schema.json"
  "scripts/delivery-status.sh"
  ".github/pull_request_template.md"
)

for required_file in "${required_shared_files[@]}"; do
  require_file "$required_file"
done

task_specific_docs=(
  "docs/first-intake-analysis-dialog-plan.md"
)

for task_doc in "${task_specific_docs[@]}"; do
  if [ -f "$task_doc" ]; then
    echo "== Task-specific doc available when relevant: $task_doc =="
  else
    echo "== Optional task-specific doc not present; not a global /delivery blocker: $task_doc =="
  fi
done

require_text "FINAL RESULT VERIFICATION GATE|Final Result Verification Gate" ".claude/commands/delivery.md"
require_text "Original Request Contract" ".claude/commands/delivery.md"
require_text "PASS.*PARTIAL.*FAIL.*NOT VERIFIED|PARTIAL.*FAIL.*NOT VERIFIED" ".claude/commands/delivery.md"
require_text "Implementation is not completion" "docs/delivery-loop-program.md"
require_text "Spiral Validator-Critic Loop" ".claude/commands/delivery.md"
require_text "spiralValidatorCritic" "docs/delivery-loop-technical-details.md"
require_text "https://myalchemy.vercel.app" "AGENTS.md"

if [[ -f "$status_file" ]]; then
  echo "== Validating result_verification status =="
  node - "$status_file" <<'NODE'
const fs = require('fs');
const status = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const rv = status.result_verification;
if (!rv || !Array.isArray(rv.requirements)) throw new Error('result_verification.requirements must be present');
const allowed = new Set(['PASS', 'PARTIAL', 'FAIL', 'NOT VERIFIED']);
const notPass = [];
for (const [index, item] of rv.requirements.entries()) {
  if (!item.requirement) throw new Error(`requirement ${index + 1} is missing requirement`);
  if (!allowed.has(item.status)) throw new Error(`requirement ${index + 1} has invalid status`);
  if (!item.evidence) throw new Error(`requirement ${index + 1} is missing evidence`);
  if (!item.verification_method) throw new Error(`requirement ${index + 1} is missing verification_method`);
  if (item.status !== 'PASS') notPass.push(item.requirement);
}
if (notPass.length && rv.merge_readiness === 'Ready') {
  throw new Error('merge_readiness cannot be Ready when requirements are not PASS');
}
if (Number(rv.repair_attempts || 0) > 2) throw new Error('repair_attempts cannot exceed 2');

const critic = status.spiralValidatorCritic;
if (critic !== undefined) {
  const verdicts = new Set([
    'READY_FOR_MERGE',
    'READY_WITH_NOTES',
    'IMPROVE',
    'IMPROVE_MINOR',
    'SAFETY_STOP',
    'NEEDS_HUMAN_DECISION',
  ]);
  const criticStatuses = new Set(['PASS', 'IMPROVE', 'PARTIAL', 'FAIL', 'NOT VERIFIED']);
  if (!Number.isInteger(critic.loopNumber) || critic.loopNumber < 1 || critic.loopNumber > 3) {
    throw new Error('spiralValidatorCritic.loopNumber must be 1, 2, or 3');
  }
  if (!verdicts.has(critic.verdict)) throw new Error('spiralValidatorCritic.verdict is invalid');
  if (!Array.isArray(critic.requirements) || critic.requirements.length === 0) {
    throw new Error('spiralValidatorCritic.requirements must be a non-empty array');
  }
  const criticNotPass = [];
  for (const [index, item] of critic.requirements.entries()) {
    if (!item.requirement) throw new Error(`critic requirement ${index + 1} is missing requirement`);
    if (!criticStatuses.has(item.status)) throw new Error(`critic requirement ${index + 1} has invalid status`);
    if (!item.evidence) throw new Error(`critic requirement ${index + 1} is missing evidence`);
    if (!item.nextAction) throw new Error(`critic requirement ${index + 1} is missing nextAction`);
    if (item.status !== 'PASS') criticNotPass.push(item.requirement);
  }
  const nextPlan = Array.isArray(critic.nextImprovementPlan) ? critic.nextImprovementPlan.filter(Boolean) : [];
  const safetyRisks = Array.isArray(critic.safetyRisks) ? critic.safetyRisks.filter(Boolean) : [];
  const documentedGaps = [
    ...(Array.isArray(critic.notVerified) ? critic.notVerified : []),
    ...(Array.isArray(critic.missing) ? critic.missing : []),
    ...safetyRisks,
  ].filter(Boolean);
  if (critic.verdict === 'READY_FOR_MERGE' && criticNotPass.length) {
    throw new Error('spiralValidatorCritic READY_FOR_MERGE requires all critic requirements PASS');
  }
  if (critic.verdict === 'READY_WITH_NOTES' && criticNotPass.length && documentedGaps.length === 0) {
    throw new Error('spiralValidatorCritic READY_WITH_NOTES with non-PASS requirements must document gaps');
  }
  if ((critic.verdict === 'IMPROVE' || critic.verdict === 'IMPROVE_MINOR') && nextPlan.length === 0) {
    throw new Error('spiralValidatorCritic IMPROVE/IMPROVE_MINOR requires nextImprovementPlan');
  }
  if (critic.verdict === 'SAFETY_STOP' && safetyRisks.length === 0) {
    throw new Error('spiralValidatorCritic SAFETY_STOP requires safetyRisks');
  }
  if (critic.loopNumber === 3 && critic.verdict === 'IMPROVE') {
    throw new Error('spiralValidatorCritic loopNumber 3 cannot remain IMPROVE');
  }
}
NODE
fi

if [ -f package-lock.json ]; then
  echo "== Installing with npm ci =="
  npm ci
elif [ -f pnpm-lock.yaml ]; then
  echo "== Installing with pnpm =="
  corepack enable || true
  pnpm install --frozen-lockfile
elif [ -f yarn.lock ]; then
  echo "== Installing with yarn =="
  corepack enable || true
  yarn install --frozen-lockfile
else
  echo "== No known lockfile found; skipping install =="
fi

run_if_script_exists lint
run_if_script_exists typecheck
run_if_script_exists check
run_if_script_exists build
