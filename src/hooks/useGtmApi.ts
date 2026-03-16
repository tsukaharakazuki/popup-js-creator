import { useCallback } from 'react';
import { useGtm } from '../context/GtmContext';
import type { GtmAccount, GtmContainer, GtmWorkspace, GtmTag } from '../types/gtm';

const BASE = 'https://tagmanager.googleapis.com/tagmanager/v2';

export function useGtmApi() {
  const { state, dispatch } = useGtm();

  const authFetch = useCallback(async (url: string, options?: RequestInit) => {
    if (!state.token) throw new Error('Not authenticated');
    if (state.token.expires_at < Date.now()) {
      dispatch({ type: 'CLEAR_AUTH' });
      throw new Error('Token expired');
    }

    const res = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${state.token.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.status === 401) {
      dispatch({ type: 'CLEAR_AUTH' });
      throw new Error('認証が切れました。再度ログインしてください。');
    }
    if (res.status === 403) {
      throw new Error('権限がありません。GTMの管理者権限を確認してください。');
    }
    if (res.status === 429) {
      throw new Error('APIレート制限に達しました。しばらく待ってから再試行してください。');
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error?.message || `API error: ${res.status}`);
    }

    return res.json();
  }, [state.token, dispatch]);

  const fetchAccounts = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', key: 'accounts', loading: true });
    try {
      const data = await authFetch(`${BASE}/accounts`);
      dispatch({ type: 'SET_ACCOUNTS', accounts: (data.account || []) as GtmAccount[] });
    } catch (e) {
      dispatch({ type: 'SET_LOADING', key: 'accounts', loading: false });
      dispatch({ type: 'SET_ERROR', error: (e as Error).message });
    }
  }, [authFetch, dispatch]);

  const fetchContainers = useCallback(async (accountId: string) => {
    dispatch({ type: 'SET_LOADING', key: 'containers', loading: true });
    try {
      const data = await authFetch(`${BASE}/accounts/${accountId}/containers`);
      dispatch({ type: 'SET_CONTAINERS', containers: (data.container || []) as GtmContainer[] });
    } catch (e) {
      dispatch({ type: 'SET_LOADING', key: 'containers', loading: false });
      dispatch({ type: 'SET_ERROR', error: (e as Error).message });
    }
  }, [authFetch, dispatch]);

  const fetchWorkspaces = useCallback(async (accountId: string, containerId: string) => {
    dispatch({ type: 'SET_LOADING', key: 'workspaces', loading: true });
    try {
      const data = await authFetch(`${BASE}/accounts/${accountId}/containers/${containerId}/workspaces`);
      dispatch({ type: 'SET_WORKSPACES', workspaces: (data.workspace || []) as GtmWorkspace[] });
    } catch (e) {
      dispatch({ type: 'SET_LOADING', key: 'workspaces', loading: false });
      dispatch({ type: 'SET_ERROR', error: (e as Error).message });
    }
  }, [authFetch, dispatch]);

  const fetchTags = useCallback(async (workspacePath: string) => {
    dispatch({ type: 'SET_LOADING', key: 'tags', loading: true });
    try {
      const data = await authFetch(`${BASE}/${workspacePath}/tags`);
      dispatch({ type: 'SET_TAGS', tags: (data.tag || []) as GtmTag[] });
    } catch (e) {
      dispatch({ type: 'SET_LOADING', key: 'tags', loading: false });
      dispatch({ type: 'SET_ERROR', error: (e as Error).message });
    }
  }, [authFetch, dispatch]);

  const createTag = useCallback(async (workspacePath: string, name: string, html: string) => {
    const body = {
      name,
      type: 'html',
      parameter: [
        { type: 'template', key: 'html', value: html },
        { type: 'boolean', key: 'supportDocumentWrite', value: 'false' },
      ],
    };

    return authFetch(`${BASE}/${workspacePath}/tags`, {
      method: 'POST',
      body: JSON.stringify(body),
    }) as Promise<GtmTag>;
  }, [authFetch]);

  const updateTag = useCallback(async (tagPath: string, name: string, html: string, fingerprint: string) => {
    const body = {
      name,
      type: 'html',
      parameter: [
        { type: 'template', key: 'html', value: html },
        { type: 'boolean', key: 'supportDocumentWrite', value: 'false' },
      ],
      fingerprint,
    };

    return authFetch(`${BASE}/${tagPath}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }) as Promise<GtmTag>;
  }, [authFetch]);

  return { fetchAccounts, fetchContainers, fetchWorkspaces, fetchTags, createTag, updateTag };
}
