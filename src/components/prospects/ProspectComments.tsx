import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addProspectComment, listProspectComments } from "@/lib/commercial.functions";

export function ProspectComments({ prospectId }: { prospectId: string }) {
  const listFn = useServerFn(listProspectComments);
  const addFn = useServerFn(addProspectComment);
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const { data } = useQuery({
    queryKey: ["prospect-comments", prospectId],
    queryFn: () => listFn({ data: { prospect_id: prospectId } }),
  });

  async function save() {
    if (!body.trim()) return;
    setSaving(true);
    try {
      await addFn({ data: { prospect_id: prospectId, body } });
      setBody("");
      toast.success("Commentaire enregistré");
      qc.invalidateQueries({ queryKey: ["prospect-comments", prospectId] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 font-semibold">
        <MessageSquare className="h-4 w-4" /> Commentaires
      </h3>
      <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} placeholder="Ajouter un commentaire…" />
      <Button size="sm" disabled={saving || !body.trim()} onClick={save}>
        {saving ? "Enregistrement…" : "Enregistrer"}
      </Button>
      <div className="space-y-2">
        {data?.comments.map((c) => (
          <div key={c.id} className="rounded border bg-muted/30 p-2 text-sm">
            <div className="text-xs text-muted-foreground">
              {c.author_name ?? "—"} · {new Date(c.created_at).toLocaleString("fr-FR")}
            </div>
            <p className="whitespace-pre-wrap">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
