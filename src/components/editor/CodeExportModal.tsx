import { useState, useRef } from 'react';
import { X, Copy, Check, Download, Minimize2, Maximize2 } from 'lucide-react';
import type { PopupConfig } from '../../types/popup';
import { generatePopupCode } from '../../utils/codeGenerator';
import GtmDeployButton from '../gtm/GtmDeployButton';

interface CodeExportModalProps {
  config: PopupConfig;
  onClose: () => void;
}

export default function CodeExportModal({ config, onClose }: CodeExportModalProps) {
  const [minified, setMinified] = useState(false);
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const code = generatePopupCode(config, minified);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name || 'popup'}.js`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-gray-800">JavaScript コード出力</h2>
            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {code.length.toLocaleString()} 文字
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-5 py-2 border-b border-gray-100 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'コピー済み' : 'コピー'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            ダウンロード
          </button>
          <GtmDeployButton config={config} />
          <div className="flex-1" />
          <button
            onClick={() => setMinified(!minified)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              minified
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {minified ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {minified ? '圧縮版' : '整形版'}
          </button>
        </div>

        {/* Code */}
        <div className="flex-1 overflow-auto p-4 bg-gray-900">
          <pre
            ref={codeRef}
            className="text-xs leading-relaxed text-gray-200 font-mono whitespace-pre-wrap break-all"
          >
            {code}
          </pre>
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2 border-t border-gray-200 shrink-0">
          <p className="text-[10px] text-gray-400">
            このコードを &lt;script&gt; タグ内に貼り付けるか、.js ファイルとして読み込んでください。GTMのカスタムHTMLタグにも対応しています。
          </p>
        </div>
      </div>
    </div>
  );
}
