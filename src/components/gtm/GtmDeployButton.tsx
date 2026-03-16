import { useState } from 'react';
import { CloudUpload } from 'lucide-react';
import type { PopupConfig } from '../../types/popup';
import { useGtm } from '../../context/GtmContext';
import GtmDeployModal from './GtmDeployModal';

interface GtmDeployButtonProps {
  config: PopupConfig;
}

export default function GtmDeployButton({ config }: GtmDeployButtonProps) {
  const { isConfigured } = useGtm();
  const [modalOpen, setModalOpen] = useState(false);

  if (!isConfigured) return null;

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
        title="GTMにデプロイ"
      >
        <CloudUpload className="w-4 h-4" />
        GTMデプロイ
      </button>

      {modalOpen && (
        <GtmDeployModal config={config} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
