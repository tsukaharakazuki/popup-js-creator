import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Plus, Trash2, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { createImageElement } from '../../utils/elementFactory';
import type {
  PopupConfig, PopupPosition, TextElement, ImageElement, ButtonElement,
  DividerElement, SpacerElement, BoxElement, CarouselElement, FormElement,
  NpsElement, HtmlElement, SpacingConfig, FormField,
} from '../../types/popup';

type Tab = 'container' | 'element' | 'display';

const tabs: { key: Tab; label: string }[] = [
  { key: 'container', label: 'コンテナ' },
  { key: 'element', label: '要素' },
  { key: 'display', label: '表示設定' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4 first:mt-0">{children}</div>;
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <label className="text-xs text-gray-600 w-20 shrink-0">{label}</label>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function SmallInput({ value, onChange, type = 'text', min, max, step, placeholder, disabled }: { value: string | number; onChange: (val: string) => void; type?: string; min?: number; max?: number; step?: number; placeholder?: string; disabled?: boolean }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

function DeferredInput({ value, onCommit, placeholder, defaultUnit }: { value: string; onCommit: (val: string) => void; placeholder?: string; defaultUnit?: string }) {
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  const commit = () => {
    let v = draft.trim();
    if (defaultUnit && v && /^\d+(\.\d+)?$/.test(v)) {
      v += defaultUnit;
    }
    if (v !== value) onCommit(v);
    setDraft(v);
  };

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') { commit(); (e.target as HTMLInputElement).blur(); } }}
      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
      placeholder={placeholder}
    />
  );
}

function SmallSelect({ value, onChange, children }: { value: string; onChange: (val: string) => void; children: React.ReactNode }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white"
    >
      {children}
    </select>
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="flex items-center gap-1">
      <input
        type="color"
        value={value.startsWith('#') ? value : '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded border border-gray-300 cursor-pointer p-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs bg-white"
      />
    </div>
  );
}

function SpacingInputs({ value, onChange, label }: { value: SpacingConfig; onChange: (v: SpacingConfig) => void; label: string }) {
  return (
    <div className="mb-2">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="grid grid-cols-4 gap-1">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <div key={side} className="text-center">
            <input
              type="number"
              value={value[side]}
              onChange={(e) => onChange({ ...value, [side]: parseInt(e.target.value) || 0 })}
              className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs text-center bg-white"
            />
            <span className="text-[10px] text-gray-400">{side[0].toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Position Grid ----
const positions: PopupPosition[] = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right',
];

function PositionGrid({ value, onChange }: { value: PopupPosition; onChange: (v: PopupPosition) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1 w-24">
      {positions.map((pos) => (
        <button
          key={pos}
          onClick={() => onChange(pos)}
          className={`w-7 h-7 rounded border text-[10px] flex items-center justify-center transition-colors ${
            value === pos
              ? 'bg-blue-600 border-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-400 hover:border-blue-300'
          }`}
          title={pos}
        >
          {value === pos ? '●' : '○'}
        </button>
      ))}
    </div>
  );
}

// ---- Container Tab ----
function ContainerTab() {
  const { state, dispatch } = useEditor();
  const c = state.popup.container;
  const device = state.previewDevice;

  const updateContainer = (updates: Partial<PopupConfig['container']>) => {
    dispatch({ type: 'UPDATE_CONTAINER', updates });
  };

  const activeLabel = device === 'mobile' ? 'モバイル' : device === 'tablet' ? 'タブレット' : 'デスクトップ';

  return (
    <div>
      <SectionLabel>サイズ</SectionLabel>
      <div className="text-[10px] text-blue-500 mb-1">現在: {activeLabel}</div>
      <FieldRow label="幅 (desktop)">
        <DeferredInput value={c.width.desktop} onCommit={(v) => updateContainer({ width: { ...c.width, desktop: v } })} defaultUnit="px" />
      </FieldRow>
      <FieldRow label="幅 (tablet)">
        <DeferredInput value={c.width.tablet ?? c.width.desktop} onCommit={(v) => updateContainer({ width: { ...c.width, tablet: v } })} defaultUnit="px" />
      </FieldRow>
      <FieldRow label="幅 (mobile)">
        <DeferredInput value={c.width.mobile} onCommit={(v) => updateContainer({ width: { ...c.width, mobile: v } })} defaultUnit="%" />
      </FieldRow>
      <FieldRow label="高さ (desktop)">
        <DeferredInput value={c.height.desktop} onCommit={(v) => updateContainer({ height: { ...c.height, desktop: v } })} defaultUnit="px" />
      </FieldRow>
      <FieldRow label="高さ (mobile)">
        <DeferredInput value={c.height.mobile} onCommit={(v) => updateContainer({ height: { ...c.height, mobile: v } })} defaultUnit="px" />
      </FieldRow>

      <SectionLabel>位置</SectionLabel>
      <FieldRow label="位置">
        <PositionGrid value={c.position} onChange={(v) => updateContainer({ position: v })} />
      </FieldRow>

      <SectionLabel>背景</SectionLabel>
      <FieldRow label="背景色">
        <ColorInput value={c.backgroundColor} onChange={(v) => updateContainer({ backgroundColor: v })} />
      </FieldRow>

      <SectionLabel>スタイル</SectionLabel>
      <FieldRow label="角丸">
        <SmallInput type="number" value={c.borderRadius} onChange={(v) => updateContainer({ borderRadius: parseInt(v) || 0 })} />
      </FieldRow>
      <FieldRow label="外枠">
        <select
          value={c.borderStyle}
          onChange={(e) => updateContainer({ borderStyle: e.target.value as 'solid' | 'dashed' | 'none' })}
          className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
        >
          <option value="none">なし</option>
          <option value="solid">実線</option>
          <option value="dashed">破線</option>
        </select>
      </FieldRow>
      {c.borderStyle !== 'none' && (
        <>
          <FieldRow label="枠の太さ">
            <SmallInput type="number" value={c.borderWidth} onChange={(v) => updateContainer({ borderWidth: parseInt(v) || 0 })} />
          </FieldRow>
          <FieldRow label="枠の色">
            <ColorInput value={c.borderColor} onChange={(v) => updateContainer({ borderColor: v })} />
          </FieldRow>
        </>
      )}
      <FieldRow label="影">
        <label className="flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={c.boxShadow.enabled}
            onChange={(e) => updateContainer({ boxShadow: { ...c.boxShadow, enabled: e.target.checked } })}
          />
          有効
        </label>
      </FieldRow>

      <SectionLabel>パディング</SectionLabel>
      <SpacingInputs
        value={c.padding}
        onChange={(v) => updateContainer({ padding: v })}
        label=""
      />
    </div>
  );
}

// ---- Element Tab ----
function ElementTab() {
  const { selectedElement, dispatch } = useEditor();

  if (!selectedElement) {
    return (
      <div className="text-sm text-gray-400 text-center py-8">
        要素を選択してください
      </div>
    );
  }

  const update = (updates: Record<string, unknown>) => {
    dispatch({ type: 'UPDATE_ELEMENT', id: selectedElement.id, updates: updates as Partial<typeof selectedElement> });
  };

  const el = selectedElement;

  return (
    <div>
      <div className="text-xs font-medium text-blue-600 mb-3 px-1">
        {el.type.toUpperCase()} 要素
      </div>

      {/* Margin / Padding common to all */}
      {el.margin && (
        <SpacingInputs
          value={el.margin}
          onChange={(v) => update({ margin: v })}
          label="マージン"
        />
      )}
      {el.padding && (
        <SpacingInputs
          value={el.padding}
          onChange={(v) => update({ padding: v })}
          label="パディング"
        />
      )}

      {el.type === 'text' && <TextFields element={el} update={update} />}
      {el.type === 'image' && <ImageFields element={el} update={update} />}
      {el.type === 'button' && <ButtonFields element={el} update={update} />}
      {el.type === 'divider' && <DividerFields element={el} update={update} />}
      {el.type === 'spacer' && <SpacerFields element={el} update={update} />}
      {el.type === 'box' && <BoxFields element={el} update={update} />}
      {el.type === 'carousel' && <CarouselFields element={el} update={update} />}
      {el.type === 'form' && <FormFields element={el} update={update} />}
      {el.type === 'nps' && <NpsFields element={el} update={update} />}
      {el.type === 'html' && <HtmlFields element={el} update={update} />}
    </div>
  );
}

function TextFields({ element: el, update }: { element: TextElement; update: (u: Record<string, unknown>) => void }) {
  return (
    <>
      <SectionLabel>テキスト</SectionLabel>
      <div className="mb-2">
        <textarea
          value={el.content}
          onChange={(e) => update({ content: e.target.value })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white resize-y"
          rows={3}
        />
      </div>
      <FieldRow label="フォント">
        <SmallInput value={el.fontFamily} onChange={(v) => update({ fontFamily: v })} />
      </FieldRow>
      <FieldRow label="サイズ">
        <SmallInput type="number" value={el.fontSize} onChange={(v) => update({ fontSize: parseInt(v) || 16 })} />
      </FieldRow>
      <FieldRow label="太さ">
        <SmallSelect value={el.fontWeight} onChange={(v) => update({ fontWeight: v })}>
          <option value="normal">通常</option>
          <option value="bold">太字</option>
          <option value="300">300</option>
          <option value="500">500</option>
          <option value="600">600</option>
          <option value="700">700</option>
          <option value="800">800</option>
          <option value="900">900</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="色">
        <ColorInput value={el.color} onChange={(v) => update({ color: v })} />
      </FieldRow>
      <FieldRow label="揃え">
        <SmallSelect value={el.textAlign} onChange={(v) => update({ textAlign: v })}>
          <option value="left">左</option>
          <option value="center">中央</option>
          <option value="right">右</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="行間">
        <SmallInput type="number" value={el.lineHeight} onChange={(v) => update({ lineHeight: parseFloat(v) || 1.5 })} step={0.1} />
      </FieldRow>
      <FieldRow label="リンクURL">
        <SmallInput value={el.linkUrl || ''} onChange={(v) => update({ linkUrl: v || undefined })} placeholder="https://..." />
      </FieldRow>
    </>
  );
}

function ImageFields({ element: el, update }: { element: ImageElement; update: (u: Record<string, unknown>) => void }) {
  return (
    <>
      <SectionLabel>画像</SectionLabel>
      <FieldRow label="src">
        <SmallInput value={el.src} onChange={(v) => update({ src: v })} />
      </FieldRow>
      <FieldRow label="alt">
        <SmallInput value={el.alt} onChange={(v) => update({ alt: v })} />
      </FieldRow>
      <FieldRow label="幅">
        <SmallInput value={el.width} onChange={(v) => update({ width: v })} />
      </FieldRow>
      <FieldRow label="高さ">
        <SmallInput value={el.height} onChange={(v) => update({ height: v })} />
      </FieldRow>
      <FieldRow label="フィット">
        <SmallSelect value={el.objectFit} onChange={(v) => update({ objectFit: v })}>
          <option value="cover">cover</option>
          <option value="contain">contain</option>
          <option value="fill">fill</option>
          <option value="none">none</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="角丸">
        <SmallInput type="number" value={el.borderRadius} onChange={(v) => update({ borderRadius: parseInt(v) || 0 })} />
      </FieldRow>
      <FieldRow label="揃え">
        <SmallSelect value={el.alignment} onChange={(v) => update({ alignment: v })}>
          <option value="left">左</option>
          <option value="center">中央</option>
          <option value="right">右</option>
        </SmallSelect>
      </FieldRow>

      <SectionLabel>リンク設定</SectionLabel>
      <FieldRow label="リンクURL">
        <SmallInput value={el.linkUrl || ''} onChange={(v) => update({ linkUrl: v || undefined })} placeholder="https://..." />
      </FieldRow>
      <FieldRow label="ターゲット">
        <SmallSelect value={el.linkTarget || '_blank'} onChange={(v) => update({ linkTarget: v })}>
          <option value="_blank">新しいタブ</option>
          <option value="_self">同じタブ</option>
        </SmallSelect>
      </FieldRow>
    </>
  );
}

function ButtonFields({ element: el, update }: { element: ButtonElement; update: (u: Record<string, unknown>) => void }) {
  return (
    <>
      <SectionLabel>ボタン</SectionLabel>
      <FieldRow label="ラベル">
        <SmallInput value={el.label} onChange={(v) => update({ label: v })} />
      </FieldRow>
      <FieldRow label="URL">
        <SmallInput value={el.linkUrl} onChange={(v) => update({ linkUrl: v })} />
      </FieldRow>
      <FieldRow label="幅">
        <SmallInput value={el.width} onChange={(v) => update({ width: v })} />
      </FieldRow>
      <FieldRow label="高さ">
        <SmallInput value={el.height} onChange={(v) => update({ height: v })} />
      </FieldRow>
      <FieldRow label="背景色">
        <ColorInput value={el.backgroundColor} onChange={(v) => update({ backgroundColor: v })} />
      </FieldRow>
      <FieldRow label="ホバー色">
        <ColorInput value={el.hoverBackgroundColor} onChange={(v) => update({ hoverBackgroundColor: v })} />
      </FieldRow>
      <FieldRow label="文字色">
        <ColorInput value={el.textColor} onChange={(v) => update({ textColor: v })} />
      </FieldRow>
      <FieldRow label="サイズ">
        <SmallInput type="number" value={el.fontSize} onChange={(v) => update({ fontSize: parseInt(v) || 14 })} />
      </FieldRow>
      <FieldRow label="角丸">
        <SmallInput type="number" value={el.borderRadius} onChange={(v) => update({ borderRadius: parseInt(v) || 0 })} />
      </FieldRow>
      <FieldRow label="揃え">
        <SmallSelect value={el.alignment} onChange={(v) => update({ alignment: v })}>
          <option value="left">左</option>
          <option value="center">中央</option>
          <option value="right">右</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="アクション">
        <SmallSelect value={el.action} onChange={(v) => update({ action: v })}>
          <option value="link">リンク</option>
          <option value="close">閉じる</option>
          <option value="custom">カスタム</option>
        </SmallSelect>
      </FieldRow>
    </>
  );
}

function DividerFields({ element: el, update }: { element: DividerElement; update: (u: Record<string, unknown>) => void }) {
  return (
    <>
      <SectionLabel>区切り線</SectionLabel>
      <FieldRow label="色">
        <ColorInput value={el.color} onChange={(v) => update({ color: v })} />
      </FieldRow>
      <FieldRow label="太さ">
        <SmallInput type="number" value={el.thickness} onChange={(v) => update({ thickness: parseInt(v) || 1 })} />
      </FieldRow>
      <FieldRow label="スタイル">
        <SmallSelect value={el.style} onChange={(v) => update({ style: v })}>
          <option value="solid">実線</option>
          <option value="dashed">破線</option>
          <option value="dotted">点線</option>
        </SmallSelect>
      </FieldRow>
    </>
  );
}

function SpacerFields({ element: el, update }: { element: SpacerElement; update: (u: Record<string, unknown>) => void }) {
  return (
    <>
      <SectionLabel>スペーサー</SectionLabel>
      <FieldRow label="高さ">
        <SmallInput type="number" value={el.height} onChange={(v) => update({ height: parseInt(v) || 16 })} />
      </FieldRow>
    </>
  );
}

function BoxFields({ element: el, update }: { element: BoxElement; update: (u: Record<string, unknown>) => void }) {
  return (
    <>
      <SectionLabel>ボックス</SectionLabel>
      <FieldRow label="方向">
        <SmallSelect value={el.direction} onChange={(v) => update({ direction: v })}>
          <option value="vertical">縦</option>
          <option value="horizontal">横</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="間隔">
        <SmallInput type="number" value={el.gap} onChange={(v) => update({ gap: parseInt(v) || 0 })} />
      </FieldRow>
      <FieldRow label="alignItems">
        <SmallSelect value={el.alignItems} onChange={(v) => update({ alignItems: v })}>
          <option value="flex-start">start</option>
          <option value="center">center</option>
          <option value="flex-end">end</option>
          <option value="stretch">stretch</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="justify">
        <SmallSelect value={el.justifyContent} onChange={(v) => update({ justifyContent: v })}>
          <option value="flex-start">start</option>
          <option value="center">center</option>
          <option value="flex-end">end</option>
          <option value="space-between">space-between</option>
          <option value="space-around">space-around</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="背景色">
        <ColorInput value={el.backgroundColor || ''} onChange={(v) => update({ backgroundColor: v || undefined })} />
      </FieldRow>
      <FieldRow label="角丸">
        <SmallInput type="number" value={el.borderRadius || 0} onChange={(v) => update({ borderRadius: parseInt(v) || 0 })} />
      </FieldRow>
    </>
  );
}

function CarouselFields({ element: el, update }: { element: CarouselElement; update: (u: Record<string, unknown>) => void }) {
  const addSlide = () => {
    if (el.slides.length >= 20) return;
    const newSlide = { id: nanoid(), elements: [createImageElement()] };
    update({ slides: [...el.slides, newSlide] });
  };

  const removeSlide = (index: number) => {
    if (el.slides.length <= 1) return;
    update({ slides: el.slides.filter((_, i) => i !== index) });
  };

  return (
    <>
      <SectionLabel>カルーセル</SectionLabel>
      <FieldRow label="自動再生">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={el.autoPlay} onChange={(e) => update({ autoPlay: e.target.checked })} />
          有効
        </label>
      </FieldRow>
      <FieldRow label="間隔 (ms)">
        <SmallInput type="number" value={el.interval} onChange={(v) => update({ interval: parseInt(v) || 3000 })} />
      </FieldRow>
      <FieldRow label="ドット">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={el.showDots} onChange={(e) => update({ showDots: e.target.checked })} />
          表示
        </label>
      </FieldRow>
      <FieldRow label="矢印">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={el.showArrows} onChange={(e) => update({ showArrows: e.target.checked })} />
          表示
        </label>
      </FieldRow>

      <SectionLabel>スライド管理</SectionLabel>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-600">スライド数: {el.slides.length} / 20</span>
        <button
          type="button"
          onClick={addSlide}
          disabled={el.slides.length >= 20}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
          追加
        </button>
      </div>
      <div className="space-y-1">
        {el.slides.map((slide, i) => (
          <div key={slide.id} className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-xs">
            <span className="flex-1 text-gray-700">スライド {i + 1}</span>
            <button
              type="button"
              onClick={() => removeSlide(i)}
              disabled={el.slides.length <= 1}
              className="p-0.5 text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
              title="削除"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function FormFields({ element: el, update }: { element: FormElement; update: (u: Record<string, unknown>) => void }) {
  const [expandedFieldId, setExpandedFieldId] = useState<string | null>(null);

  const addField = () => {
    const newField: FormField = {
      id: nanoid(),
      fieldType: 'text',
      label: `質問 ${el.fields.length + 1}`,
      name: `field_${el.fields.length + 1}`,
      placeholder: '',
      required: false,
    };
    update({ fields: [...el.fields, newField] });
  };

  const removeField = (index: number) => {
    update({ fields: el.fields.filter((_, i) => i !== index) });
  };

  const updateField = (index: number, fieldUpdates: Partial<FormField>) => {
    const newFields = el.fields.map((f, i) => i === index ? { ...f, ...fieldUpdates } : f);
    update({ fields: newFields });
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= el.fields.length) return;
    const newFields = [...el.fields];
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    update({ fields: newFields });
  };

  return (
    <>
      <SectionLabel>フォーム</SectionLabel>
      <FieldRow label="送信ボタン">
        <SmallInput value={el.submitLabel} onChange={(v) => update({ submitLabel: v })} />
      </FieldRow>
      <FieldRow label="送信先URL">
        <SmallInput value={el.submitUrl} onChange={(v) => update({ submitUrl: v })} />
      </FieldRow>
      <FieldRow label="メソッド">
        <SmallSelect value={el.submitMethod} onChange={(v) => update({ submitMethod: v })}>
          <option value="post">POST</option>
          <option value="get">GET</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="成功メッセージ">
        <SmallInput value={el.successMessage} onChange={(v) => update({ successMessage: v })} />
      </FieldRow>

      <SectionLabel>フィールド管理</SectionLabel>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-600">フィールド数: {el.fields.length}</span>
        <button
          type="button"
          onClick={addField}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-3 h-3" />
          追加
        </button>
      </div>
      <div className="space-y-1">
        {el.fields.map((field, i) => (
          <div key={field.id} className="border border-gray-200 rounded bg-gray-50">
            <div
              className="flex items-center gap-1 px-2 py-1.5 cursor-pointer"
              onClick={() => setExpandedFieldId(expandedFieldId === field.id ? null : field.id)}
            >
              {expandedFieldId === field.id ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
              <span className="flex-1 text-xs text-gray-700 truncate">{field.label || `フィールド ${i + 1}`}</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); moveField(i, -1); }} disabled={i === 0} className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
              <button type="button" onClick={(e) => { e.stopPropagation(); moveField(i, 1); }} disabled={i === el.fields.length - 1} className="p-0.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
              <button type="button" onClick={(e) => { e.stopPropagation(); removeField(i); }} className="p-0.5 text-gray-400 hover:text-red-500" title="削除"><Trash2 className="w-3 h-3" /></button>
            </div>
            {expandedFieldId === field.id && (
              <div className="px-2 pb-2 space-y-1.5 border-t border-gray-200 pt-1.5">
                <div>
                  <label className="text-[10px] text-gray-500">ラベル（質問タイトル）</label>
                  <input type="text" value={field.label} onChange={(e) => updateField(i, { label: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">フィールド名 (name属性)</label>
                  <input type="text" value={field.name} onChange={(e) => updateField(i, { name: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">種類</label>
                  <select value={field.fieldType} onChange={(e) => updateField(i, { fieldType: e.target.value as FormField['fieldType'] })} className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white">
                    <option value="text">テキスト</option>
                    <option value="email">メール</option>
                    <option value="tel">電話番号</option>
                    <option value="select">セレクト</option>
                    <option value="checkbox">チェックボックス</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500">プレースホルダー</label>
                  <input type="text" value={field.placeholder || ''} onChange={(e) => updateField(i, { placeholder: e.target.value })} className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white" placeholder="入力例を表示..." />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" checked={field.required} onChange={(e) => updateField(i, { required: e.target.checked })} />
                    必須
                  </label>
                </div>
                {field.fieldType === 'select' && (
                  <div>
                    <label className="text-[10px] text-gray-500">選択肢（改行区切り）</label>
                    <textarea
                      value={(field.options || []).join('\n')}
                      onChange={(e) => updateField(i, { options: e.target.value.split('\n') })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs bg-white resize-y"
                      rows={3}
                      placeholder="選択肢1&#10;選択肢2&#10;選択肢3"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function NpsFields({ element: el, update }: { element: NpsElement; update: (u: Record<string, unknown>) => void }) {
  return (
    <>
      <SectionLabel>NPS設定</SectionLabel>
      <FieldRow label="最小値">
        <SmallInput type="number" value={el.min} onChange={(v) => update({ min: parseInt(v) || 0 })} />
      </FieldRow>
      <FieldRow label="最大値">
        <SmallInput type="number" value={el.max} onChange={(v) => update({ max: parseInt(v) || 10 })} />
      </FieldRow>
      <FieldRow label="区切り">
        <SmallInput type="number" value={el.step} onChange={(v) => update({ step: parseInt(v) || 1 })} min={1} />
      </FieldRow>

      <SectionLabel>ボタンカラー</SectionLabel>
      <FieldRow label="通常色">
        <ColorInput value={el.buttonColor} onChange={(v) => update({ buttonColor: v })} />
      </FieldRow>
      <FieldRow label="選択色">
        <ColorInput value={el.selectedColor} onChange={(v) => update({ selectedColor: v })} />
      </FieldRow>
      <FieldRow label="文字色">
        <ColorInput value={el.textColor} onChange={(v) => update({ textColor: v })} />
      </FieldRow>
      <FieldRow label="選択文字色">
        <ColorInput value={el.selectedTextColor} onChange={(v) => update({ selectedTextColor: v })} />
      </FieldRow>

      <SectionLabel>送信設定</SectionLabel>
      <FieldRow label="送信ボタン">
        <SmallInput value={el.submitLabel} onChange={(v) => update({ submitLabel: v })} />
      </FieldRow>
      <FieldRow label="送信先URL">
        <SmallInput value={el.submitUrl} onChange={(v) => update({ submitUrl: v })} />
      </FieldRow>
      <FieldRow label="メソッド">
        <SmallSelect value={el.submitMethod} onChange={(v) => update({ submitMethod: v })}>
          <option value="post">POST</option>
          <option value="get">GET</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="成功メッセージ">
        <SmallInput value={el.successMessage} onChange={(v) => update({ successMessage: v })} />
      </FieldRow>
    </>
  );
}

function HtmlFields({ element: el, update }: { element: HtmlElement; update: (u: Record<string, unknown>) => void }) {
  return (
    <>
      <SectionLabel>HTML</SectionLabel>
      <div className="mb-2">
        <textarea
          value={el.content}
          onChange={(e) => update({ content: e.target.value })}
          className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-mono bg-white resize-y"
          rows={6}
        />
      </div>
    </>
  );
}

// ---- Display Rules Tab ----
function DisplayTab() {
  const { state, dispatch } = useEditor();
  const popup = state.popup;
  const dr = popup.displayRules;
  const cb = popup.closeButton;
  const ov = popup.overlay;
  const anim = popup.animation;

  const updateDR = (updates: Partial<typeof dr>) => dispatch({ type: 'UPDATE_DISPLAY_RULES', updates });
  const updateCB = (updates: Partial<typeof cb>) => dispatch({ type: 'UPDATE_CLOSE_BUTTON', updates });
  const updateOV = (updates: Partial<typeof ov>) => dispatch({ type: 'UPDATE_OVERLAY', updates });
  const updateAN = (updates: Partial<typeof anim>) => dispatch({ type: 'UPDATE_ANIMATION', updates });

  return (
    <div>
      <SectionLabel>トリガー</SectionLabel>
      <FieldRow label="種類">
        <SmallSelect
          value={dr.trigger.type}
          onChange={(v) => updateDR({ trigger: { ...dr.trigger, type: v as typeof dr.trigger.type } })}
        >
          <option value="immediate">即時表示</option>
          <option value="delay">遅延</option>
          <option value="scroll">スクロール</option>
          <option value="exit-intent">離脱防止</option>
          <option value="click">クリック</option>
        </SmallSelect>
      </FieldRow>
      {dr.trigger.type === 'delay' && (
        <FieldRow label="秒数">
          <SmallInput
            type="number"
            value={dr.trigger.delaySeconds ?? 3}
            onChange={(v) => updateDR({ trigger: { ...dr.trigger, delaySeconds: parseInt(v) || 3 } })}
          />
        </FieldRow>
      )}
      {dr.trigger.type === 'scroll' && (
        <FieldRow label="スクロール%">
          <SmallInput
            type="number"
            value={dr.trigger.scrollPercent ?? 50}
            onChange={(v) => updateDR({ trigger: { ...dr.trigger, scrollPercent: parseInt(v) || 50 } })}
          />
        </FieldRow>
      )}
      {dr.trigger.type === 'click' && (
        <FieldRow label="セレクタ">
          <SmallInput
            value={dr.trigger.clickSelector ?? ''}
            onChange={(v) => updateDR({ trigger: { ...dr.trigger, clickSelector: v } })}
            placeholder=".my-button"
          />
        </FieldRow>
      )}

      <SectionLabel>表示頻度</SectionLabel>
      <FieldRow label="頻度">
        <SmallSelect
          value={dr.frequency.type}
          onChange={(v) => updateDR({ frequency: { ...dr.frequency, type: v as typeof dr.frequency.type } })}
        >
          <option value="always">毎回</option>
          <option value="once">1回のみ</option>
          <option value="once-per-session">セッション毎</option>
          <option value="every-n-days">N日ごと</option>
        </SmallSelect>
      </FieldRow>
      {dr.frequency.type === 'every-n-days' && (
        <FieldRow label="日数">
          <SmallInput
            type="number"
            value={dr.frequency.days ?? 7}
            onChange={(v) => updateDR({ frequency: { ...dr.frequency, days: parseInt(v) || 7 } })}
          />
        </FieldRow>
      )}

      <SectionLabel>閉じるボタン</SectionLabel>
      <FieldRow label="表示">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={cb.enabled} onChange={(e) => updateCB({ enabled: e.target.checked })} />
          有効
        </label>
      </FieldRow>
      {cb.enabled && (
        <>
          <FieldRow label="位置">
            <SmallSelect value={cb.position} onChange={(v) => updateCB({ position: v as typeof cb.position })}>
              <option value="top-right">右上</option>
              <option value="top-left">左上</option>
            </SmallSelect>
          </FieldRow>
          <FieldRow label="サイズ">
            <SmallInput type="number" value={cb.size} onChange={(v) => updateCB({ size: parseInt(v) || 24 })} />
          </FieldRow>
          <FieldRow label="色">
            <ColorInput value={cb.color} onChange={(v) => updateCB({ color: v })} />
          </FieldRow>
        </>
      )}

      <SectionLabel>オーバーレイ</SectionLabel>
      <FieldRow label="表示">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={ov.enabled} onChange={(e) => updateOV({ enabled: e.target.checked })} />
          有効
        </label>
      </FieldRow>
      {ov.enabled && (
        <>
          <FieldRow label="色">
            <SmallInput value={ov.color} onChange={(v) => updateOV({ color: v })} />
          </FieldRow>
          <FieldRow label="クリックで閉じる">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={ov.closeOnClick} onChange={(e) => updateOV({ closeOnClick: e.target.checked })} />
              有効
            </label>
          </FieldRow>
        </>
      )}

      <SectionLabel>アニメーション</SectionLabel>
      <FieldRow label="入場">
        <SmallSelect value={anim.entrance} onChange={(v) => updateAN({ entrance: v as typeof anim.entrance })}>
          <option value="none">なし</option>
          <option value="fade-in">フェードイン</option>
          <option value="slide-up">スライドアップ</option>
          <option value="slide-down">スライドダウン</option>
          <option value="slide-left">スライド左</option>
          <option value="slide-right">スライド右</option>
          <option value="zoom-in">ズームイン</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="退場">
        <SmallSelect value={anim.exit} onChange={(v) => updateAN({ exit: v as typeof anim.exit })}>
          <option value="none">なし</option>
          <option value="fade-out">フェードアウト</option>
          <option value="slide-up">スライドアップ</option>
          <option value="slide-down">スライドダウン</option>
          <option value="zoom-out">ズームアウト</option>
        </SmallSelect>
      </FieldRow>
      <FieldRow label="時間 (ms)">
        <SmallInput type="number" value={anim.duration} onChange={(v) => updateAN({ duration: parseInt(v) || 300 })} />
      </FieldRow>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'PLAY_ANIMATION', phase: 'entrance' })}
          disabled={anim.entrance === 'none' || state.animationPreview !== 'idle'}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Play className="w-3 h-3" />
          入場プレビュー
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: 'PLAY_ANIMATION', phase: 'exit' })}
          disabled={anim.exit === 'none' || state.animationPreview !== 'idle'}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Play className="w-3 h-3" />
          退場プレビュー
        </button>
      </div>
    </div>
  );
}

// ---- Main Panel ----
export default function PropertyPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('container');

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 shrink-0">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-2 text-xs font-medium text-center transition-colors border-b-2 -mb-px ${
              activeTab === key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'container' && <ContainerTab />}
        {activeTab === 'element' && <ElementTab />}
        {activeTab === 'display' && <DisplayTab />}
      </div>
    </div>
  );
}
