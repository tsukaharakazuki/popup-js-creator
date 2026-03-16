import { useState, useEffect } from 'react';
import { X, CloudUpload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { PopupConfig } from '../../types/popup';
import { useGtm } from '../../context/GtmContext';
import { useGtmApi } from '../../hooks/useGtmApi';
import { generatePopupCode } from '../../utils/codeGenerator';
import { wrapCodeForGtm } from '../../utils/gtmCodeWrapper';

interface GtmDeployModalProps {
  config: PopupConfig;
  onClose: () => void;
}

export default function GtmDeployModal({ config, onClose }: GtmDeployModalProps) {
  const { state, dispatch, selectedWorkspacePath } = useGtm();
  const { fetchTags, createTag, updateTag } = useGtmApi();
  const [tagName, setTagName] = useState(`Popup - ${config.name || 'Untitled'}`);
  const [mode, setMode] = useState<'create' | 'update'>('create');
  const [existingTag, setExistingTag] = useState<{ path: string; fingerprint: string } | null>(null);

  // Fetch existing tags to detect duplicates
  useEffect(() => {
    if (selectedWorkspacePath && state.tags.length === 0) {
      fetchTags(selectedWorkspacePath);
    }
  }, [selectedWorkspacePath, state.tags.length, fetchTags]);

  // Check for existing tag with same name
  useEffect(() => {
    const found = state.tags.find((t) => t.name === tagName && t.type === 'html');
    if (found) {
      setExistingTag({ path: found.path, fingerprint: found.fingerprint });
      setMode('update');
    } else {
      setExistingTag(null);
      setMode('create');
    }
  }, [tagName, state.tags]);

  const selectedAccount = state.accounts.find((a) => a.accountId === state.settings.selectedAccountId);
  const selectedContainer = state.containers.find((c) => c.containerId === state.settings.selectedContainerId);
  const selectedWorkspace = state.workspaces.find((w) => w.workspaceId === state.settings.selectedWorkspaceId);

  const handleDeploy = async () => {
    if (!selectedWorkspacePath) return;

    dispatch({ type: 'SET_DEPLOY_STATUS', status: 'deploying' });

    try {
      const code = generatePopupCode(config, true);
      const html = wrapCodeForGtm(code, config.name || 'Popup');

      if (mode === 'update' && existingTag) {
        await updateTag(existingTag.path, tagName, html, existingTag.fingerprint);
      } else {
        await createTag(selectedWorkspacePath, tagName, html);
      }

      dispatch({ type: 'SET_DEPLOY_STATUS', status: 'success' });

      // Refresh tags
      fetchTags(selectedWorkspacePath);
    } catch (e) {
      dispatch({ type: 'SET_DEPLOY_STATUS', status: 'error', error: (e as Error).message });
    }
  };

  const handleClose = () => {
    dispatch({ type: 'SET_DEPLOY_STATUS', status: 'idle' });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <CloudUpload className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-800">GTM にデプロイ</h2>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Target info */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <p className="text-gray-500">
              <span className="font-medium text-gray-700">アカウント:</span> {selectedAccount?.name || '-'}
            </p>
            <p className="text-gray-500">
              <span className="font-medium text-gray-700">コンテナ:</span> {selectedContainer?.name || '-'} ({selectedContainer?.publicId || ''})
            </p>
            <p className="text-gray-500">
              <span className="font-medium text-gray-700">ワークスペース:</span> {selectedWorkspace?.name || '-'}
            </p>
          </div>

          {/* Tag name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タグ名</label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            {existingTag && (
              <p className="text-xs text-amber-600 mt-1">
                同名のタグが既に存在します。デプロイすると上書き更新されます。
              </p>
            )}
          </div>

          {/* Mode indicator */}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              mode === 'update'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {mode === 'update' ? '既存タグ更新' : '新規タグ作成'}
            </span>
            <span className="text-xs text-gray-400">Custom HTML タグ</span>
          </div>

          {/* Deploy status */}
          {state.deployStatus === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">デプロイが完了しました。GTM管理画面で確認してください。</span>
            </div>
          )}
          {state.deployStatus === 'error' && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span className="text-sm text-red-700">{state.deployError || 'デプロイに失敗しました。'}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            閉じる
          </button>
          <button
            onClick={handleDeploy}
            disabled={!tagName.trim() || state.deployStatus === 'deploying' || state.deployStatus === 'success'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.deployStatus === 'deploying' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CloudUpload className="w-4 h-4" />
            )}
            {state.deployStatus === 'deploying' ? 'デプロイ中...' : 'デプロイ'}
          </button>
        </div>
      </div>
    </div>
  );
}
