import { Home, MapPin, Clock } from 'lucide-react';

type Tab = 'home' | 'tracking' | 'history';

interface BottomNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <nav className="bg-white border-t border-gray-100 px-4 py-2 sticky bottom-0 z-40">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
        {/* 홈 탭 */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 py-2 px-8 rounded-xl transition-all relative ${
            activeTab === 'home'
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="text-xs">홈</span>
          {activeTab === 'home' && (
            <div className="absolute bottom-0 w-12 h-1 bg-indigo-600 rounded-t-full"></div>
          )}
        </button>

        {/* 짐 추적 탭 */}
        <button
          onClick={() => onTabChange('tracking')}
          className={`flex flex-col items-center gap-1 py-2 px-8 rounded-xl transition-all relative ${
            activeTab === 'tracking'
              ? 'text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MapPin size={24} strokeWidth={activeTab === 'tracking' ? 2.5 : 2} />
          <span className="text-xs">짐 추적</span>
          {activeTab === 'tracking' && (
            <div className="absolute bottom-0 w-12 h-1 bg-purple-600 rounded-t-full"></div>
          )}
        </button>

        {/* 사용내역 탭 */}
        <button
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-1 py-2 px-8 rounded-xl transition-all relative ${
            activeTab === 'history'
              ? 'text-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock size={24} strokeWidth={activeTab === 'history' ? 2.5 : 2} />
          <span className="text-xs">사용내역</span>
          {activeTab === 'history' && (
            <div className="absolute bottom-0 w-12 h-1 bg-indigo-600 rounded-t-full"></div>
          )}
        </button>
      </div>
    </nav>
  );
}
