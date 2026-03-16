import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Download, Check, ArrowLeft, Eye, Code, BookOpen } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { usePopupProjects } from '../../hooks/usePopupProjects';
import { generatePopupCode } from '../../utils/codeGenerator';

export default function CodeExportPage() {
  const navigate = useNavigate();
  const { projects } = usePopupProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [minified, setMinified] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'guide' | 'preview'>('code');

  const project = projects.find((p) => p.id === selectedProjectId);
  const code = useMemo(
    () => (project ? generatePopupCode(project.config, minified) : '// プロジェクトを選択してください'),
    [project, minified],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `popup-${project?.config.name || 'popup'}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">コード出力</h1>
      </div>

      {/* Project Selector */}
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm text-gray-600 shrink-0">プロジェクト:</label>
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
        >
          {projects.length === 0 && <option value="">プロジェクトなし</option>}
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { key: 'code', label: 'JavaScript', icon: Code },
          { key: 'guide', label: 'インストール手順', icon: BookOpen },
          { key: 'preview', label: 'プレビュー', icon: Eye },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'code' && (
        <div>
          {/* Controls */}
          <div className="flex items-center gap-3 mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={minified}
                onChange={(e) => setMinified(e.target.checked)}
                className="rounded border-gray-300"
              />
              圧縮 (minify)
            </label>
            <div className="flex-1" />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'コピーしました' : 'コピー'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              ダウンロード
            </button>
          </div>

          {/* Code Block */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Highlight theme={themes.nightOwl} code={code} language="javascript">
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                  className={`${className} p-4 overflow-x-auto text-sm`}
                  style={{ ...style, margin: 0, maxHeight: '70vh' }}
                >
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      <span className="inline-block w-10 text-right mr-4 text-gray-500 select-none text-xs">
                        {i + 1}
                      </span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {code.length.toLocaleString()} 文字 / 約 {(code.length / 1024).toFixed(1)} KB
          </p>
        </div>
      )}

      {activeTab === 'guide' && (
        <div className="prose prose-sm max-w-none">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. 直接埋め込み</h3>
              <p className="text-gray-600 mb-3">HTMLの <code>&lt;/body&gt;</code> タグの直前に以下を追加:</p>
              <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono">
                {`<script>\n${code.slice(0, 100)}...\n</script>`}
              </div>
              <p className="text-gray-500 text-xs mt-2">または外部ファイルとして:</p>
              <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono">
                {`<script src="popup.js"></script>`}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Google Tag Manager (GTM)</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>GTMの管理画面でタグを新規作成</li>
                <li>タグタイプ「カスタムHTML」を選択</li>
                <li>以下のコードを貼り付け:
                  <div className="bg-gray-900 rounded-lg p-4 text-sm text-gray-100 font-mono mt-2">
                    {`<script>\n// Generated by POP UP JS Creator\n${code.slice(0, 80)}...\n</script>`}
                  </div>
                </li>
                <li>トリガーを「All Pages」に設定</li>
                <li>保存して公開</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. WordPress</h3>
              <p className="text-gray-600">
                テーマのfooter.phpまたはプラグイン「Insert Headers and Footers」を使用して、
                <code>&lt;/body&gt;</code> 直前にスクリプトを追加してください。
              </p>
            </section>
          </div>
        </div>
      )}

      {activeTab === 'preview' && project && (
        <div className="bg-gray-100 rounded-xl border border-gray-200 p-4 min-h-[400px] relative">
          <p className="text-center text-gray-500 text-sm mb-4">
            ポップアップのプレビュー（実際の表示に近い形で確認）
          </p>
          <div className="relative bg-white rounded-lg min-h-[360px] flex items-center justify-center">
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;font-family:sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f9fafb;}</style></head><body><script>${code.replace(/<\/script>/g, '<\\/script>')}</script></body></html>`}
              className="w-full h-[500px] border-0 rounded-lg"
              sandbox="allow-scripts"
              title="Popup Preview"
            />
          </div>
        </div>
      )}
    </div>
  );
}
