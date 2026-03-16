import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, Zap } from 'lucide-react';
import { EditorProvider, useEditor } from '../../context/EditorContext';
import { usePopupProjects } from '../../hooks/usePopupProjects';
import { createDefaultPopupConfig } from '../../data/defaults';
import { generatePopupCode } from '../../utils/codeGenerator';
import Toolbar from '../editor/Toolbar';
import TreePanel from '../editor/TreePanel';
import Canvas from '../editor/Canvas';
import PropertyPanel from '../editor/PropertyPanel';
import type { PopupConfig } from '../../types/popup';

function EditorInner() {
  const { state, dispatch } = useEditor();
  const { saveProject } = usePopupProjects();
  const navigate = useNavigate();
  const [nameEditing, setNameEditing] = useState(false);
  const [nameValue, setNameValue] = useState(state.popup.name);

  useEffect(() => {
    setNameValue(state.popup.name);
  }, [state.popup.name]);

  const handleSave = useCallback(() => {
    saveProject(state.popup);
  }, [state.popup, saveProject]);

  const handleExport = useCallback(() => {
    const code = generatePopupCode(state.popup, false);
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `popup-${state.popup.name}.js`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state.popup]);

  const handleNameSubmit = () => {
    setNameEditing(false);
    if (nameValue.trim() && nameValue !== state.popup.name) {
      dispatch({ type: 'SET_POPUP', popup: { ...state.popup, name: nameValue.trim() } });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 h-12 bg-white border-b border-gray-200 shrink-0">
        <button
          onClick={() => { handleSave(); navigate('/'); }}
          className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
          title="ホームに戻る"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Zap className="w-5 h-5 text-blue-600" />

        {/* Editable name */}
        {nameEditing ? (
          <input
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => { if (e.key === 'Enter') handleNameSubmit(); }}
            className="text-sm font-medium text-gray-900 border border-blue-300 rounded px-2 py-0.5 outline-none focus:ring-2 focus:ring-blue-200"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setNameEditing(true)}
            className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors truncate max-w-xs"
            title="クリックして名前を編集"
          >
            {state.popup.name}
          </button>
        )}

        <div className="flex-1" />

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Save className="w-4 h-4" />
          保存
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          エクスポート
        </button>
      </div>

      {/* Toolbar */}
      <Toolbar />

      {/* Main panels */}
      <div className="flex flex-1 overflow-hidden">
        <TreePanel />
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  );
}

export default function EditorPage() {
  const { id } = useParams<{ id?: string }>();
  const { getProject } = usePopupProjects();
  const [initialPopup, setInitialPopup] = useState<PopupConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const project = getProject(id);
      if (project) {
        setInitialPopup(project.config);
      } else {
        setInitialPopup(createDefaultPopupConfig());
      }
    } else {
      setInitialPopup(createDefaultPopupConfig());
    }
    setLoading(false);
  }, [id, getProject]);

  if (loading || !initialPopup) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  return (
    <EditorProvider initialPopup={initialPopup}>
      <EditorInner />
    </EditorProvider>
  );
}
