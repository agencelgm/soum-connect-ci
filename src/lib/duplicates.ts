export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

export function normalizePhone(phone: string | null | undefined): string {
  const digits = (phone ?? "").replace(/\D+/g, "");
  return digits.length > 8 ? digits.slice(-8) : digits;
}

export function normalizeText(v: string | null | undefined): string {
  return (v ?? "")
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export type DuplicateInfo = {
  email: boolean;
  phone: boolean;
  emailMatches: string[]; // ids of other items sharing email
  phoneMatches: string[];
};

export function computeDuplicates<T extends { id: string }>(
  items: T[],
  getEmail: (item: T) => string | null | undefined,
  getPhone: (item: T) => string | null | undefined,
): Map<string, DuplicateInfo> {
  const byEmail = new Map<string, string[]>();
  const byPhone = new Map<string, string[]>();
  for (const it of items) {
    const e = normalizeEmail(getEmail(it));
    const p = normalizePhone(getPhone(it));
    if (e) {
      const arr = byEmail.get(e) ?? [];
      arr.push(it.id);
      byEmail.set(e, arr);
    }
    if (p) {
      const arr = byPhone.get(p) ?? [];
      arr.push(it.id);
      byPhone.set(p, arr);
    }
  }
  const result = new Map<string, DuplicateInfo>();
  for (const it of items) {
    const e = normalizeEmail(getEmail(it));
    const p = normalizePhone(getPhone(it));
    const emailGroup = e ? (byEmail.get(e) ?? []) : [];
    const phoneGroup = p ? (byPhone.get(p) ?? []) : [];
    const emailDup = emailGroup.length > 1;
    const phoneDup = phoneGroup.length > 1;
    if (emailDup || phoneDup) {
      result.set(it.id, {
        email: emailDup,
        phone: phoneDup,
        emailMatches: emailGroup.filter((id) => id !== it.id),
        phoneMatches: phoneGroup.filter((id) => id !== it.id),
      });
    }
  }
  return result;
}