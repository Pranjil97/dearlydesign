import { cn } from "@/lib/utils/cn";

type OrnamentalDividerProps = {
  className?: string;
  tone?: "gold" | "burgundy";
};

export function OrnamentalDivider({
  className,
  tone = "gold",
}: OrnamentalDividerProps) {
  const stroke =
    tone === "gold"
      ? "text-champagne"
      : "text-[color-mix(in_srgb,var(--burgundy)_55%,transparent)]";

  return (
    <div
      className={cn(
        "flex w-full max-w-[12rem] items-center gap-3",
        stroke,
        className,
      )}
      aria-hidden
    >
      <span className="h-px flex-1 bg-current opacity-50" />
      <svg
        viewBox="0 0 24 24"
        className="size-3.5 shrink-0 opacity-80"
        fill="currentColor"
      >
        <path d="M12 2.5 13.8 10.2 21.5 12 13.8 13.8 12 21.5 10.2 13.8 2.5 12 10.2 10.2 12 2.5Z" />
      </svg>
      <span className="h-px flex-1 bg-current opacity-50" />
    </div>
  );
}
