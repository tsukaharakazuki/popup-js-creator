import { HashRouter, Routes, Route } from 'react-router-dom';
import { GtmProvider } from './context/GtmContext';
import Layout from './components/layout/Layout';
import TemplatePage from './components/pages/TemplatePage';
import EditorPage from './components/pages/EditorPage';
import CodeExportPage from './components/pages/CodeExportPage';
import GtmSettingsPage from './components/gtm/GtmSettingsPage';

export default function App() {
  return (
    <GtmProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<TemplatePage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/editor/:id" element={<EditorPage />} />
            <Route path="/export" element={<CodeExportPage />} />
            <Route path="/settings" element={<GtmSettingsPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </GtmProvider>
  );
}
