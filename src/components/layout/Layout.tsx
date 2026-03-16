import { Outlet, Link, useLocation } from 'react-router-dom';
import { Zap, Home, Code, Settings } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  if (isEditor) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors">
              <Zap className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-lg">POP UP JS Creator</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                テンプレート
              </Link>
              <Link
                to="/export"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/export' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4" />
                コード出力
              </Link>
              <Link
                to="/settings"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                GTM設定
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
