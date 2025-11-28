import { Package, MapPin, Clock, User as UserIcon, Settings, LogOut, Calendar, TrendingUp, ClipboardList, UserCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

type CallType = 'storage' | 'pre-delivery' | 'post-delivery';
type Page = 'partner-calls' | 'partner-history' | 'partner-profile';

interface PartnerCall {
  id: number;
  type: CallType;
  customerName: string;
  customerPhone: string;
  itemType: string;
  itemCount: number;
  startTime: string;
  endTime: string;
  address: string;
  memo?: string;
  requestTime: string;
  estimatedPrice: number;
}

interface PartnerCallsPageProps {
  onCallClick: (call: PartnerCall) => void;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  currentTab: string;
  calls?: PartnerCall[];
}

export function PartnerCallsPage({ onCallClick, onLogout, onNavigate, currentTab, calls = [] }: PartnerCallsPageProps) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const { sendMessage, isConnected } = useWebSocketContext();

  // 실시간 콜 데이터 (웹소켓으로 받아올 데이터)
  const [availableCalls, setAvailableCalls] = useState<PartnerCall[]>([]);

  // props로 받은 calls를 availableCalls에 동기화
  useEffect(() => {
    console.log('📋 가맹점 페이지: calls 업데이트됨, 개수:', calls.length);
    setAvailableCalls(calls);
  }, [calls]);

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

  // 웹소켓 연결 상태 확인
  useEffect(() => {
    console.log('가맹점 페이지 - 웹소켓 연결 상태:', isConnected ? '✅ 연결됨' : '❌ 연결 안 됨');
    console.log('가맹점 페이지 - 현재 콜 개수:', availableCalls.length);
  }, [isConnected, availableCalls]);

  const totalEarnings = availableCalls.reduce((sum, call) => sum + call.estimatedPrice, 0);

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
            <h2 className="text-gray-900 mb-2">보관 요청</h2>
            <p className="text-gray-600">새로운 보관 요청을 확인하세요</p>
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

        {/* 수익 요약 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 mb-6 shadow-xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-white/80" />
            <span className="text-white/80">이용 가능한 총 수익</span>
          </div>
          <p className="text-4xl mb-1">{totalEarnings.toLocaleString()}원</p>
          <p className="text-white/80 text-sm">{availableCalls.length}건의 보관 요청</p>
        </div>

        {/* 콜 리스트 */}
        <div className="space-y-4">
          {availableCalls.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">현재 보관 요청이 없습니다</p>
              <p className="text-gray-400 text-sm mt-2">새로운 요청이 들어오면 알림을 보내드릴게요</p>
            </div>
          ) : (
            availableCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => onCallClick(call)}
                className="bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.98]"
              >
                {/* 콜 타입 및 시간 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm border-2 ${getCallTypeColor(call.type)}`}>
                      {getCallTypeLabel(call.type)}
                    </span>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock size={16} />
                      <span>{call.requestTime}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                    <span className="text-lg">{call.estimatedPrice.toLocaleString()}원</span>
                  </div>
                </div>

                {/* 고객 정보 */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 mb-3 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <UserIcon size={20} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{call.customerName}</p>
                      <p className="text-sm text-gray-500">{call.customerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* 시간 정보 */}
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-4 mb-3 border border-blue-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Calendar size={16} />
                        <span className="text-xs">보관 시작</span>
                      </div>
                      <p className="text-sm text-gray-900">{call.startTime}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-purple-600 mb-1">
                        <Calendar size={16} />
                        <span className="text-xs">보관 종료</span>
                      </div>
                      <p className="text-sm text-gray-900">{call.endTime}</p>
                    </div>
                  </div>
                </div>

                {/* 위치 정보 */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl mb-3">
                  <MapPin size={20} className="text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-0.5">보관 위치</p>
                    <p className="text-gray-900">{call.address}</p>
                  </div>
                </div>

                {/* 짐 정보 */}
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl mb-3">
                  <div className="bg-indigo-600 p-2 rounded-lg">
                    <Package size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{call.itemType}</p>
                    <p className="text-sm text-gray-500">{call.itemCount}개</p>
                  </div>
                </div>

                {/* 메모 */}
                {call.memo && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl mb-3">
                    <p className="text-xs text-amber-600 mb-1">고객 메모</p>
                    <p className="text-sm text-amber-900">{call.memo}</p>
                  </div>
                )}

                {/* 수락 버튼 */}
                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
                  <span>요청 상세보기</span>
                </button>
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
