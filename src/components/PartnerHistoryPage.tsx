import { Package, MapPin, Clock, Calendar, Settings, LogOut, ClipboardList, UserCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

type CallType = 'storage' | 'pre-delivery' | 'post-delivery';
type Page = 'partner-calls' | 'partner-history' | 'partner-profile';

interface StorageHistory {
  id: number;
  type: CallType;
  customerName: string;
  itemType: string;
  itemCount: number;
  startTime: string;
  endTime: string;
  address: string;
  price: number;
  status: 'completed' | 'in-progress';
  completedAt?: string;
}

interface PartnerHistoryPageProps {
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  currentTab: string;
}

export function PartnerHistoryPage({ onLogout, onNavigate, currentTab }: PartnerHistoryPageProps) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Mock 데이터
  const [history] = useState<StorageHistory[]>([
    {
      id: 1,
      type: 'storage',
      customerName: '김고객',
      itemType: '캐리어',
      itemCount: 2,
      startTime: '2024-11-27 14:00',
      endTime: '2024-11-27 18:00',
      address: '서울시 강남구 테헤란로 123',
      price: 8000,
      status: 'completed',
      completedAt: '2024-11-27 18:05'
    },
    {
      id: 2,
      type: 'pre-delivery',
      customerName: '이여행',
      itemType: '캐리어',
      itemCount: 3,
      startTime: '2024-11-27 10:00',
      endTime: '2024-11-27 15:00',
      address: '서울시 마포구 양화로 160',
      price: 6000,
      status: 'completed',
      completedAt: '2024-11-27 14:58'
    },
    {
      id: 3,
      type: 'post-delivery',
      customerName: '박수령',
      itemType: '백팩',
      itemCount: 1,
      startTime: '2024-11-26 16:00',
      endTime: '2024-11-26 20:00',
      address: '서울시 강남구 역삼동 456',
      price: 5000,
      status: 'completed',
      completedAt: '2024-11-26 19:45'
    },
    {
      id: 4,
      type: 'storage',
      customerName: '최보관',
      itemType: '쇼핑백',
      itemCount: 2,
      startTime: '2024-11-28 15:00',
      endTime: '2024-11-29 10:00',
      address: '서울시 송파구 올림픽로 240',
      price: 12000,
      status: 'in-progress'
    },
    {
      id: 5,
      type: 'storage',
      customerName: '정짐프리',
      itemType: '캐리어',
      itemCount: 1,
      startTime: '2024-11-25 09:00',
      endTime: '2024-11-25 18:00',
      address: '서울시 서초구 서초대로 320',
      price: 10000,
      status: 'completed',
      completedAt: '2024-11-25 17:50'
    }
  ]);

  const getCallTypeLabel = (type: CallType) => {
    switch (type) {
      case 'storage':
        return '짐 보관';
      case 'pre-delivery':
        return '배달 전 보관';
      case 'post-delivery':
        return '배달 후 보관';
    }
  };

  const getCallTypeColor = (type: CallType) => {
    switch (type) {
      case 'storage':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'pre-delivery':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'post-delivery':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const totalEarnings = history
    .filter(h => h.status === 'completed')
    .reduce((sum, h) => sum + h.price, 0);
  const completedCount = history.filter(h => h.status === 'completed').length;
  const inProgressCount = history.filter(h => h.status === 'in-progress').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="p-6 pb-24 max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">보관 내역</h2>
            <p className="text-gray-600">완료한 보관 서비스를 확인하세요</p>
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

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-5 shadow-xl text-white">
            <p className="text-white/80 mb-1 text-sm">완료된 보관</p>
            <p className="text-3xl mb-1">{completedCount}건</p>
            <p className="text-white/80 text-xs">총 수익: {totalEarnings.toLocaleString()}원</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-5 shadow-xl text-white">
            <p className="text-white/80 mb-1 text-sm">진행 중</p>
            <p className="text-3xl mb-1">{inProgressCount}건</p>
            <p className="text-white/80 text-xs">보관 서비스 제공 중</p>
          </div>
        </div>

        {/* 내역 리스트 */}
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
              <ClipboardList size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">아직 보관 내역이 없습니다</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all"
              >
                {/* 상단: 타입 및 상태 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm border-2 ${getCallTypeColor(item.type)}`}>
                      {getCallTypeLabel(item.type)}
                    </span>
                    {item.status === 'completed' ? (
                      <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                        <CheckCircle size={16} />
                        <span className="text-sm">완료</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                        <Clock size={16} />
                        <span className="text-sm">진행중</span>
                      </div>
                    )}
                  </div>
                  <div className="text-lg text-gray-900">{item.price.toLocaleString()}원</div>
                </div>

                {/* 고객 정보 */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <Package size={20} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{item.customerName}</p>
                      <p className="text-sm text-gray-500">{item.itemType} · {item.itemCount}개</p>
                    </div>
                  </div>
                </div>

                {/* 시간 정보 */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-indigo-600 mb-1">
                      <Calendar size={14} />
                      <span className="text-xs">보관 시작</span>
                    </div>
                    <p className="text-sm text-gray-900">{item.startTime}</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Calendar size={14} />
                      <span className="text-xs">보관 종료</span>
                    </div>
                    <p className="text-sm text-gray-900">{item.endTime}</p>
                  </div>
                </div>

                {/* 위치 */}
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-xl mb-3">
                  <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{item.address}</p>
                </div>

                {/* 완료 시간 */}
                {item.completedAt && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle size={16} />
                    <span>{item.completedAt}에 완료됨</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => onNavigate('partner-calls')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'calls'
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Package size={24} strokeWidth={currentTab === 'calls' ? 2.5 : 2} />
              <span className="text-xs">콜 목록</span>
            </button>

            <button
              onClick={() => onNavigate('partner-history')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'history'
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ClipboardList size={24} strokeWidth={currentTab === 'history' ? 2.5 : 2} />
              <span className="text-xs">보관 내역</span>
            </button>

            <button
              onClick={() => onNavigate('partner-profile')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'profile'
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <UserCircle size={24} strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
              <span className="text-xs">내 정보</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
