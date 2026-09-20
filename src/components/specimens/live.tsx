import { useRef, useState, type ComponentType } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  Image as ImageIcon,
  Inbox,
  Info,
  LoaderCircle,
  Minus,
  Paperclip,
  Plus,
  Search,
  TriangleAlert,
  X,
} from "lucide-react";

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn((v) => !v)] as const;
}

function BtnInk() {
  return <button className="sp-btn sp-ink-fill">Продолжить</button>;
}
function BtnHair() {
  return <button className="sp-btn sp-hairline">Отмена</button>;
}
function BtnStamp() {
  return <button className="sp-btn sp-stamp">Approve</button>;
}
function BtnPill() {
  return <button className="sp-btn sp-pill">Сохранить</button>;
}
function BtnTerm() {
  return <button className="sp-btn sp-term">[ OK ]</button>;
}
function BtnSwiss() {
  return <button className="sp-btn sp-swiss">Index</button>;
}
function BtnSplit() {
  return (
    <div className="sp-split">
      <button className="main" type="button">
        Экспорт
      </button>
      <button className="menu" type="button" aria-label="Ещё">
        <ChevronDown size={14} />
      </button>
    </div>
  );
}
function BtnDisc() {
  return (
    <button className="sp-btn sp-disc" aria-label="Далее">
      <ArrowRight size={18} />
    </button>
  );
}
function BtnUnder() {
  return (
    <button className="sp-btn sp-under">
      <span>Читать дальше</span>
    </button>
  );
}
function BtnEmboss() {
  return <button className="sp-btn sp-emboss">Нажать</button>;
}
function BtnRing() {
  return <button className="sp-btn sp-ring">Фокус</button>;
}
function BtnArrow() {
  return (
    <button className="sp-btn sp-arrow">
      Дальше
      <ArrowRight size={16} />
    </button>
  );
}
function BtnPress() {
  return <button className="sp-btn sp-press">Press</button>;
}
function BtnWash() {
  return <button className="sp-btn sp-wash">Тихо</button>;
}
function BtnDash() {
  return (
    <button className="sp-btn sp-dash">
      <Plus size={14} />
      Добавить
    </button>
  );
}
function BtnSharp() {
  return <button className="sp-btn sp-sharp">Draw</button>;
}
function BtnLead() {
  return (
    <button className="sp-btn sp-lead">
      <Paperclip size={15} />
      Прикрепить
    </button>
  );
}
function BtnNaked() {
  return <button className="sp-btn sp-naked">Пропустить</button>;
}
function BtnDual() {
  return (
    <button className="sp-dual" type="button">
      <span className="ico">
        <ArrowUpRight size={16} />
      </span>
      <span className="lab">Открыть</span>
    </button>
  );
}
function BtnLoad() {
  const [on, toggle] = useToggle(true);
  return (
    <button className="sp-btn sp-load" onClick={toggle}>
      {on ? (
        <>
          <LoaderCircle size={16} className="spin" />
          Ждём
        </>
      ) : (
        "Готово"
      )}
    </button>
  );
}
function BtnAlert() {
  return <button className="sp-btn sp-alert">Удалить</button>;
}
function BtnOk() {
  return (
    <button className="sp-btn sp-ok">
      <Check size={16} />
      Подтвердить
    </button>
  );
}
function BtnFab() {
  return (
    <button className="sp-btn sp-fab" aria-label="Создать">
      <Plus size={22} />
    </button>
  );
}
function BtnPair() {
  const [on, setOn] = useState<"edit" | "view">("edit");
  return (
    <div className="sp-pair">
      <button type="button" data-on={on === "edit"} onClick={() => setOn("edit")}>
        Правка
      </button>
      <button type="button" data-on={on === "view"} onClick={() => setOn("view")}>
        Просмотр
      </button>
    </div>
  );
}
function SSheet() {
  return (
    <article className="sp-card sp-sheet">
      <div className="k">Карточка</div>
      <h3>Paper Sheet</h3>
      <p>Тёплый лист, одна тень, воздух внутри.</p>
    </article>
  );
}
function SWell() {
  return (
    <div className="sp-well">
      <div className="k">Колодец</div>
      <strong>Inset Well</strong>
    </div>
  );
}
function SOffset() {
  return (
    <article className="sp-offset">
      <h3>Hard Offset</h3>
      <p>Жёсткая тень. Плакат, не продукт.</p>
    </article>
  );
}
function SClip() {
  return (
    <article className="sp-clip">
      <div className="k">Выпуск 07</div>
      <h3>Column Clip</h3>
      <p>Газетная колонка: линейки и узкая мера.</p>
    </article>
  );
}
function STicket() {
  return (
    <div className="sp-ticket">
      <div className="stub">FORMA</div>
      <div className="body">
        <strong>A-014</strong>
        <span>20 сен · ряд 3</span>
      </div>
    </div>
  );
}
function SPolaroid() {
  return (
    <figure className="sp-polaroid">
      <div className="pic" />
      <figcaption>Specimen 030</figcaption>
    </figure>
  );
}
function STech() {
  return (
    <div className="sp-tech">
      <div className="k">GRID / 16</div>
      <h3>Tech Panel</h3>
    </div>
  );
}
function SQuote() {
  return (
    <blockquote className="sp-quote">
      <p>Форма читается раньше цвета.</p>
      <cite>Эталон 032</cite>
    </blockquote>
  );
}
function SSpec() {
  return (
    <div className="sp-spec">
      <div className="row">
        <span>Width</span>
        <span>220</span>
      </div>
      <div className="row">
        <span>Radius</span>
        <span>0</span>
      </div>
      <div className="row">
        <span>Weight</span>
        <span>400</span>
      </div>
    </div>
  );
}
function SFolder() {
  return (
    <div className="sp-folder">
      <div className="tab" />
      <div className="body">
        <strong>Archive</strong>
        <span>12 файлов</span>
      </div>
    </div>
  );
}
function SWin() {
  return (
    <div className="sp-win">
      <div className="bar">
        <i className="dot" />
        <i className="dot" />
        <i className="dot" />
        <span className="ttl">window.app</span>
      </div>
      <div className="pane">Рабочее поле.</div>
    </div>
  );
}
function SStack() {
  return (
    <div className="sp-stack">
      <div className="s" />
      <div className="s" />
      <div className="s">
        <strong>Стопка</strong>
        <span>Три листа</span>
      </div>
    </div>
  );
}
function SRules() {
  return (
    <article className="sp-rules">
      <h3>Rule Box</h3>
      <p>Только верх и низ. Боков нет.</p>
    </article>
  );
}
function SLift() {
  return (
    <article className="sp-lift">
      <h3>Soft Lift</h3>
      <p>Большой размытый офсет.</p>
    </article>
  );
}
function SVoid() {
  return (
    <div className="sp-void">
      <div className="k">Панель</div>
      <h3>Void</h3>
    </div>
  );
}
function SNote() {
  return <div className="sp-note">Заметка на линейке.</div>;
}
function SPost() {
  return (
    <div className="sp-post">
      <div className="mark" />
      <span>FORMA</span>
    </div>
  );
}
function SHsplit() {
  return (
    <article className="sp-hsplit">
      <div className="head">
        <span>Документ</span>
        <span>v2</span>
      </div>
      <div className="body">Шапка отделена от тела.</div>
    </article>
  );
}
function SStat() {
  return (
    <div className="sp-stat">
      <div className="k">Эталоны</div>
      <div className="num">100</div>
      <div className="d">+12 за неделю</div>
    </div>
  );
}
function SCap() {
  return (
    <figure className="sp-cap">
      <div className="pic" />
      <figcaption className="lab">Fig. 44 — Caption</figcaption>
    </figure>
  );
}
function SPin() {
  return (
    <div className="sp-pin">
      <i className="pin" />
      <p>Не забыть радиус.</p>
    </div>
  );
}
function SEnv() {
  return (
    <div className="sp-env">
      <div className="flap" />
      <div className="addr">
        FORMA
        <br />
        Index 100
      </div>
    </div>
  );
}
function TItalic() {
  return <h2 className="sp-type sp-italic">Форма</h2>;
}
function TTight() {
  return (
    <h2 className="sp-type sp-tight">
      Tight
      <br />
      Grotesk
    </h2>
  );
}
function TChapter() {
  return (
    <div className="sp-type sp-chapter">
      <div className="num">Глава 07</div>
      <h2>Начало</h2>
    </div>
  );
}
function TOver() {
  return (
    <div className="sp-type sp-ov">
      <span className="kicker">Рубрика</span>
      <h2>Overline</h2>
    </div>
  );
}
function TStack() {
  return (
    <div className="sp-type sp-stk">
      <span>The</span>
      <span>Form</span>
      <span>Index</span>
    </div>
  );
}
function TGhost() {
  return <h2 className="sp-ghost-t">FORMA</h2>;
}
function TMono() {
  return (
    <pre className="sp-type sp-mono-t">{`src/ui/button
v1.4.2 · 44×12`}</pre>
  );
}
function TDrop() {
  return (
    <div className="sp-type sp-drop">
      <p>Буквица держит абзац. Первая буква на две строки — книжный жест.</p>
    </div>
  );
}
function TRuled() {
  return <h2 className="sp-ruled">Index</h2>;
}
function TKick() {
  return (
    <div className="sp-type sp-kick">
      <div className="k">Эссе</div>
      <h2>Кикер и заголовок</h2>
      <p>Классическая тройка редакционной полосы.</p>
    </div>
  );
}
function TSpine() {
  return <h2 className="sp-spine">Specimen</h2>;
}
function TSc() {
  return <h2 className="sp-type sp-sc">Small Caps Index</h2>;
}
function TPull() {
  return <blockquote className="sp-type sp-pull">Форма раньше цвета.</blockquote>;
}
function TBrack() {
  return <h2 className="sp-brack">[ TITLE ]</h2>;
}
function TStrike() {
  return (
    <p className="sp-type sp-strike">
      <s>Черновик</s>Эталон
    </p>
  );
}
function TBase() {
  return <h2 className="sp-type sp-base">Baseline</h2>;
}
function CFile() {
  return (
    <div className="sp-chip sp-file">
      <span className="ico">
        <FileText size={14} />
      </span>
      <span className="meta">
        brief.pdf
        <small>240 КБ</small>
      </span>
    </div>
  );
}
function CImg() {
  return (
    <div className="sp-chip sp-imgatt">
      <span className="thumb" />
      cover.jpg
    </div>
  );
}
function CPdf() {
  return (
    <div className="sp-chip sp-pdf">
      <span className="mark">PDF</span>
      <span className="meta">
        dossier.pdf
        <small className="sp-sub">12 стр.</small>
      </span>
    </div>
  );
}
function CAudio() {
  return (
    <div className="sp-chip sp-audio">
      <span className="wave" aria-hidden>
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
      note.wav
      <small className="sp-dim">0:18</small>
    </div>
  );
}
function CLink() {
  return (
    <div className="sp-unfurl">
      <span className="dom">
        <i />
        forma.studio
      </span>
      <strong>Каталог эталонов</strong>
    </div>
  );
}
function CTag() {
  return <span className="sp-chip sp-tag">#editorial</span>;
}
function CLive() {
  return (
    <span className="sp-chip sp-live">
      <i className="dot" />
      В эфире
    </span>
  );
}
function CCount() {
  return (
    <span className="sp-count">
      Вложения
      <span className="badge">12</span>
    </span>
  );
}
function CRem() {
  const [on, setOn] = useState(true);
  if (!on) {
    return (
      <button className="sp-btn sp-hairline" onClick={() => setOn(true)}>
        Вернуть
      </button>
    );
  }
  return (
    <span className="sp-chip sp-rem">
      swiss
      <button type="button" aria-label="Снять" onClick={() => setOn(false)}>
        <X size={12} />
      </button>
    </span>
  );
}
function CFaces() {
  return (
    <div className="sp-faces" aria-label="4 человека">
      <span>АН</span>
      <span>МК</span>
      <span>ЛР</span>
      <span>+5</span>
    </div>
  );
}
function CUp() {
  return (
    <div className="sp-up">
      <div className="top">
        <span>moodboard.zip</span>
        <span>62%</span>
      </div>
      <div className="track">
        <div className="bar" />
      </div>
    </div>
  );
}
function CBundle() {
  return (
    <span className="sp-chip sp-bundle">
      <Folder size={16} />
      Референсы
      <small>18</small>
    </span>
  );
}
function CMention() {
  return (
    <span className="sp-chip sp-mention">
      <span className="av">И</span>
      @irina
    </span>
  );
}
function CHash() {
  return (
    <span className="sp-hash">
      #<b>brutal</b>
    </span>
  );
}
function CVer() {
  return <span className="sp-ver">build 1.4.2</span>;
}
function CPrio() {
  return (
    <span className="sp-chip sp-prio">
      <i className="flag" />
      Высокий
    </span>
  );
}
function CDate() {
  return (
    <span className="sp-date">
      <span className="mo">сен</span>
      <span className="day">20</span>
    </span>
  );
}
function CWeight() {
  return (
    <span className="sp-chip sp-weight">
      <ImageIcon size={14} />
      hero.png
      <span className="meta">1.2 МБ</span>
    </span>
  );
}
function KField() {
  return <input className="sp-field" placeholder="Имя эталона" />;
}
function KUline() {
  return <input className="sp-uline" placeholder="Заголовок" />;
}
function KSearch() {
  return (
    <label className="sp-search">
      <Search size={16} />
      <input placeholder="Поиск" />
    </label>
  );
}
function KSwitch() {
  const [on, toggle] = useToggle(true);
  return (
    <button
      className="sp-switch"
      data-on={on}
      onClick={toggle}
      aria-pressed={on}
      aria-label="Переключатель"
      type="button"
    >
      <span className="knob" />
    </button>
  );
}
function KSeg() {
  const [on, setOn] = useState("A");
  return (
    <div className="sp-seg">
      {["A", "B", "C"].map((k) => (
        <button key={k} type="button" data-on={on === k} onClick={() => setOn(k)}>
          {k}
        </button>
      ))}
    </div>
  );
}
function KCheck() {
  const [on, toggle] = useToggle(true);
  return (
    <button className="sp-check" data-on={on} onClick={toggle} type="button">
      <span className="box">{on ? <Check size={12} /> : null}</span>
      Показывать сетку
    </button>
  );
}
function KRadio() {
  const [on, setOn] = useState("quiet");
  return (
    <div className="sp-radio">
      <button type="button" data-on={on === "quiet"} onClick={() => setOn("quiet")}>
        Тихий
        <small>Один акцент</small>
      </button>
      <button type="button" data-on={on === "loud"} onClick={() => setOn("loud")}>
        Плотный
        <small>Заливка и тень</small>
      </button>
    </div>
  );
}
function KRange() {
  const [v, setV] = useState(62);
  return (
    <label className="sp-range">
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(Number(e.target.value))}
      />
    </label>
  );
}
function KArea() {
  const [v, setV] = useState("Заметка дизайнера.");
  return (
    <label className="sp-area">
      <textarea value={v} onChange={(e) => setV(e.target.value)} maxLength={80} />
      <span className="cnt">{v.length}/80</span>
    </label>
  );
}
function KSel() {
  return (
    <button className="sp-sel" type="button">
      Каталог
      <ChevronDown size={16} />
    </button>
  );
}
function KOtp() {
  const [vals, setVals] = useState(["4", "1", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  return (
    <div className="sp-otp">
      {vals.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={v}
          maxLength={1}
          inputMode="numeric"
          aria-label={`Цифра ${i + 1}`}
          onChange={(e) => {
            const n = e.target.value.replace(/\D/g, "").slice(-1);
            const next = [...vals];
            next[i] = n;
            setVals(next);
            if (n) refs.current[i + 1]?.focus();
          }}
        />
      ))}
    </div>
  );
}
function KStep() {
  const [n, setN] = useState(4);
  return (
    <div className="sp-step">
      <button type="button" aria-label="Меньше" onClick={() => setN((v) => Math.max(0, v - 1))}>
        <Minus size={14} />
      </button>
      <span>{n}</span>
      <button type="button" aria-label="Больше" onClick={() => setN((v) => v + 1)}>
        <Plus size={14} />
      </button>
    </div>
  );
}
function HBanner() {
  return (
    <div className="sp-banner">
      <Info size={16} />
      <div>
        <strong>Инфо</strong>
        <span>Черновик сохранён локально.</span>
      </div>
    </div>
  );
}
function HWarn() {
  return (
    <div className="sp-warn">
      <TriangleAlert size={16} />
      Контраст ниже AA
    </div>
  );
}
function HToast() {
  return (
    <div className="sp-toast">
      <span className="ok">
        <Check size={12} />
      </span>
      Скопировано
    </div>
  );
}
function HInline() {
  return (
    <aside className="sp-inline">Не используйте один радиус на карточке и кнопке внутри.</aside>
  );
}
function HEmpty() {
  return (
    <div className="sp-empty">
      <span className="mark">
        <Inbox size={18} />
      </span>
      <strong>Пусто</strong>
      <span>Нет вложений</span>
      <button type="button">Добавить</button>
    </div>
  );
}
function HTabs() {
  const [on, setOn] = useState("Кнопки");
  return (
    <div className="sp-tabs">
      {["Кнопки", "Боксы", "Тайтлы"].map((t) => (
        <button key={t} type="button" data-on={on === t} onClick={() => setOn(t)}>
          {t}
        </button>
      ))}
    </div>
  );
}
function HCrumbs() {
  return (
    <nav className="sp-crumbs" aria-label="Путь">
      <span>Каталог</span>
      <i>
        <ChevronRight size={12} />
      </i>
      <span>Кнопки</span>
      <i>
        <ChevronRight size={12} />
      </i>
      <span>012</span>
    </nav>
  );
}
function HPages() {
  const [on, setOn] = useState(2);
  return (
    <div className="sp-pages">
      <button type="button" aria-label="Назад" onClick={() => setOn((v) => Math.max(1, v - 1))}>
        <ChevronLeft size={16} />
      </button>
      {[1, 2, 3].map((n) => (
        <button key={n} type="button" data-on={on === n} onClick={() => setOn(n)}>
          {n}
        </button>
      ))}
    </div>
  );
}

export const LIVE: Record<number, ComponentType> = {
  1: BtnInk,
  2: BtnHair,
  3: BtnStamp,
  4: BtnPill,
  5: BtnTerm,
  6: BtnSwiss,
  7: BtnSplit,
  8: BtnDisc,
  9: BtnUnder,
  10: BtnEmboss,
  11: BtnRing,
  12: BtnArrow,
  13: BtnPress,
  14: BtnWash,
  15: BtnDash,
  16: BtnSharp,
  17: BtnLead,
  18: BtnNaked,
  19: BtnDual,
  20: BtnLoad,
  21: BtnAlert,
  22: BtnOk,
  23: BtnFab,
  24: BtnPair,
  25: SSheet,
  26: SWell,
  27: SOffset,
  28: SClip,
  29: STicket,
  30: SPolaroid,
  31: STech,
  32: SQuote,
  33: SSpec,
  34: SFolder,
  35: SWin,
  36: SStack,
  37: SRules,
  38: SLift,
  39: SVoid,
  40: SNote,
  41: SPost,
  42: SHsplit,
  43: SStat,
  44: SCap,
  45: SPin,
  46: SEnv,
  47: TItalic,
  48: TTight,
  49: TChapter,
  50: TOver,
  51: TStack,
  52: TGhost,
  53: TMono,
  54: TDrop,
  55: TRuled,
  56: TKick,
  57: TSpine,
  58: TSc,
  59: TPull,
  60: TBrack,
  61: TStrike,
  62: TBase,
  63: CFile,
  64: CImg,
  65: CPdf,
  66: CAudio,
  67: CLink,
  68: CTag,
  69: CLive,
  70: CCount,
  71: CRem,
  72: CFaces,
  73: CUp,
  74: CBundle,
  75: CMention,
  76: CHash,
  77: CVer,
  78: CPrio,
  79: CDate,
  80: CWeight,
  81: KField,
  82: KUline,
  83: KSearch,
  84: KSwitch,
  85: KSeg,
  86: KCheck,
  87: KRadio,
  88: KRange,
  89: KArea,
  90: KSel,
  91: KOtp,
  92: KStep,
  93: HBanner,
  94: HWarn,
  95: HToast,
  96: HInline,
  97: HEmpty,
  98: HTabs,
  99: HCrumbs,
  100: HPages,
};

export function SpecimenLive({ id }: { id: number }) {
  const C = LIVE[id];
  if (!C) return null;
  return <C />;
}
