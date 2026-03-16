import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, LogOut, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import AccountSelector from './AccountSelector';

export default function GtmSettingsPage() {
  const navigate = useNavigate();
  const { state, dispatch, isConfigured } = useGtm();
  const { requestAuth, disconnect, isGisLoaded } = useGoogleAuth();
  const [clientIdInput, setClientIdInput] = useState(state.settings.clientId);

  const handleSaveClientId = () => {
    dispatch({ type: 'SET_CLIENT_ID', clientId: clientIdInput.trim() });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">GTM 設定</h1>
      </div>

      {/* Error display */}
      {state.error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-700">{state.error}</p>
            <button
              onClick={() => dispatch({ type: 'SET_ERROR', error: null })}
              className="text-xs text-red-500 underline mt-1"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* Status badge */}
      {isConfigured && (
        <div className="mb-6 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">GTM接続済み</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Section 1: Client ID */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">GCP OAuth Client ID</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Google Cloud Console で作成した OAuth 2.0 クライアントID（Webアプリケーション用）を入力してください。
            Tag Manager API v2 を有効化し、承認済みJavaScriptオリジンに現在のURLを追加する必要があります。
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
              placeholder="xxxx.apps.googleusercontent.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={handleSaveClientId}
              disabled={clientIdInput.trim() === state.settings.clientId}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存
            </button>
          </div>
        </section>

        {/* Section 2: Auth */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <LogIn className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-800">Google 認証</h2>
          </div>

          {!state.isAuthenticated ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Googleアカウントで認証して、GTMのアカウント・コンテナにアクセスします。
              </p>
              <button
                onClick={requestAuth}
                disabled={!state.settings.clientId || state.isAuthLoading || !isGisLoaded}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.isAuthLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                Googleアカウントで認証
              </button>
              {!isGisLoaded && (
                <p className="text-xs text-amber-600 mt-2">
                  Google Identity Services を読み込み中...ページをリロードしてみてください。
                </p>
              )}
            </div>
          ) : (
            <div>
              {state.userInfo && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  {state.userInfo.picture && (
                    <img
                      src={state.userInfo.picture}
                      alt=""
                      className="w-10 h-10 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">{state.userInfo.name}</p>
                    <p className="text-xs text-gray-500">{state.userInfo.email}</p>
                  </div>
                </div>
              )}
              <button
                onClick={disconnect}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                切断
              </button>
            </div>
          )}
        </section>

        {/* Section 3: Account/Container/Workspace */}
        {state.isAuthenticated && (
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">GTM コンテナ選択</h2>
            <p className="text-sm text-gray-500 mb-4">
              ポップアップをデプロイするGTMのアカウント、コンテナ、ワークスペースを選択してください。
            </p>
            <AccountSelector />
          </section>
        )}

        {/* Help section */}
        <section className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">セットアップ手順</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>
              <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Google Cloud Console
              </a>
              {' '}でプロジェクトを作成
            </li>
            <li>「APIとサービス」→「ライブラリ」で <strong>Tag Manager API</strong> を有効化</li>
            <li>「APIとサービス」→「認証情報」→ OAuth 2.0 クライアントID を作成（Webアプリケーション）</li>
            <li>「承認済みのJavaScriptオリジン」に <code className="bg-gray-200 px-1 rounded">{window.location.origin}</code> を追加</li>
            <li>クライアントIDをコピーして上記に貼り付け</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
