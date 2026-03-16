import { useState } from 'react';
import type { NpsElement } from '../../types/popup';

interface NpsRendererProps {
  element: NpsElement;
}

export default function NpsRenderer({ element }: NpsRendererProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const values: number[] = [];
  for (let i = element.min; i <= element.max; i += element.step) {
    values.push(i);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected === null) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  };

  const buttonsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    justifyContent: 'center',
  };

  const getButtonStyle = (val: number): React.CSSProperties => ({
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: selected === val ? element.selectedColor : element.buttonColor,
    color: selected === val ? element.selectedTextColor : element.textColor,
    transition: 'background-color 0.15s, color 0.15s',
  });

  const submitStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: submitted ? '#22c55e' : element.selectedColor,
    color: element.selectedTextColor,
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: selected !== null ? 'pointer' : 'not-allowed',
    opacity: selected !== null ? 1 : 0.5,
    transition: 'background-color 0.2s',
  };

  const labelsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#9ca3af',
  };

  return (
    <form style={wrapperStyle} onSubmit={handleSubmit}>
      <div style={buttonsStyle}>
        {values.map((val) => (
          <button
            key={val}
            type="button"
            style={getButtonStyle(val)}
            onClick={(e) => { e.stopPropagation(); setSelected(val); }}
          >
            {val}
          </button>
        ))}
      </div>
      {values.length > 1 && (
        <div style={labelsStyle}>
          <span>{values[0]}: 非常に不満</span>
          <span>{values[values.length - 1]}: 非常に満足</span>
        </div>
      )}
      <button
        type="submit"
        style={submitStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? element.successMessage || '送信しました ✓' : element.submitLabel}
      </button>
    </form>
  );
}
