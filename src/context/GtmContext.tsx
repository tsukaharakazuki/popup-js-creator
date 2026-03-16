import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { GtmState, GtmAction, GtmSettings } from '../types/gtm';

const SETTINGS_KEY = 'gtm-settings';
const TOKEN_KEY = 'gtm-token';

function loadSettings(): GtmSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { clientId: '', selectedAccountId: null, selectedContainerId: null, selectedWorkspaceId: null };
}

function loadToken() {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);
    if (raw) {
      const token = JSON.parse(raw);
      if (token.expires_at > Date.now()) return token;
      sessionStorage.removeItem(TOKEN_KEY);
    }
  } catch { /* ignore */ }
  return null;
}

const savedSettings = loadSettings();
const savedToken = loadToken();

const initialState: GtmState = {
  isAuthenticated: !!savedToken,
  token: savedToken,
  userInfo: null,
  isAuthLoading: false,
  settings: savedSettings,
  accounts: [],
  containers: [],
  workspaces: [],
  tags: [],
  isLoadingAccounts: false,
  isLoadingContainers: false,
  isLoadingWorkspaces: false,
  isLoadingTags: false,
  deployStatus: 'idle',
  deployError: null,
  error: null,
};

function gtmReducer(state: GtmState, action: GtmAction): GtmState {
  switch (action.type) {
    case 'SET_AUTH_LOADING':
      return { ...state, isAuthLoading: action.loading };

    case 'SET_TOKEN':
      return { ...state, isAuthenticated: true, token: action.token, isAuthLoading: false, error: null };

    case 'SET_USER_INFO':
      return { ...state, userInfo: action.userInfo };

    case 'CLEAR_AUTH':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        userInfo: null,
        accounts: [],
        containers: [],
        workspaces: [],
        tags: [],
        error: null,
      };

    case 'SET_CLIENT_ID':
      return { ...state, settings: { ...state.settings, clientId: action.clientId } };

    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.accounts, isLoadingAccounts: false };

    case 'SET_CONTAINERS':
      return { ...state, containers: action.containers, isLoadingContainers: false };

    case 'SET_WORKSPACES':
      return { ...state, workspaces: action.workspaces, isLoadingWorkspaces: false };

    case 'SET_TAGS':
      return { ...state, tags: action.tags, isLoadingTags: false };

    case 'SELECT_ACCOUNT':
      return {
        ...state,
        settings: { ...state.settings, selectedAccountId: action.accountId, selectedContainerId: null, selectedWorkspaceId: null },
        containers: [],
        workspaces: [],
        tags: [],
      };

    case 'SELECT_CONTAINER':
      return {
        ...state,
        settings: { ...state.settings, selectedContainerId: action.containerId, selectedWorkspaceId: null },
        workspaces: [],
        tags: [],
      };

    case 'SELECT_WORKSPACE':
      return {
        ...state,
        settings: { ...state.settings, selectedWorkspaceId: action.workspaceId },
        tags: [],
      };

    case 'SET_LOADING': {
      const key = `isLoading${action.key.charAt(0).toUpperCase() + action.key.slice(1)}` as keyof GtmState;
      return { ...state, [key]: action.loading };
    }

    case 'SET_DEPLOY_STATUS':
      return { ...state, deployStatus: action.status, deployError: action.error || null };

    case 'SET_ERROR':
      return { ...state, error: action.error };

    default:
      return state;
  }
}

interface GtmContextValue {
  state: GtmState;
  dispatch: React.Dispatch<GtmAction>;
  isConfigured: boolean;
  selectedWorkspacePath: string | null;
}

const GtmContext = createContext<GtmContextValue | null>(null);

export function GtmProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gtmReducer, initialState);

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    } catch { /* ignore */ }
  }, [state.settings]);

  // Persist token to sessionStorage
  useEffect(() => {
    try {
      if (state.token) {
        sessionStorage.setItem(TOKEN_KEY, JSON.stringify(state.token));
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
      }
    } catch { /* ignore */ }
  }, [state.token]);

  const { selectedAccountId, selectedContainerId, selectedWorkspaceId } = state.settings;
  const isConfigured = state.isAuthenticated && !!selectedAccountId && !!selectedContainerId && !!selectedWorkspaceId;

  const selectedWorkspacePath = selectedAccountId && selectedContainerId && selectedWorkspaceId
    ? `accounts/${selectedAccountId}/containers/${selectedContainerId}/workspaces/${selectedWorkspaceId}`
    : null;

  return (
    <GtmContext.Provider value={{ state, dispatch, isConfigured, selectedWorkspacePath }}>
      {children}
    </GtmContext.Provider>
  );
}

export function useGtm() {
  const ctx = useContext(GtmContext);
  if (!ctx) throw new Error('useGtm must be used within GtmProvider');
  return ctx;
}
