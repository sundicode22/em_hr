import { cardClassName } from "@/config/design-system";
import { cn } from "@/lib/utils";

export function PageShell({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className={cn(cardClassName, "p-8")}>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
      <p className="mt-6 text-sm text-muted-foreground">Coming soon.</p>
    </div>
  );
}
