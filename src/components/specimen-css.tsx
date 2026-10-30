import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useId, useState, type RefObject } from "react";
import { extractSnippet } from "@/lib/snippet";
import { cssToTailwind } from "@/lib/tailwind";

type CopyState = "idle" | "copied" | "failed";
type Format = "css" | "tailwind" | "html";

const FORMATS: { value: Format; label: string }[] = [
  { value: "css", label: "CSS" },
  { value: "tailwind", label: "Tailwind" },
  { value: "html", label: "HTML" },
];

const HINT: Record<Format, string> = {
  css: "Ванильный CSS, без переменных проекта.",
  tailwind: "Сгенерировано из того же рецепта. Значения в [ ] — произвольные, тема не нужна.",
  html: "Разметка + вырезанные из приложения стили и токены: открывается в пустом файле.",
};

const IDLE: Record<Format, string> = {
  css: "Тот же CSS, что в specimens.css.",
  tailwind: "Выведено из CSS детерминированно: один рецепт — один набор классов.",
  html: "Снимок текущего состояния: разметка и стили, без поведения.",
};

const COPIED: Record<Format, string> = {
  css: "Рецепт в буфере обмена.",
  tailwind: "Классы в буфере обмена.",
  html: "Фрагмент в буфере обмена.",
};

const COPY_LABEL: Record<Format, string> = {
  css: "Копировать CSS",
  tailwind: "Копировать Tailwind",
  html: "Копировать HTML",
};

/**
 * The specimen in three take-away formats: the CSS as authored, the same
 * declarations derived into Tailwind utilities, and a self-contained HTML
 * snippet cut from the live DOM.
 *
 * The result is announced through a polite live region: the button label alone
 * is not enough for screen-reader users, and a silent failure looks like a
 * broken button.
 */
export function SpecimenCss({
  css,
  canvas,
}: {
  css: string;
  canvas?: RefObject<HTMLElement | null>;
}) {
  const [format, setFormat] = useState<Format>("css");
  const [state, setState] = useState<CopyState>("idle");
  const [snippet, setSnippet] = useState("");
  const statusId = useId();

  const text = format === "css" ? css : format === "tailwind" ? cssToTailwind(css) : snippet;

  useEffect(() => {
    if (format !== "html") return;
    const element = canvas?.current;
    setSnippet(element ? extractSnippet(element) : "");
  }, [format, canvas]);

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
        {FORMATS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFormat(item.value)}
            aria-pressed={format === item.value}
            className={
              format === item.value
                ? "rounded-md bg-fg px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-bg"
                : "rounded-md px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-muted shadow-[inset_0_0_0_1px_var(--color-border)] hover:text-fg"
            }
          >
            {item.label}
          </button>
        ))}
        <span className="text-xs text-muted">{HINT[format]}</span>
      </div>

      <pre className="mt-3 max-h-[420px] overflow-auto rounded-lg bg-bg p-4 font-mono text-xs leading-relaxed text-accent shadow-[inset_0_0_0_1px_var(--color-border)]">
        <code>{text}</code>
      </pre>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-fg px-4 text-sm font-medium text-bg active:scale-[0.96] disabled:opacity-50"
          onClick={copy}
          aria-describedby={statusId}
          disabled={text.trim().length === 0}
        >
          {state === "copied" ? (
            <Check size={16} />
          ) : state === "failed" ? (
            <TriangleAlert size={16} />
          ) : (
            <Copy size={16} />
          )}
          {state === "copied" ? "Скопировано" : state === "failed" ? "Не удалось" : COPY_LABEL[format]}
        </button>
        <span id={statusId} role="status" aria-live="polite" className="text-xs text-muted">
          {state === "copied"
            ? COPIED[format]
            : state === "failed"
              ? "Браузер запретил доступ к буферу — выделите код и скопируйте вручную."
              : IDLE[format]}
        </span>
      </div>
    </div>
  );
}
