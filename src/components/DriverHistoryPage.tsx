import { Package, MapPin, Clock, DollarSign, CheckCircle, Settings, LogOut, List, User } from 'lucide-react';
import { useState } from 'react';

interface DeliveryHistory {
  id: number;
  startLocation: string;
  endLocation: string;
  distance: string;
  earnings: number;
  completedAt: string;
  itemType: string;
  status: 'completed' | 'cancelled';
}

interface DriverHistoryPageProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentTab: 'calls' | 'history' | 'profile';
}

export function DriverHistoryPage({ onLogout, onNavigate, currentTab }: DriverHistoryPageProps) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  const [history] = useState<DeliveryHistory[]>([
    {
      id: 1,
      startLocation: 'GS25 강남점',
      endLocation: '서울역',
      distance: '8.5km',
      earnings: 15000,
      completedAt: '2024-11-28 15:30',
      itemType: '캐리어 2개',
      status: 'completed'
    },
    {
      id: 2,
      startLocation: '카페 투썸',
      endLocation: '강남터미널',
      distance: '3.2km',
      earnings: 8000,
      completedAt: '2024-11-28 12:15',
      itemType: '백팩 1개',
      status: 'completed'
    },
    {
      id: 3,
      startLocation: '편의점 CU',
      endLocation: '코엑스',
      distance: '2.8km',
      earnings: 6000,
      completedAt: '2024-11-27 18:45',
      itemType: '쇼핑백 1개',
      status: 'completed'
    }
  ]);

  const totalEarnings = history
    .filter(h => h.status === 'completed')
    .reduce((sum, h) => sum + h.earnings, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="p-6 max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">배달 내역</h2>
            <p className="text-gray-600">완료한 배달 내역을 확인하세요</p>
          </div>
          
          {/* 설정 및 로그아웃 */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <Settings size={20} className="text-gray-700" />
            </button>
            
            {showSettingsMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSettingsMenu(false)}
                ></div>
                <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[160px]">
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      // 설정 페이지로 이동
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors text-left"
                  >
                    <Settings size={18} />
                    <span>환경설정</span>
                  </button>
                  <div className="h-px bg-gray-200"></div>
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors text-left"
                  >
                    <LogOut size={18} />
                    <span>로그아웃</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 누적 수익 */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 mb-6 shadow-xl text-white">
          <p className="text-white/80 mb-2">이번 달 누적 수익</p>
          <p className="text-4xl mb-1">{totalEarnings.toLocaleString()}원</p>
          <p className="text-white/80 text-sm">{history.filter(h => h.status === 'completed').length}건 완료</p>
        </div>

        {/* 내역 리스트 */}
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">배달 내역이 없습니다</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 shadow-lg"
              >
                {/* 상태 및 수익 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    <span className="text-green-600">완료</span>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <DollarSign size={16} />
                    <span>{item.earnings.toLocaleString()}원</span>
                  </div>
                </div>

                {/* 경로 정보 */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 mb-3 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-600 to-green-600"></div>
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">출발</p>
                        <p className="text-gray-900">{item.startLocation}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">도착</p>
                        <p className="text-gray-900">{item.endLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 짐 정보 및 시간 */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package size={16} />
                    <span>{item.itemType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{item.completedAt}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => onNavigate('driver-calls')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'calls'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={24} />
              <span className="text-xs">콜 목록</span>
            </button>
            
            <button
              onClick={() => onNavigate('driver-history')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'history'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock size={24} />
              <span className="text-xs">배달 내역</span>
            </button>
            
            <button
              onClick={() => onNavigate('driver-profile')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'profile'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User size={24} />
              <span className="text-xs">내 정보</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
