import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const migration = read("supabase/migrations/20260526234500_stabilize_marketplace_workflow.sql");
const leadRoute = read("src/routes/api/public/lead.ts");
const contactRoute = read("src/routes/api/public/contact.ts");
const marketplaceFns = read("src/lib/marketplace.functions.ts");
const marketplaceRoute = read("src/routes/_authenticated.marketplace.tsx");
const leadDetails = read("src/lib/lead-details.ts");

assert(
  migration.includes("ADD COLUMN IF NOT EXISTS non_contact_details"),
  "Migration must add non_contact_details.",
);
assert(
  migration.includes("status = 'published'"),
  "Publishing must set prospect status to published.",
);
assert(
  migration.includes("'unlock_spend'"),
  "Unlock transactions must use the credit_tx_type enum value unlock_spend.",
);
assert(
  !migration.includes("'lead_unlock'"),
  "Migration must not use invalid credit transaction type lead_unlock.",
);
assert(
  migration.includes("prospect_rejected"),
  "Rejected prospects must be blocked from publication.",
);
assert(
  migration.includes("prospect_already_published"),
  "Already published prospects must be blocked from publication.",
);

for (const route of [leadRoute, contactRoute]) {
  assert(route.includes("prospectId"), "Public form endpoints must return/store prospectId.");
  assert(
    route.includes("Database insert failed"),
    "Public form endpoints must fail when DB insert fails.",
  );
  assert(route.includes("leadId: prospectId"), "leadId should be tied to the stored prospect id.");
}

assert(
  marketplaceFns.includes('partner.status !== "approved"'),
  "Marketplace server function must not list leads for unapproved partners.",
);
assert(
  marketplaceFns.includes("non_contact_details"),
  "Marketplace server function must select non_contact_details.",
);

assert(
  marketplaceRoute.includes("sanitizeLeadDetails"),
  "Marketplace UI must sanitize lead details before rendering.",
);
assert(
  !marketplaceRoute.includes('to="/recharger"'),
  "Marketplace UI must not route partners to self-service recharge.",
);

for (const forbiddenKey of ["email", "full_name", "phone", "mobile", "nom"]) {
  assert(
    leadDetails.includes(`"${forbiddenKey}"`),
    `Lead detail sanitizer must block ${forbiddenKey}.`,
  );
}

console.log("Workflow invariants verified.");
