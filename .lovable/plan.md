## Vérifications avant ton prochain test

### 1. Erreur SSR à neutraliser
Le serveur log répète :
```
TypeError: Cannot use 'in' operator to search for 'Symbol(TSS_SERVER_FUNCTION_FACTORY)' in undefined
  at partners.functions.ts:82 (.middleware([requireSupabaseAuth]))
```
→ Pendant le SSR de `/_authenticated`, `requireSupabaseAuth` est `undefined`. Le client bascule en rendu client donc l'utilisateur ne voit rien, mais ça pollue les logs et peut faire échouer un loader protégé.

**Action** : redémarrer le dev server pour purger le cache HMR du plugin TanStack server-fn. Si l'erreur revient après redémarrage → vraie cause (probablement une dépendance circulaire entre `partners.functions.ts` ↔ `partners.server.ts` ↔ un module qui re-import `requireSupabaseAuth`), à corriger en inlinant l'import ou en cassant le cycle.

### 2. Webhook Chariow — vérifier le code
Relire `src/routes/api/public/chariow-webhook.ts` :
- ✅ Idempotence par `license_code` (unique)
- ✅ Ordre de matching : `metadata.partner_id` → email partners → email profiles → intent <30 min → unmatched
- ✅ Consommation de l'intent (`consumed_at` + `chariow_payment_id`)

### 3. Server fn `createChariowIntent` — vérifier
- ✅ Auth requise (`requireSupabaseAuth`)
- ✅ Validation Zod du `productId`
- ✅ INSERT dans `chariow_payment_intents`

### 4. Page Recharger — vérifier
- ✅ `onClickCapture` + `onPointerDownCapture` autour du widget Chariow déclenchent `createChariowIntent` avant l'ouverture
- ✅ Affichage de l'email du compte avec bouton "copier"
- ✅ Bloc "J'ai payé mais je n'ai pas reçu mes crédits" toujours présent comme filet de sécurité

### 5. Test end-to-end (toi)
Une fois le dev server redémarré et l'erreur SSR partie :
1. Ouvrir `/recharger` en étant connecté avec ton compte
2. Vérifier dans la console réseau qu'un POST vers `/_serverFn/createChariowIntent_*` part **avant** que le widget Chariow ne s'ouvre
3. Faire le paiement Chariow (avec n'importe quel email)
4. Vérifier en BDD :
   - `chariow_payment_intents` : ton intent doit avoir `consumed_at` rempli
   - `chariow_payments` : `status='credited'`, `partner_id` rempli
   - `partners.credits_balance` : incrémenté
   - `credit_transactions` : nouvelle ligne `chariow_purchase`

### 6. Notes
- Le widget Chariow est rendu par un script externe : si Chariow met du temps à s'ouvrir, l'intent partira quand même au tout premier clic.
- Fenêtre de 30 min entre intent et webhook : largement suffisant pour un paiement.
- Si plusieurs partenaires tentent d'acheter le même pack dans la même fenêtre, le plus récent gagne (rare en pratique).

## Plan d'exécution

1. Redémarrer le dev server
2. Confirmer dans les logs que l'erreur TSS n'apparaît plus
3. Si elle revient : ouvrir `partners.functions.ts` + `partners.server.ts` + `ghl-partners.server.ts` et casser le cycle d'imports
4. Te donner le feu vert pour ton test
