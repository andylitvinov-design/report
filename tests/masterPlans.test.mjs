import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  MASTER_PLAN_IDS,
  getMasterPlan,
  getMasterPlanLimits,
  masterPlans,
  normalizeMasterPlanId,
} from "../src/lib/masterPlans.js";

describe("master plan config", () => {
  it("defines Start, Practic, and Master in a stable order", () => {
    assert.deepEqual(masterPlans.map((plan) => plan.id), [
      MASTER_PLAN_IDS.START,
      MASTER_PLAN_IDS.PRACTIC,
      MASTER_PLAN_IDS.MASTER,
    ]);
  });

  it("falls back to Start for unknown plan ids", () => {
    assert.equal(normalizeMasterPlanId("unknown"), MASTER_PLAN_IDS.START);
    assert.equal(getMasterPlan("unknown").id, MASTER_PLAN_IDS.START);
  });

  it("keeps exact published limits for each plan", () => {
    assert.deepEqual(getMasterPlanLimits("start"), {
      maxPlaceTemplates: 7,
      dailyPhotoUploads: 7,
      maxClients: 5,
      servicesEnabled: false,
      freeTrialServicesLimit: 0,
      paidServicesEnabled: false,
      canHidePublications: false,
      maxHiddenPublications: 0,
      maxPaidOrPlacedUnits: 0,
    });

    assert.deepEqual(getMasterPlanLimits("practic"), {
      maxPlaceTemplates: 25,
      dailyPhotoUploads: 20,
      maxClients: 10,
      servicesEnabled: true,
      freeTrialServicesLimit: 3,
      paidServicesEnabled: false,
      canHidePublications: false,
      maxHiddenPublications: 0,
      maxPaidOrPlacedUnits: 3,
    });

    assert.deepEqual(getMasterPlanLimits("master"), {
      maxPlaceTemplates: 50,
      dailyPhotoUploads: 40,
      maxClients: 25,
      servicesEnabled: true,
      freeTrialServicesLimit: 10,
      paidServicesEnabled: true,
      canHidePublications: true,
      maxHiddenPublications: 10,
      maxPaidOrPlacedUnits: 10,
    });
  });
});
