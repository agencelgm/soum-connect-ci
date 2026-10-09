/**
 * Rotation « chacun son tour » : choisit le commercial servi le moins récemment.
 * Un commercial n'ayant jamais reçu de prospect est prioritaire.
 */
export function pickNextCommercial(
  commercialIds: string[],
  lastAssignedAt: Map<string, string | null>,
): string | null {
  if (commercialIds.length === 0) return null;
  let best: string | null = null;
  let bestTs = Infinity;
  for (const id of commercialIds) {
    const last = lastAssignedAt.get(id);
    const ts = last ? new Date(last).getTime() : -Infinity;
    if (best === null || ts < bestTs) {
      best = id;
      bestTs = ts;
    }
  }
  return best;
}
