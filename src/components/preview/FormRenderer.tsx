import { useState } from 'react';
import type { FormElement } from '../../types/popup';

interface FormRendererProps {
  element: FormElement;
}

export default function FormRenderer({ element }: FormRendererProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateValue = (id: string, val: string) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  const toggleCheck = (id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
    marginBottom: '4px',
    display: 'block',
  };

  const getInputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '8px 12px',
    border: focused ? '2px solid #3b82f6' : '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.2s',
  });

  const submitStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: submitted ? '#22c55e' : '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
    transition: 'background-color 0.2s',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      {element.fields.map((field) => (
        <div key={field.id}>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
          </label>
          {field.fieldType === 'select' ? (
            <select
              style={getInputStyle(focusedField === field.id)}
              value={values[field.id] || ''}
              onChange={(e) => updateValue(field.id, e.target.value)}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => setFocusedField(null)}
            >
              <option value="">{field.placeholder || '選択してください'}</option>
              {field.options?.filter(Boolean).map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.fieldType === 'checkbox' ? (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={checks[field.id] || false}
                onChange={() => toggleCheck(field.id)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              {field.placeholder || field.label}
            </label>
          ) : (
            <input
              type={field.fieldType}
              placeholder={field.placeholder}
              value={values[field.id] || ''}
              onChange={(e) => updateValue(field.id, e.target.value)}
              onFocus={() => setFocusedField(field.id)}
              onBlur={() => setFocusedField(null)}
              style={getInputStyle(focusedField === field.id)}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        style={submitStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? '送信しました ✓' : element.submitLabel}
      </button>
    </form>
  );
}
