// === GTM API Response Types ===

export interface GtmAccount {
  path: string;
  accountId: string;
  name: string;
  fingerprint: string;
}

export interface GtmContainer {
  path: string;
  accountId: string;
  containerId: string;
  name: string;
  publicId: string;
  fingerprint: string;
}

export interface GtmWorkspace {
  path: string;
  accountId: string;
  containerId: string;
  workspaceId: string;
  name: string;
  description?: string;
  fingerprint: string;
}

export interface GtmTag {
  path: string;
  accountId: string;
  containerId: string;
  workspaceId: string;
  tagId: string;
  name: string;
  type: string;
  parameter?: GtmParameter[];
  fingerprint: string;
}

export interface GtmParameter {
  type: 'template' | 'list' | 'map' | 'boolean';
  key: string;
  value?: string;
  list?: GtmParameter[];
  map?: GtmParameter[];
}

// === Auth Types ===

export interface GtmTokenInfo {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  expires_at: number;
}

// === Context State ===

export interface GtmSettings {
  clientId: string;
  selectedAccountId: string | null;
  selectedContainerId: string | null;
  selectedWorkspaceId: string | null;
}

export interface GtmState {
  isAuthenticated: boolean;
  token: GtmTokenInfo | null;
  userInfo: { email: string; name: string; picture: string } | null;
  isAuthLoading: boolean;

  settings: GtmSettings;

  accounts: GtmAccount[];
  containers: GtmContainer[];
  workspaces: GtmWorkspace[];
  tags: GtmTag[];

  isLoadingAccounts: boolean;
  isLoadingContainers: boolean;
  isLoadingWorkspaces: boolean;
  isLoadingTags: boolean;

  deployStatus: 'idle' | 'deploying' | 'success' | 'error';
  deployError: string | null;
  error: string | null;
}

export type GtmAction =
  | { type: 'SET_AUTH_LOADING'; loading: boolean }
  | { type: 'SET_TOKEN'; token: GtmTokenInfo }
  | { type: 'SET_USER_INFO'; userInfo: GtmState['userInfo'] }
  | { type: 'CLEAR_AUTH' }
  | { type: 'SET_CLIENT_ID'; clientId: string }
  | { type: 'SET_ACCOUNTS'; accounts: GtmAccount[] }
  | { type: 'SET_CONTAINERS'; containers: GtmContainer[] }
  | { type: 'SET_WORKSPACES'; workspaces: GtmWorkspace[] }
  | { type: 'SET_TAGS'; tags: GtmTag[] }
  | { type: 'SELECT_ACCOUNT'; accountId: string | null }
  | { type: 'SELECT_CONTAINER'; containerId: string | null }
  | { type: 'SELECT_WORKSPACE'; workspaceId: string | null }
  | { type: 'SET_LOADING'; key: 'accounts' | 'containers' | 'workspaces' | 'tags'; loading: boolean }
  | { type: 'SET_DEPLOY_STATUS'; status: GtmState['deployStatus']; error?: string }
  | { type: 'SET_ERROR'; error: string | null };
