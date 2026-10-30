/**
 * Vanilla behaviour for the specimens that actually have behaviour.
 *
 * Only twelve of the hundred units hold state; the rest are form. A JS pane on
 * a static button would be filler, so this map is deliberately sparse and the
 * JS tab appears only when an entry exists.
 *
 * Each snippet is written against the markup the HTML tab produces (`data-on`,
 * `aria-pressed`, `.sp-*` classes) and runs after it, in a plain `<script>`.
 * This is a second source of truth next to `src/components/specimens/live.tsx`:
 * when a component's interaction changes, its snippet has to change with it.
 */

export type Behavior = {
  /** Self-contained vanilla script, ready to paste under the HTML fragment. */
  js: string;
  /** One line shown under the tabs. */
  note: string;
};

export const BEHAVIORS: Record<number, Behavior> = {
  // 020 — load button: spinner + «Ждём» → «Готово».
  20: {
    note: "Клик переводит кнопку из ожидания в готовность: иконка прячется, текст меняется.",
    js: `const button = document.querySelector(".sp-load");
const icon = button.querySelector(".spin");

// The component can leave more than one text node inside the button, so the
// label is rebuilt rather than patched in place.
const setLabel = (text) => {
  [...button.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .forEach((node) => node.remove());
  button.append(text);
};

button.addEventListener("click", () => {
  const done = button.dataset.loading !== "false";
  button.dataset.loading = String(!done);
  icon.style.display = done ? "none" : "";
  setLabel(done ? "Готово" : "Ждём");
});`,
  },

  // 024 — pair: two buttons, one active.
  24: {
    note: "Пара кнопок: активная получает data-on=\"true\", вторая — \"false\".",
    js: `const group = document.querySelector(".sp-pair");
const items = [...group.querySelectorAll("[data-on]")];

group.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !items.includes(button)) return;
  items.forEach((item) => (item.dataset.on = String(item === button)));
});`,
  },

  // 071 — removable chip.
  71: {
    note: "Крестик снимает чип. Возврат — уже ваша логика списка.",
    js: `const chip = document.querySelector(".sp-rem");

chip.querySelector("button").addEventListener("click", () => {
  chip.remove();
});`,
  },

  // 084 — switch.
  84: {
    note: "data-on и aria-pressed переключаются вместе: состояние читается и глазом, и скринридером.",
    js: `const toggle = document.querySelector(".sp-switch");

toggle.addEventListener("click", () => {
  const on = toggle.dataset.on !== "true";
  toggle.dataset.on = String(on);
  toggle.setAttribute("aria-pressed", String(on));
});`,
  },

  // 085 — segmented control.
  85: {
    note: "Один активный сегмент: data-on снимается с соседей.",
    js: `const segments = document.querySelector(".sp-seg");
const items = [...segments.querySelectorAll("[data-on]")];

segments.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !items.includes(button)) return;
  items.forEach((item) => (item.dataset.on = String(item === button)));
});`,
  },

  // 086 — checkbox with a drawn tick.
  86: {
    note: "Галочка — отдельный элемент: при снятии её нужно спрятать, а не только снять data-on.",
    js: `const check = document.querySelector(".sp-check");
const tick = check.querySelector(".box svg");

check.addEventListener("click", () => {
  const on = check.dataset.on !== "true";
  check.dataset.on = String(on);
  if (tick) tick.style.display = on ? "" : "none";
});`,
  },

  // 087 — radio cards.
  87: {
    note: "Две карточки, ровно одна активна.",
    js: `const radios = document.querySelector(".sp-radio");
const items = [...radios.querySelectorAll("[data-on]")];

radios.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !items.includes(button)) return;
  items.forEach((item) => (item.dataset.on = String(item === button)));
});`,
  },

  // 089 — textarea with a live counter.
  89: {
    note: "Счётчик читает maxlength с самой разметки, а не из константы.",
    js: `const field = document.querySelector(".sp-area textarea");
const counter = document.querySelector(".sp-area .cnt");
const max = Number(field.getAttribute("maxlength")) || 80;

field.addEventListener("input", () => {
  counter.textContent = field.value.length + "/" + max;
});`,
  },

  // 091 — OTP: digits only, focus moves forward, backspace moves back.
  91: {
    note: "Одна цифра на поле, авто-переход вперёд и назад по Backspace.",
    js: `const digits = [...document.querySelectorAll(".sp-otp input")];

digits.forEach((input, index) => {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\\D/g, "").slice(-1);
    if (input.value) digits[index + 1]?.focus();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Backspace" && !input.value) digits[index - 1]?.focus();
  });
});`,
  },

  // 092 — stepper.
  92: {
    note: "Кнопки меняют число в span, нижняя граница — ноль.",
    js: `const stepper = document.querySelector(".sp-step");
const value = stepper.querySelector("span");
const [less, more] = stepper.querySelectorAll("button");

const set = (next) => {
  value.textContent = String(Math.max(0, next));
};

less.addEventListener("click", () => set(Number(value.textContent) - 1));
more.addEventListener("click", () => set(Number(value.textContent) + 1));`,
  },

  // 098 — tabs.
  98: {
    note: "Табы — та же группа: активный получает data-on=\"true\".",
    js: `const tabs = document.querySelector(".sp-tabs");
const items = [...tabs.querySelectorAll("[data-on]")];

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !items.includes(button)) return;
  items.forEach((item) => (item.dataset.on = String(item === button)));
});`,
  },

  // 100 — pagination: arrows clamp at the edges.
  100: {
    note: "Стрелка «назад» упирается в первую страницу, номера выбираются напрямую.",
    js: `const pages = document.querySelector(".sp-pages");
const numbers = [...pages.querySelectorAll("[data-on]")];
const previous = pages.querySelector('[aria-label="Назад"]');

const select = (target) => {
  numbers.forEach((item) => (item.dataset.on = String(item === target)));
};

pages.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  if (button === previous) {
    const current = numbers.findIndex((item) => item.dataset.on === "true");
    select(numbers[Math.max(0, current - 1)]);
    return;
  }
  if (numbers.includes(button)) select(button);
});`,
  },
};

export function behaviorOf(id: number): Behavior | undefined {
  return BEHAVIORS[id];
}
