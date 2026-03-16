import { useCallback, useRef, useEffect } from 'react';
import { useGtm } from '../context/GtmContext';
import type { GtmTokenInfo } from '../types/gtm';

const GTM_SCOPES = 'https://www.googleapis.com/auth/tagmanager.edit.containers https://www.googleapis.com/auth/tagmanager.readonly';

export function useGoogleAuth() {
  const { state, dispatch } = useGtm();
  const tokenClientRef = useRef<google.accounts.oauth2.TokenClient | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGisLoaded = () => typeof google !== 'undefined' && google.accounts?.oauth2;

  const initClient = useCallback(() => {
    if (!isGisLoaded() || !state.settings.clientId) return null;

    const client = google.accounts.oauth2.initTokenClient({
      client_id: state.settings.clientId,
      scope: GTM_SCOPES,
      callback: (response) => {
        if (response.error) {
          dispatch({ type: 'SET_AUTH_LOADING', loading: false });
          dispatch({ type: 'SET_ERROR', error: response.error_description || response.error });
          return;
        }

        const token: GtmTokenInfo = {
          access_token: response.access_token,
          expires_in: response.expires_in,
          token_type: response.token_type,
          scope: response.scope,
          expires_at: Date.now() + response.expires_in * 1000,
        };
        dispatch({ type: 'SET_TOKEN', token });

        // Fetch user info
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token.access_token}` },
        })
          .then((r) => r.json())
          .then((info) => {
            dispatch({
              type: 'SET_USER_INFO',
              userInfo: { email: info.email, name: info.name, picture: info.picture },
            });
          })
          .catch(() => { /* ignore */ });
      },
      error_callback: (err) => {
        dispatch({ type: 'SET_AUTH_LOADING', loading: false });
        dispatch({ type: 'SET_ERROR', error: err.message });
      },
    });

    tokenClientRef.current = client;
    return client;
  }, [state.settings.clientId, dispatch]);

  const requestAuth = useCallback(() => {
    if (!state.settings.clientId) {
      dispatch({ type: 'SET_ERROR', error: 'Client IDが設定されていません' });
      return;
    }
    dispatch({ type: 'SET_AUTH_LOADING', loading: true });

    const client = tokenClientRef.current || initClient();
    if (!client) {
      dispatch({ type: 'SET_AUTH_LOADING', loading: false });
      dispatch({ type: 'SET_ERROR', error: 'Google Identity Services がまだ読み込まれていません。ページをリロードしてください。' });
      return;
    }

    client.requestAccessToken({ prompt: 'consent' });
  }, [state.settings.clientId, dispatch, initClient]);

  const disconnect = useCallback(() => {
    if (state.token?.access_token && isGisLoaded()) {
      google.accounts.oauth2.revoke(state.token.access_token, () => { /* done */ });
    }
    dispatch({ type: 'CLEAR_AUTH' });
  }, [state.token, dispatch]);

  // Token refresh timer
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!state.token) return;

    const timeUntilExpiry = state.token.expires_at - Date.now() - 60000;
    if (timeUntilExpiry <= 0) {
      dispatch({ type: 'CLEAR_AUTH' });
      return;
    }

    timerRef.current = setTimeout(() => {
      const client = tokenClientRef.current || initClient();
      if (client) {
        client.requestAccessToken({ prompt: '' });
      } else {
        dispatch({ type: 'CLEAR_AUTH' });
      }
    }, timeUntilExpiry);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state.token, dispatch, initClient]);

  // Re-fetch user info on restore from sessionStorage
  useEffect(() => {
    if (state.isAuthenticated && state.token && !state.userInfo) {
      fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${state.token.access_token}` },
      })
        .then((r) => r.json())
        .then((info) => {
          if (info.email) {
            dispatch({
              type: 'SET_USER_INFO',
              userInfo: { email: info.email, name: info.name, picture: info.picture },
            });
          }
        })
        .catch(() => { /* token may be expired */ });
    }
  }, [state.isAuthenticated, state.token, state.userInfo, dispatch]);

  return { requestAuth, disconnect, isGisLoaded: isGisLoaded() };
}
