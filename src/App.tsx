import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TemplatePage from './components/pages/TemplatePage';
import EditorPage from './components/pages/EditorPage';
import CodeExportPage from './components/pages/CodeExportPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TemplatePage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:id" element={<EditorPage />} />
          <Route path="/export" element={<CodeExportPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
