import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  FileText,
  Folder,
  Image as ImageIcon,
  Paperclip,
  Search,
} from "lucide-react";
import { Shell } from "@/components/layout";

export const Route = createFileRoute("/studio")({ component: Studio });

function Studio() {
  const [seg, setSeg] = useState("Макет");
  const [on, setOn] = useState(true);
  const [tab, setTab] = useState("Черновик");

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <p className="font-mono text-xs tracking-[0.22em] text-muted">STUDIO · COMPOSITION</p>
        <h1 className="mt-3 max-w-2xl font-display text-[clamp(2.4rem,7vw,4.5rem)] italic leading-[0.95] tracking-tight">
          Эталоны в сборке
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
          Четыре сцены — как те же кнопки, боксы, тайтлы и вложения работают рядом, а не в клетке
          каталога.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="scene">
            <div className="scene-head">
              <h2>Редакционная полоса</h2>
              <span>047 · 056 · 032</span>
            </div>
            <div className="scene-body">
              <div className="rounded-lg bg-paper px-5 py-6 text-ink">
                <div className="text-xs uppercase tracking-[0.16em] text-subtle">Эссе 07</div>
                <h3 className="mt-2 font-display text-4xl italic leading-tight tracking-tight">
                  Форма раньше цвета
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-subtle">
                  Заголовок держит полосу. Кикер шепчет рубрику. Цитата слева — рейкой, не кавычками.
                </p>
                <blockquote className="mt-5 border-l-[3px] border-ink pl-4 font-display text-lg italic">
                  Радиус снаружи равен радиусу внутри плюс поле.
                </blockquote>
                <button className="sp-btn sp-under mt-6 text-ink">
                  <span>Читать дальше</span>
                </button>
              </div>
            </div>
          </article>

          <article className="scene">
            <div className="scene-head">
              <h2>Панель документа</h2>
              <span>001 · 024 · 043</span>
            </div>
            <div className="scene-body">
              <div className="overflow-hidden rounded-lg bg-ink text-paper shadow-[0_0_0_1px_#ffffff14]">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm">brief.pdf</span>
                  <div className="sp-pair sp-pair-ink">
                    <button type="button" data-on={seg === "Макет"} onClick={() => setSeg("Макет")}>
                      Макет
                    </button>
                    <button type="button" data-on={seg === "Код"} onClick={() => setSeg("Код")}>
                      Код
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 p-4">
                  <div className="sp-stat w-full">
                    <div className="k">Страницы</div>
                    <div className="num">12</div>
                    <div className="d">готово</div>
                  </div>
                  <div className="sp-stat w-full">
                    <div className="k">Комменты</div>
                    <div className="num">04</div>
                    <div className="d">открыто</div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 px-4 pb-4">
                  <button className="sp-btn sp-hairline">Отмена</button>
                  <button className="sp-btn sp-ink-fill">Продолжить</button>
                </div>
              </div>
            </div>
          </article>

          <article className="scene">
            <div className="scene-head">
              <h2>Композер вложений</h2>
              <span>063 · 064 · 017</span>
            </div>
            <div className="scene-body">
              <div className="rounded-lg bg-surface-2 p-4">
                <label className="sp-search w-full bg-paper">
                  <Search size={16} />
                  <input placeholder="Сообщение команде" />
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="sp-chip sp-file">
                    <span className="ico">
                      <FileText size={14} />
                    </span>
                    <span className="meta">
                      brief.pdf
                      <small>240 КБ</small>
                    </span>
                  </span>
                  <span className="sp-chip sp-imgatt">
                    <span className="thumb" />
                    cover.jpg
                  </span>
                  <span className="sp-chip sp-bundle">
                    <Folder size={16} />
                    Референсы
                    <small>18</small>
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button className="sp-btn sp-lead">
                    <Paperclip size={15} />
                    Прикрепить
                  </button>
                  <button className="sp-btn sp-arrow">
                    Отправить
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="scene">
            <div className="scene-head">
              <h2>Настройки макета</h2>
              <span>084 · 085 · 098</span>
            </div>
            <div className="scene-body">
              <div className="rounded-lg bg-paper p-4 text-ink">
                <div className="sp-tabs">
                  {["Черновик", "Сетка", "Экспорт"].map((t) => (
                    <button key={t} type="button" data-on={tab === t} onClick={() => setTab(t)}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm">Показывать сетку</span>
                  <button
                    className="sp-switch"
                    data-on={on}
                    onClick={() => setOn((v) => !v)}
                    aria-pressed={on}
                    type="button"
                  >
                    <span className="knob" />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-3 text-sm">
                  <ImageIcon size={16} />
                  hero.png
                  <span className="text-subtle">1.2 МБ</span>
                </div>
                <button className="sp-btn sp-ok mt-5 w-full">
                  <Check size={16} />
                  Подтвердить
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>
    </Shell>
  );
}
