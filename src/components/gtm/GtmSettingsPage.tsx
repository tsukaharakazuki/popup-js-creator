import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, LogOut, Key, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useGtm } from '../../context/GtmContext';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import AccountSelector from './AccountSelector';

export default function GtmSettingsPage() {
  const navigate = useNavigate();
  const { state, dispatch, isConfigured } = useGtm();
  const { requestAuth, disconnect, isGisLoaded } = useGoogleAuth();
  const [clientIdInput, setClientIdInput] = useState(state.settings.clientId);
  const [guideOpen, setGuideOpen] = useState(false);

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
          <p className="text-sm text-gray-500 mb-2">
            Google Cloud Console で作成した OAuth 2.0 クライアントID（Webアプリケーション用）を入力してください。
          </p>
          <button
            onClick={() => setGuideOpen(!guideOpen)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mb-4 font-medium"
          >
            {guideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            クライアントIDの取得手順を見る
          </button>

          {guideOpen && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg space-y-5 text-sm text-gray-700">
              {/* Step 1 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full shrink-0">1</span>
                  Google Cloud プロジェクトを作成（または選択）
                </h3>
                <ol className="list-none space-y-1.5 ml-8">
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">1.</span>
                    <span>
                      <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center gap-0.5">
                        Google Cloud Console <ExternalLink className="w-3 h-3" />
                      </a>
                      {' '}を開きます
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">2.</span>
                    <span>画面上部のプロジェクト名（例：「My First Project」）をクリック → ダイアログが開きます</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">3.</span>
                    <span>右上の <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">新しいプロジェクト</kbd> をクリック</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">4.</span>
                    <span>プロジェクト名を入力（例：「Popup Creator」）→ <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">作成</kbd> をクリック</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">5.</span>
                    <span>作成後、上部のプロジェクトセレクタで今作ったプロジェクトが選択されていることを確認</span>
                  </li>
                </ol>
                <p className="ml-8 mt-1.5 text-xs text-gray-500">※ 既存のプロジェクトを使う場合は、プロジェクトセレクタから選択するだけでOKです</p>
              </div>

              {/* Step 2 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full shrink-0">2</span>
                  Tag Manager API を有効化
                </h3>
                <ol className="list-none space-y-1.5 ml-8">
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">1.</span>
                    <span>左上のハンバーガーメニュー <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">☰</kbd> → <strong>「APIとサービス」</strong> → <strong>「ライブラリ」</strong> をクリック</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">2.</span>
                    <span>検索バーに <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Tag Manager</kbd> と入力して検索</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">3.</span>
                    <span>検索結果から <strong>「Tag Manager API」</strong> をクリック</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">4.</span>
                    <span>API詳細ページで青い <kbd className="px-1.5 py-0.5 bg-blue-600 text-white border-0 rounded text-xs font-mono">有効にする</kbd> ボタンをクリック</span>
                  </li>
                </ol>
                <p className="ml-8 mt-1.5 text-xs text-gray-500">※ 既に「APIが有効です」と表示されていればスキップしてOKです</p>
              </div>

              {/* Step 3 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full shrink-0">3</span>
                  OAuth 同意画面を設定
                </h3>
                <ol className="list-none space-y-1.5 ml-8">
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">1.</span>
                    <span>左メニュー <strong>「APIとサービス」</strong> → <strong>「OAuth 同意画面」</strong> をクリック</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">2.</span>
                    <span>User Type で <strong>「外部」</strong> を選択 → <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">作成</kbd></span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">3.</span>
                    <span>アプリ情報を入力：</span>
                  </li>
                  <li className="ml-6">
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                      <li><strong>アプリ名</strong>：任意（例：「Popup Creator」）</li>
                      <li><strong>ユーザーサポートメール</strong>：自分のメールアドレスを選択</li>
                      <li><strong>デベロッパーの連絡先</strong>：同じメールアドレスを入力</li>
                    </ul>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">4.</span>
                    <span>他は空欄のままで <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">保存して次へ</kbd> を繰り返し、最後まで進みます</span>
                  </li>
                </ol>
                <div className="ml-8 mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                  ⚠ 「外部」を選ぶと「テスト」ステータスになります。自分のGoogleアカウントでは問題なく使えますが、他の人が使う場合は「テストユーザー」にメールアドレスの追加が必要です。
                </div>
              </div>

              {/* Step 4 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full shrink-0">4</span>
                  OAuth クライアントIDを作成
                </h3>
                <ol className="list-none space-y-1.5 ml-8">
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">1.</span>
                    <span>左メニュー <strong>「APIとサービス」</strong> → <strong>「認証情報」</strong> をクリック</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">2.</span>
                    <span>上部の <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">＋ 認証情報を作成</kbd> → <strong>「OAuth クライアント ID」</strong> を選択</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">3.</span>
                    <span>アプリケーションの種類で <strong>「ウェブ アプリケーション」</strong> を選択</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">4.</span>
                    <span>名前を入力（例：「Popup Creator Web」）</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">5.</span>
                    <span><strong>「承認済みの JavaScript オリジン」</strong> セクションで <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">＋ URIを追加</kbd> をクリック</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">6.</span>
                    <span>以下のURLを入力します：</span>
                  </li>
                  <li className="ml-6">
                    <code className="block px-3 py-2 bg-gray-800 text-green-400 rounded text-xs font-mono select-all">{window.location.origin}</code>
                    <p className="text-xs text-gray-500 mt-1">※ ローカル開発の場合は <code className="bg-gray-200 px-1 rounded">http://localhost:5173</code> も追加してください</p>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">7.</span>
                    <span><kbd className="px-1.5 py-0.5 bg-blue-600 text-white border-0 rounded text-xs font-mono">作成</kbd> ボタンをクリック</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-gray-400 shrink-0">8.</span>
                    <span>ダイアログに表示される <strong>「クライアント ID」</strong>（<code className="bg-gray-200 px-1 rounded text-xs">xxxx.apps.googleusercontent.com</code> 形式）をコピー</span>
                  </li>
                </ol>
              </div>

              {/* Step 5 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full shrink-0">5</span>
                  このページに貼り付けて保存
                </h3>
                <p className="ml-8">コピーしたクライアントIDを下の入力欄に貼り付けて <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">保存</kbd> をクリックすれば完了です。</p>
              </div>
            </div>
          )}
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

      </div>
    </div>
  );
}
