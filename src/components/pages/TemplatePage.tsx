import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Copy, Edit3 } from 'lucide-react';
import { usePopupProjects } from '../../hooks/usePopupProjects';
import { templates } from '../../data/templates';
import { createDefaultPopupConfig } from '../../data/defaults';
import type { TemplateDefinition } from '../../types/template';

const categoryLabels: Record<string, string> = {
  all: 'すべて',
  promotion: 'プロモーション',
  conversion: 'コンバージョン',
  notification: '通知',
  feedback: 'フィードバック',
};

const categoryColors: Record<string, string> = {
  promotion: 'bg-pink-100 text-pink-700',
  conversion: 'bg-green-100 text-green-700',
  notification: 'bg-blue-100 text-blue-700',
  feedback: 'bg-amber-100 text-amber-700',
};

import { useState } from 'react';

export default function TemplatePage() {
  const navigate = useNavigate();
  const { projects, saveProject, deleteProject } = usePopupProjects();
  const [filter, setFilter] = useState<string>('all');

  const filteredTemplates = filter === 'all'
    ? templates
    : templates.filter((t) => t.category === filter);

  const handleUseTemplate = (template: TemplateDefinition) => {
    const config = template.create();
    saveProject(config);
    navigate(`/editor/${config.id}`);
  };

  const handleNewBlank = () => {
    const config = createDefaultPopupConfig('新しいポップアップ');
    saveProject(config);
    navigate(`/editor/${config.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">POP UP Javascript Creator</h1>
        <p className="text-gray-600">テンプレートを選択するか、白紙から自由にポップアップを作成</p>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
        {/* Blank Card */}
        <button
          onClick={handleNewBlank}
          className="group border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 transition-all min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-700 group-hover:text-blue-700">白紙から作成</p>
            <p className="text-xs text-gray-400 mt-1">自由にデザイン</p>
          </div>
        </button>

        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center p-4">
              <TemplatePreviewMini template={template} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[template.category]}`}>
                  {categoryLabels[template.category]}
                </span>
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1">{template.nameJa}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{template.descriptionJa}</p>
              <button
                onClick={() => handleUseTemplate(template)}
                className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                このテンプレートを使う
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* My Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">マイプロジェクト</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{project.name}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => navigate(`/editor/${project.id}`)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                      title="編集"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const config = { ...project.config, id: crypto.randomUUID?.() || Math.random().toString(36).slice(2), name: `${project.name} (コピー)` };
                        saveProject(config);
                      }}
                      className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50"
                      title="複製"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                      title="削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  更新: {new Date(project.updatedAt).toLocaleString('ja-JP')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TemplatePreviewMini({ template }: { template: TemplateDefinition }) {
  const iconMap: Record<string, string> = {
    'promo-banner': '🎯',
    'product-carousel': '🛒',
    'large-image-banner': '🖼️',
    'newsletter-signup': '📧',
    'announcement-bar': '📢',
    'coupon-discount': '🎟️',
    'cookie-consent': '🍪',
    'survey-nps': '📊',
    'exit-intent-offer': '🚪',
    'slide-in-widget': '💬',
  };
  return (
    <div className="text-4xl">{iconMap[template.id] || '📦'}</div>
  );
}
