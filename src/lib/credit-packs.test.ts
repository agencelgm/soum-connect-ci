import { describe, expect, it } from "bun:test";
import { stackUnlimitedUntil } from "./credit-packs";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("stackUnlimitedUntil", () => {
  const now = new Date("2026-07-01T12:00:00Z");

  it("part de now quand aucune date existante", () => {
    const r = stackUnlimitedUntil(null, 30, now);
    expect(r.stacked).toBe(false);
    expect(r.newUntil.getTime()).toBe(now.getTime() + 30 * DAY_MS);
  });

  it("part de now quand la date existante est déjà expirée", () => {
    const past = new Date(now.getTime() - 5 * DAY_MS);
    const r = stackUnlimitedUntil(past, 30, now);
    expect(r.stacked).toBe(false);
    expect(r.baseUsed).toEqual(now);
    expect(r.newUntil.getTime()).toBe(now.getTime() + 30 * DAY_MS);
  });

  it("empile 30 jours sur une date encore active (rachat anticipé)", () => {
    const active = new Date(now.getTime() + 10 * DAY_MS); // expire dans 10 jours
    const r = stackUnlimitedUntil(active, 30, now);
    expect(r.stacked).toBe(true);
    expect(r.baseUsed).toEqual(active);
    expect(r.newUntil.getTime()).toBe(active.getTime() + 30 * DAY_MS);
    // Total : 10 jours restants + 30 jours ajoutés = 40 jours depuis now
    expect(r.newUntil.getTime() - now.getTime()).toBe(40 * DAY_MS);
  });

  it("accepte une string ISO comme entrée", () => {
    const active = new Date(now.getTime() + 3 * DAY_MS);
    const r = stackUnlimitedUntil(active.toISOString(), 30, now);
    expect(r.stacked).toBe(true);
    expect(r.newUntil.getTime()).toBe(active.getTime() + 30 * DAY_MS);
  });

  it("empilements successifs (2 rachats avant expiration)", () => {
    const first = stackUnlimitedUntil(null, 30, now); // now + 30j
    const midway = new Date(now.getTime() + 15 * DAY_MS); // 15 jours plus tard
    const second = stackUnlimitedUntil(first.newUntil, 30, midway);
    expect(second.stacked).toBe(true);
    // Après 2e rachat : first.newUntil + 30j = now + 60j
    expect(second.newUntil.getTime()).toBe(now.getTime() + 60 * DAY_MS);
  });
});