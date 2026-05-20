## Agrandir le logo de 300%

**Fichier**: `src/components/layout/Header.tsx`

**Changement**: Passer la classe du `<img>` logo de `h-10` (40px) à `h-30` (120px) — soit 3× la taille actuelle. Ajuster aussi les attributs `width`/`height` (180×48 → 540×144) pour préserver le ratio et éviter le CLS.

**Impact header**:
- La barre `h-16` (64px) devient trop petite pour contenir un logo de 120px. Je passe la hauteur du header à `h-32` (128px) pour laisser respirer le logo + padding vertical.
- Le reste de la nav (menu desktop, CTA WhatsApp, bouton "Obtenir des soumissions", burger mobile) reste inchangé et s'aligne verticalement automatiquement via `flex items-center`.

**Mobile**: même classe `h-30` appliquée — le logo reste responsive (largeur auto). Le menu burger reste à droite.

**Hors scope**: aucune autre modification (footer, autres pages, tokens de design).
