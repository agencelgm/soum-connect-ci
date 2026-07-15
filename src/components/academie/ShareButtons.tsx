import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  url: string;
  title: string;
};

export function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
  const mail = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Je te partage cette vidéo de formation :\n\n${title}\n${url}`)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Lien copié");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        asChild
        size="sm"
        className="bg-[#25D366] text-white hover:bg-[#1ebe57] border border-[#1ebe57]"
      >
        <a href={wa} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={mail}>
          <Mail className="h-4 w-4" />
          Email
        </a>
      </Button>
      <Button size="sm" variant="outline" onClick={copy}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copié" : "Copier le lien"}
      </Button>
    </div>
  );
}