import { describe, expect, it } from "vitest";
import { HELIOS_ROUTES } from "@/lib/helios/shared/routes";

describe("HELIOS_ROUTES", () => {
  it("returns the dashboard route", () => {
    expect(HELIOS_ROUTES.dashboard).toBe("/");
  });

  it("returns a run detail route", () => {
    expect(HELIOS_ROUTES.runDetail("run_123")).toBe("/runs/run_123");
  });
});
