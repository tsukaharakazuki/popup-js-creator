import { useEffect } from 'react';
import { useGtm } from '../../context/GtmContext';
import { useGtmApi } from '../../hooks/useGtmApi';
import { Loader2 } from 'lucide-react';

export default function AccountSelector() {
  const { state, dispatch } = useGtm();
  const { fetchAccounts, fetchContainers, fetchWorkspaces } = useGtmApi();
  const { selectedAccountId, selectedContainerId, selectedWorkspaceId } = state.settings;

  // Fetch accounts on auth
  useEffect(() => {
    if (state.isAuthenticated && state.accounts.length === 0) {
      fetchAccounts();
    }
  }, [state.isAuthenticated, state.accounts.length, fetchAccounts]);

  // Fetch containers when account selected
  useEffect(() => {
    if (selectedAccountId && state.isAuthenticated) {
      fetchContainers(selectedAccountId);
    }
  }, [selectedAccountId, state.isAuthenticated, fetchContainers]);

  // Fetch workspaces when container selected
  useEffect(() => {
    if (selectedAccountId && selectedContainerId && state.isAuthenticated) {
      fetchWorkspaces(selectedAccountId, selectedContainerId);
    }
  }, [selectedAccountId, selectedContainerId, state.isAuthenticated, fetchWorkspaces]);

  if (!state.isAuthenticated) return null;

  return (
    <div className="space-y-4">
      {/* Account */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">アカウント</label>
        <div className="relative">
          <select
            value={selectedAccountId || ''}
            onChange={(e) => dispatch({ type: 'SELECT_ACCOUNT', accountId: e.target.value || null })}
            disabled={state.isLoadingAccounts}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white disabled:opacity-50"
          >
            <option value="">選択してください</option>
            {state.accounts.map((a) => (
              <option key={a.accountId} value={a.accountId}>{a.name}</option>
            ))}
          </select>
          {state.isLoadingAccounts && (
            <Loader2 className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Container */}
      {selectedAccountId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">コンテナ</label>
          <div className="relative">
            <select
              value={selectedContainerId || ''}
              onChange={(e) => dispatch({ type: 'SELECT_CONTAINER', containerId: e.target.value || null })}
              disabled={state.isLoadingContainers}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white disabled:opacity-50"
            >
              <option value="">選択してください</option>
              {state.containers.map((c) => (
                <option key={c.containerId} value={c.containerId}>
                  {c.name} ({c.publicId})
                </option>
              ))}
            </select>
            {state.isLoadingContainers && (
              <Loader2 className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>
        </div>
      )}

      {/* Workspace */}
      {selectedContainerId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ワークスペース</label>
          <div className="relative">
            <select
              value={selectedWorkspaceId || ''}
              onChange={(e) => dispatch({ type: 'SELECT_WORKSPACE', workspaceId: e.target.value || null })}
              disabled={state.isLoadingWorkspaces}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white disabled:opacity-50"
            >
              <option value="">選択してください</option>
              {state.workspaces.map((w) => (
                <option key={w.workspaceId} value={w.workspaceId}>{w.name}</option>
              ))}
            </select>
            {state.isLoadingWorkspaces && (
              <Loader2 className="absolute right-8 top-2.5 w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
