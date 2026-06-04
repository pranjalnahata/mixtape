import { CreateFlow } from "@/components/create-flow";
import { PageShell } from "@/components/page-shell";

export const dynamic = "force-dynamic";

export default function CreatePage() {
  return (
    <PageShell className="max-w-6xl">
      <CreateFlow />
    </PageShell>
  );
}
