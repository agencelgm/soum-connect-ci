import { describe, expect, it } from "vitest";
import { pickNextCommercial } from "./assignment-rotation";

describe("pickNextCommercial", () => {
  it("choisit le commercial servi le moins récemment", () => {
    const last = new Map([
      ["a", "2026-10-09T10:00:00Z"],
      ["b", "2026-10-09T08:00:00Z"],
      ["c", "2026-10-09T12:00:00Z"],
    ]);
    expect(pickNextCommercial(["a", "b", "c"], last)).toBe("b");
  });

  it("donne la priorité à un commercial jamais servi", () => {
    const last = new Map([["a", "2026-10-09T08:00:00Z"]]);
    expect(pickNextCommercial(["a", "new"], last)).toBe("new");
  });

  it("renvoie null sans commercial actif", () => {
    expect(pickNextCommercial([], new Map())).toBeNull();
  });
});
