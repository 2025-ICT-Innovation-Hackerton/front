import { MapPin, Package, DollarSign, Clock, ArrowRight, TrendingUp, Settings, LogOut, Home, List, User } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface DriverCall {
  id: number;
  startLocation: string;
  startAddress: string;
  endLocation: string;
  endAddress: string;
  distance: string;
  estimatedPrice: number;
  itemType: string;
  itemCount: number;
  requestTime: string;
  desiredArrivalTime: string;
  memo?: string;
  urgency: 'normal' | 'high';
}

interface DriverCallsPageProps {
  onCallClick: (call: DriverCall) => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentTab: 'calls' | 'history' | 'profile';
  calls?: DriverCall[];
}

export function DriverCallsPage({ onCallClick, onLogout, onNavigate, currentTab, calls = [] }: DriverCallsPageProps) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const { sendMessage, isConnected } = useWebSocketContext();
  
  // 실시간 콜 데이터 (웹소켓으로 받아올 데이터)
  const [availableCalls, setAvailableCalls] = useState<DriverCall[]>([]);

  // props로 받은 calls를 availableCalls에 동기화
  useEffect(() => {
    if (calls && calls.length > 0) {
      setAvailableCalls(calls);
    }
  }, [calls]);

  const totalEarnings = availableCalls.reduce((sum, call) => sum + call.estimatedPrice, 0);

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
            <h2 className="text-gray-900 mb-2">배달 콜</h2>
            <p className="text-gray-600">원하는 콜을 선택하여 수락하세요</p>
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
          <p className="text-white/80 text-sm">{availableCalls.length}건의 배달 콜</p>
        </div>

        {/* 긴급 콜 알림 */}
        {availableCalls.filter(c => c.urgency === 'high').length > 0 && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 mb-6 text-white shadow-lg animate-pulse">
            <div className="flex items-center gap-2">
              <Clock size={20} />
              <p>🔥 긴급 콜 {availableCalls.filter(c => c.urgency === 'high').length}건 대기 중!</p>
            </div>
          </div>
        )}

        {/* 콜 리스트 */}
        <div className="space-y-4">
          {availableCalls.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">현재 이용 가능한 콜이 없습니다</p>
              <p className="text-gray-400 text-sm mt-2">새로운 콜이 들어오면 알림을 보내드릴게요</p>
            </div>
          ) : (
            availableCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => onCallClick(call)}
                className={`bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.98] relative overflow-hidden ${
                  call.urgency === 'high' ? 'border-2 border-orange-400' : ''
                }`}
              >
                {/* 긴급 배지 */}
                {call.urgency === 'high' && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-bl-2xl text-sm flex items-center gap-1">
                    <Clock size={14} />
                    <span>긴급</span>
                  </div>
                )}

                {/* 수익 및 시간 정보 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock size={16} />
                      <span>{call.requestTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 text-sm">
                      <Clock size={16} className="fill-red-600" />
                      <span className="font-medium">{call.desiredArrivalTime}까지</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                    <DollarSign size={18} />
                    <span className="text-lg">{call.estimatedPrice.toLocaleString()}원</span>
                  </div>
                </div>

                {/* 경로 정보 */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 mb-4 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-600 to-green-600"></div>
                      <div className="w-3 h-3 rounded-full bg-green-600"></div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">출발</p>
                        <p className="text-gray-900">{call.startLocation}</p>
                        <p className="text-sm text-gray-500">{call.startAddress}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-600 px-3 py-1 bg-purple-50 rounded-lg w-fit">
                        <ArrowRight size={14} />
                        <span>{call.distance}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">도착</p>
                        <p className="text-gray-900">{call.endLocation}</p>
                        <p className="text-sm text-gray-500">{call.endAddress}</p>
                      </div>
                    </div>
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
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs text-amber-600 mb-1">고객 메모</p>
                    <p className="text-sm text-amber-900">{call.memo}</p>
                  </div>
                )}

                {/* 콜 잡기 버튼 */}
                <button className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2">
                  <span>콜 상세보기</span>
                  <ArrowRight size={20} />
                </button>
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
