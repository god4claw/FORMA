import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { cssToTailwind } from "@/lib/tailwind";

type CopyState = "idle" | "copied" | "failed";
type Format = "css" | "tailwind";

const HINT: Record<Format, string> = {
  css: "Ванильный CSS, без переменных проекта.",
  tailwind:
    "Сгенерировано из того же рецепта. Значения в [ ] — произвольные, тема не нужна.",
};

/**
 * The recipe under a specimen, in two formats: the CSS as authored, and the
 * same declarations derived into Tailwind utilities.
 *
 * The result is announced through a polite live region: the button label alone
 * is not enough for screen-reader users, and a silent failure looks like a
 * broken button.
 */
export function SpecimenCss({ css }: { css: string }) {
  const [format, setFormat] = useState<Format>("css");
  const [state, setState] = useState<CopyState>("idle");
  const statusId = useId();
  const text = format === "css" ? css : cssToTailwind(css);

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2400);
    return () => window.clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    setState("idle");
  }, [format]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Формат рецепта">
        {(["css", "tailwind"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFormat(value)}
            aria-pressed={format === value}
            className={
              format === value
                ? "rounded-md bg-fg px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-bg"
                : "rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted shadow-[inset_0_0_0_1px_var(--color-border)] hover:text-fg"
            }
          >
            {value === "css" ? "CSS" : "Tailwind"}
          </button>
        ))}
        <span className="text-xs text-muted">{HINT[format]}</span>
      </div>

      <pre className="mt-3 overflow-x-auto rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-accent shadow-[inset_0_0_0_1px_var(--color-border)]">
        <code>{text}</code>
      </pre>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-4 text-sm font-medium text-bg active:scale-[0.96]"
          onClick={copy}
          aria-describedby={statusId}
        >
          {state === "copied" ? (
            <Check size={16} />
          ) : state === "failed" ? (
            <TriangleAlert size={16} />
          ) : (
            <Copy size={16} />
          )}
          {state === "copied"
            ? "Скопировано"
            : state === "failed"
              ? "Не удалось"
              : format === "css"
                ? "Копировать CSS"
                : "Копировать Tailwind"}
        </button>
        <span id={statusId} role="status" aria-live="polite" className="text-xs text-muted">
          {state === "copied"
            ? format === "css"
              ? "Рецепт в буфере обмена."
              : "Классы в буфере обмена."
            : state === "failed"
              ? "Браузер запретил доступ к буферу — выделите код и скопируйте вручную."
              : format === "css"
                ? "Тот же CSS, что в specimens.css."
                : "Выведено из CSS детерминированно: один и тот же рецепт даёт одни и те же классы."}
        </span>
      </div>
    </div>
  );
}
