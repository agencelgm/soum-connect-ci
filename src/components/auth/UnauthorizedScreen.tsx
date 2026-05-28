import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { signOutAndClear } from "@/lib/auth-actions";

export function UnauthorizedScreen({ message }: { message?: string }) {
  const qc = useQueryClient();
  const navigate = useNavigate();

  async function reconnect() {
    await signOutAndClear(qc, (to) => navigate({ to, replace: true }));
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border bg-card p-6 text-center space-y-4">
      <h2 className="text-xl font-semibold">Session expirée</h2>
      <p className="text-sm text-muted-foreground">
        {message ?? "Votre session n'est plus valide. Veuillez vous reconnecter pour continuer."}
      </p>
      <Button onClick={reconnect} className="w-full">Se reconnecter</Button>
    </div>
  );
}