import type { FormElement } from '../../types/popup';

interface FormRendererProps {
  element: FormElement;
}

export default function FormRenderer({ element }: FormRendererProps) {
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    color: '#111827',
    outline: 'none',
  };

  const submitStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '4px',
  };

  return (
    <form style={formStyle} onSubmit={(e) => e.preventDefault()}>
      {element.fields.map((field) => (
        <div key={field.id}>
          <label style={labelStyle}>
            {field.label}
            {field.required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
          </label>
          {field.fieldType === 'select' ? (
            <select style={inputStyle} disabled>
              <option value="">{field.placeholder || '選択してください'}</option>
              {field.options?.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          ) : field.fieldType === 'checkbox' ? (
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
              <input type="checkbox" disabled />
              {field.placeholder || field.label}
            </label>
          ) : (
            <input
              type={field.fieldType}
              placeholder={field.placeholder}
              style={inputStyle}
              disabled
            />
          )}
        </div>
      ))}
      <button type="button" style={submitStyle}>
        {element.submitLabel}
      </button>
    </form>
  );
}
