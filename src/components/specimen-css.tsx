import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useId, useState } from "react";

type CopyState = "idle" | "copied" | "failed";

/**
 * The CSS recipe under a specimen, with one-click copy.
 *
 * The result is announced through a polite live region: the button label alone
 * is not enough for screen-reader users, and a silent failure looks like a
 * broken button.
 */
export function SpecimenCss({ css }: { css: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const statusId = useId();

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), 2400);
    return () => window.clearTimeout(timer);
  }, [state]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(css);
      setState("copied");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="mt-5">
      <pre className="overflow-x-auto rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-accent shadow-[inset_0_0_0_1px_var(--color-border)]">
        <code>{css}</code>
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
              : "Копировать CSS"}
        </button>
        <span id={statusId} role="status" aria-live="polite" className="text-xs text-muted">
          {state === "copied"
            ? "Рецепт в буфере обмена."
            : state === "failed"
              ? "Браузер запретил доступ к буферу — выделите код и скопируйте вручную."
              : "Ванильный CSS, без переменных проекта."}
        </span>
      </div>
    </div>
  );
}
