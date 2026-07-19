## Objectif

1. Alerter visuellement quand l'accès illimité approche de son expiration (J-7 et J-1).
2. Étendre les avantages du plan Premium (fenêtre d'avance de 3h sur les nouveaux leads) aux partenaires disposant d'un accès illimité actif.

---

## 1. Alertes d'expiration de l'accès illimité

Ajouter une logique commune de calcul du statut d'expiration :
- **Vert / normal** : > 7 jours restants
- **Orange (J-7)** : ≤ 7 jours → bandeau "Votre accès illimité expire dans X jours"
- **Rouge (J-1)** : ≤ 1 jour → bandeau urgent "Votre accès illimité expire demain / aujourd'hui" avec CTA "Renouveler maintenant"
- **Expiré récent (≤ 3j)** : bandeau gris "Votre accès illimité a expiré, renouvelez pour reprendre"

Emplacements :
- `src/routes/_authenticated.espace-partenaire.tsx` — tuile "Accès illimité" : bordure/couleur qui change selon le seuil, badge "Expire dans X j" à J-7, badge urgent à J-1.
- `src/routes/_authenticated.marketplace.tsx` — bandeau du haut déjà présent : ajouter variantes couleur + CTA "Renouveler" à J-7 / J-1.
- Ajouter un petit indicateur en tête de sidebar (`AppShell`) pour les partenaires concernés quand ≤ 7j, afin d'être visible sur toutes les pages.

Extraire un helper `getUnlimitedStatus(unlimited_until)` dans `src/lib/credit-packs.ts` retournant `{ active, daysLeft, level: "ok" | "warning" | "critical" | "expired" }` — testable et réutilisable.

## 2. Traiter les partenaires "illimité" comme "premium" pour la fenêtre d'avance

Actuellement dans la fonction SQL `unlock_lead` :
```sql
IF v_pub.premium_until > now() AND v_partner.tier <> 'premium' THEN
  RAISE 'premium_window_active';
END IF;
```

Migration : modifier `unlock_lead` pour aussi laisser passer les partenaires dont `unlimited_until > now()` :
```sql
IF v_pub.premium_until > now()
   AND v_partner.tier <> 'premium'
   AND (v_partner.unlimited_until IS NULL OR v_partner.unlimited_until <= now()) THEN
  RAISE 'premium_window_active';
END IF;
```

Côté UI marketplace (`LeadCard`) : le badge "Avance Premium" et l'autorisation d'unlock pendant la fenêtre doivent aussi apparaître pour `isUnlimitedActive`. Remplacer les conditions `isPremium` par `hasPriorityAccess = isPremium || isUnlimitedActive` sur :
- affichage du badge doré + compte à rebours
- bouton actif pendant la fenêtre premium
- message explicatif "réservé Premium/Illimité" pour les autres

Mettre à jour le mapping du message d'erreur `premium_window_active` pour mentionner "clients Premium ou Illimité".

## 3. Comparatif tarifaire

Sur `/recharger`, préciser dans la colonne Illimité : "Accès prioritaire (3h d'avance sur chaque nouveau lead)" — même bénéfice que Premium.

---

## Détails techniques

**Fichiers modifiés :**
- `src/lib/credit-packs.ts` — ajout `getUnlimitedStatus()` + tests
- `src/lib/credit-packs.test.ts` — cas J-8, J-7, J-1, J-0, expiré
- `src/routes/_authenticated.espace-partenaire.tsx` — tuile dynamique
- `src/routes/_authenticated.marketplace.tsx` — bandeau + `hasPriorityAccess`
- `src/routes/_authenticated.recharger.tsx` — mention avantage prioritaire
- `src/components/layout/AppShell.tsx` — indicateur sidebar (optionnel, si visible partout souhaité)
- `src/lib/marketplace.functions.ts` — libellé d'erreur
- Migration SQL — remplacement de la fonction `unlock_lead`

**Note :** la fenêtre d'avance reste à **3h** (valeur actuelle en base). Tu as mentionné 4h — dis-moi si tu veux aussi la passer à 4h et j'ajouterai la modification de `publish_prospect_as_lead` (`interval '3 hours'` → `'4 hours'`).