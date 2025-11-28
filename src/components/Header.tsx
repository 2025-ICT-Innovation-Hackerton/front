import { Settings, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onLogin: () => void;
  onSettings: () => void;
}

export function Header({ isAuthenticated, onLogout, onLogin, onSettings }: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* 로고 */}
        <h1 className="text-gray-900">짐프리</h1>

        {/* 메뉴 버튼 */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <Settings size={24} className="text-gray-700" />
          </button>

          {/* 드롭다운 메뉴 */}
          {showMenu && (
            <>
              {/* 배경 오버레이 */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              ></div>

              {/* 메뉴 */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onSettings();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-gray-700"
                >
                  <Settings size={18} />
                  <span>환경설정</span>
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-red-600"
                  >
                    <LogOut size={18} />
                    <span>로그아웃</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onLogin();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-indigo-600"
                  >
                    <LogIn size={18} />
                    <span>로그인</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
