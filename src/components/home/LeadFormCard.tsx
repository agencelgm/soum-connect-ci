import { useLanguage } from "@/lib/language-context";
import { MultiStepLeadForm } from "@/components/lead/MultiStepLeadForm";
import type { AudienceHint } from "@/lib/audience";

interface LeadFormCardProps {
  source?: string;
  audienceHint?: AudienceHint;
}

export function LeadFormCard({ source = "home-lead-form", audienceHint }: LeadFormCardProps) {
  const { t } = useLanguage();
  return (
    <MultiStepLeadForm
      variant="card"
      source={source}
      title={t.leadForm.title}
      audienceHint={audienceHint}
    />
  );
}
