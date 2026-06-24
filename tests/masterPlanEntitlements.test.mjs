import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canCreateClient,
  canCreatePaidService,
  canCreateService,
  canCreateTemplate,
  canHidePublication,
  canUploadPhotoToday,
} from "../src/lib/masterPlanEntitlements.js";
import {
  getDefaultMasterPlanForEmail,
  getMasterPlanStorageKey,
  resolveStoredMasterPlan,
} from "../src/lib/masterPlanStorage.js";

describe("master plan entitlements", () => {
  it("blocks Start after exact free limits and all service actions", () => {
    assert.equal(canCreateTemplate("start", 6).allowed, true);
    assert.equal(canCreateTemplate("start", 7).allowed, false);
    assert.equal(canUploadPhotoToday("start", 6).allowed, true);
    assert.equal(canUploadPhotoToday("start", 7).allowed, false);
    assert.equal(canCreateClient("start", 4).allowed, true);
    assert.equal(canCreateClient("start", 5).allowed, false);
    assert.equal(canCreateService("start", 0).allowed, false);
    assert.equal(canCreatePaidService("start", 0).allowed, false);
    assert.equal(canHidePublication("start", 0).allowed, false);
  });

  it("allows Practic free services up to three but blocks paid services and hiding", () => {
    assert.equal(canCreateTemplate("practic", 24).allowed, true);
    assert.equal(canCreateTemplate("practic", 25).allowed, false);
    assert.equal(canUploadPhotoToday("practic", 19).allowed, true);
    assert.equal(canUploadPhotoToday("practic", 20).allowed, false);
    assert.equal(canCreateClient("practic", 9).allowed, true);
    assert.equal(canCreateClient("practic", 10).allowed, false);
    assert.equal(canCreateService("practic", 2).allowed, true);
    assert.equal(canCreateService("practic", 3).allowed, false);
    assert.equal(canCreatePaidService("practic", 0).allowed, false);
    assert.equal(canHidePublication("practic", 0).allowed, false);
  });

  it("allows Master paid services and hiding up to ten controlled units", () => {
    assert.equal(canCreateTemplate("master", 49).allowed, true);
    assert.equal(canCreateTemplate("master", 50).allowed, false);
    assert.equal(canUploadPhotoToday("master", 39).allowed, true);
    assert.equal(canUploadPhotoToday("master", 40).allowed, false);
    assert.equal(canCreateClient("master", 24).allowed, true);
    assert.equal(canCreateClient("master", 25).allowed, false);
    assert.equal(canCreateService("master", 9).allowed, true);
    assert.equal(canCreateService("master", 10).allowed, false);
    assert.equal(canCreatePaidService("master", 9).allowed, true);
    assert.equal(canCreatePaidService("master", 10).allowed, false);
    assert.equal(canHidePublication("master", 9).allowed, true);
    assert.equal(canHidePublication("master", 10).allowed, false);
  });
});

describe("master plan storage defaults", () => {
  it("uses Start for unknown users and Practic for the configured admin email", () => {
    assert.equal(getDefaultMasterPlanForEmail("", "owner@example.com"), "start");
    assert.equal(getDefaultMasterPlanForEmail("client@example.com", "owner@example.com"), "start");
    assert.equal(getDefaultMasterPlanForEmail("OWNER@example.com", "owner@example.com"), "practic");
  });

  it("builds per-email localStorage keys without exposing secrets", () => {
    assert.equal(getMasterPlanStorageKey(" Owner@Example.COM "), "psitherapy:master-plan:owner@example.com");
    assert.equal(getMasterPlanStorageKey(""), "psitherapy:master-plan:anonymous");
  });

  it("lets a saved valid local plan override the default", () => {
    const storage = new Map();
    const localStorageLike = {
      getItem(key) {
        return storage.get(key) || null;
      },
      setItem(key, value) {
        storage.set(key, value);
      },
    };
    localStorageLike.setItem(getMasterPlanStorageKey("owner@example.com"), "master");

    assert.equal(
      resolveStoredMasterPlan({
        email: "owner@example.com",
        adminEmail: "owner@example.com",
        storage: localStorageLike,
      }),
      "master",
    );
  });
});
