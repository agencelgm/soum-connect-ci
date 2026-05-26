import { useLanguage } from "@/lib/language-context";
import { MultiStepLeadForm } from "@/components/lead/MultiStepLeadForm";

interface LeadFormCardProps {
  source?: string;
}

export function LeadFormCard({ source = "home-lead-form" }: LeadFormCardProps) {
  const { t } = useLanguage();
  return (
    <MultiStepLeadForm variant="card" source={source} title={t.leadForm.title} />
  );
}