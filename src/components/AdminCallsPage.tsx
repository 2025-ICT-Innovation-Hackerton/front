import { Package, MapPin, Clock, User, AlertCircle, CheckCircle2, Truck, MessageSquare } from 'lucide-react';
import { useState } from 'react';

type CallStatus = 'waiting' | 'dispatching' | 'picked_up' | 'delivering' | 'completed' | 'issue';

interface Call {
  id: number;
  userId: string;
  userName: string;
  userPhone: string;
  startLocation: string;
  startAddress: string;
  endLocation: string;
  endAddress: string;
  requestTime: string;
  itemCount: number;
  itemType: string;
  memo?: string;
  status: CallStatus;
  driverName?: string;
  estimatedPrice: number;
  distance: string;
}

interface AdminCallsPageProps {
  onCallClick: (call: Call) => void;
}

export function AdminCallsPage({ onCallClick }: AdminCallsPageProps) {
  const [filterStatus, setFilterStatus] = useState<CallStatus | 'all'>('all');

  // Mock 데이터
  const [calls] = useState<Call[]>([
    {
      id: 1,
      userId: 'user001',
      userName: '김민수',
      userPhone: '010-1234-5678',
      startLocation: 'GS25 강남점',
      startAddress: '서울시 강남구 테헤란로 123',
      endLocation: '서울역',
      endAddress: '서울시 용산구 한강대로 405',
      requestTime: '2분 전',
      itemCount: 2,
      itemType: '캐리어',
      memo: '깨지기 쉬운 물건이 들어있습니다',
      status: 'waiting',
      estimatedPrice: 15000,
      distance: '8.5km'
    },
    {
      id: 2,
      userId: 'user002',
      userName: '이영희',
      userPhone: '010-2345-6789',
      startLocation: '카페 투썸',
      startAddress: '서울시 강남구 역삼동 456',
      endLocation: '강남터미널',
      endAddress: '서울시 서초구 신반포로 194',
      requestTime: '5분 전',
      itemCount: 1,
      itemType: '백팩',
      status: 'dispatching',
      driverName: '박기사',
      estimatedPrice: 8000,
      distance: '3.2km'
    },
    {
      id: 3,
      userId: 'user003',
      userName: '박철수',
      userPhone: '010-3456-7890',
      startLocation: '홍대 게스트하우스',
      startAddress: '서울시 마포구 양화로 160',
      endLocation: '인천공항',
      endAddress: '인천시 중구 공항로 272',
      requestTime: '10분 전',
      itemCount: 3,
      itemType: '캐리어',
      memo: '공항 출발 30분 전까지 도착 필수',
      status: 'picked_up',
      driverName: '김기사',
      estimatedPrice: 35000,
      distance: '52km'
    },
    {
      id: 4,
      userId: 'user004',
      userName: '최지은',
      userPhone: '010-4567-8901',
      startLocation: '편의점 CU',
      startAddress: '서울시 송파구 올림픽로 240',
      endLocation: '코엑스',
      endAddress: '서울시 강남구 영동대로 513',
      requestTime: '15분 전',
      itemCount: 1,
      itemType: '쇼핑백',
      status: 'delivering',
      driverName: '이기사',
      estimatedPrice: 6000,
      distance: '2.8km'
    },
    {
      id: 5,
      userId: 'user005',
      userName: '정대현',
      userPhone: '010-5678-9012',
      startLocation: '명동 호텔',
      startAddress: '서울시 중구 명동길 74',
      endLocation: '강남역',
      endAddress: '서울시 강남구 강남대로 396',
      requestTime: '1시간 전',
      itemCount: 2,
      itemType: '캐리어',
      status: 'completed',
      driverName: '최기사',
      estimatedPrice: 12000,
      distance: '7.1km'
    }
  ]);

  const getStatusInfo = (status: CallStatus) => {
    switch (status) {
      case 'waiting':
        return { text: '대기중', color: 'bg-yellow-100 text-yellow-700', icon: Clock };
      case 'dispatching':
        return { text: '배차중', color: 'bg-blue-100 text-blue-700', icon: Truck };
      case 'picked_up':
        return { text: '픽업완료', color: 'bg-indigo-100 text-indigo-700', icon: Package };
      case 'delivering':
        return { text: '배송중', color: 'bg-purple-100 text-purple-700', icon: Truck };
      case 'completed':
        return { text: '완료', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
      case 'issue':
        return { text: '문제발생', color: 'bg-red-100 text-red-700', icon: AlertCircle };
    }
  };

  const filteredCalls = filterStatus === 'all' 
    ? calls 
    : calls.filter(call => call.status === filterStatus);

  const statusCounts = {
    all: calls.length,
    waiting: calls.filter(c => c.status === 'waiting').length,
    dispatching: calls.filter(c => c.status === 'dispatching').length,
    picked_up: calls.filter(c => c.status === 'picked_up').length,
    delivering: calls.filter(c => c.status === 'delivering').length,
    completed: calls.filter(c => c.status === 'completed').length,
    issue: calls.filter(c => c.status === 'issue').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="p-6 max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">콜 관리 대시보드</h2>
          <p className="text-gray-600">실시간으로 들어오는 짐 이동 요청을 관리합니다</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-sm mb-1">대기중</p>
            <p className="text-3xl">{statusCounts.waiting}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-sm mb-1">진행중</p>
            <p className="text-3xl">{statusCounts.dispatching + statusCounts.picked_up + statusCounts.delivering}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-sm mb-1">완료</p>
            <p className="text-3xl">{statusCounts.completed}</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
            <p className="text-white/80 text-sm mb-1">문제발생</p>
            <p className="text-3xl">{statusCounts.issue}</p>
          </div>
        </div>

        {/* 필터 탭 */}
        <div className="bg-white rounded-2xl p-2 mb-6 shadow-sm overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              전체 ({statusCounts.all})
            </button>
            <button
              onClick={() => setFilterStatus('waiting')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === 'waiting'
                  ? 'bg-yellow-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              대기중 ({statusCounts.waiting})
            </button>
            <button
              onClick={() => setFilterStatus('dispatching')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === 'dispatching'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              배차중 ({statusCounts.dispatching})
            </button>
            <button
              onClick={() => setFilterStatus('picked_up')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === 'picked_up'
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              픽업완료 ({statusCounts.picked_up})
            </button>
            <button
              onClick={() => setFilterStatus('delivering')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === 'delivering'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              배송중 ({statusCounts.delivering})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                filterStatus === 'completed'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              완료 ({statusCounts.completed})
            </button>
          </div>
        </div>

        {/* 콜 리스트 */}
        <div className="space-y-4">
          {filteredCalls.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
              <Package size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">해당 상태의 콜이 없습니다</p>
            </div>
          ) : (
            filteredCalls.map((call) => {
              const statusInfo = getStatusInfo(call.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={call.id}
                  onClick={() => onCallClick(call)}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-[0.98]"
                >
                  {/* 상단: 상태 및 시간 */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 ${statusInfo.color}`}>
                      <StatusIcon size={16} />
                      {statusInfo.text}
                    </span>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock size={16} />
                      <span>{call.requestTime}</span>
                    </div>
                  </div>

                  {/* 위치 정보 */}
                  <div className="space-y-3 mb-4">
                    <div className="flex gap-3">
                      <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                        <MapPin size={18} className="text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">출발지</p>
                        <p className="text-gray-900">{call.startLocation}</p>
                        <p className="text-sm text-gray-500">{call.startAddress}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="bg-green-100 p-2 rounded-lg h-fit">
                        <MapPin size={18} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">도착지</p>
                        <p className="text-gray-900">{call.endLocation}</p>
                        <p className="text-sm text-gray-500">{call.endAddress}</p>
                      </div>
                    </div>
                  </div>

                  {/* 짐 정보 */}
                  <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Package size={18} className="text-gray-600" />
                      <span className="text-gray-700">{call.itemType}</span>
                      <span className="text-gray-500">×{call.itemCount}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="text-gray-700">{call.distance}</div>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <div className="text-purple-600">{call.estimatedPrice.toLocaleString()}원</div>
                  </div>

                  {/* 사용자 정보 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <User size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-gray-900">{call.userName}</p>
                        <p className="text-sm text-gray-500">{call.userPhone}</p>
                      </div>
                    </div>
                    {call.driverName && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg">
                        <Truck size={16} className="text-indigo-600" />
                        <span className="text-sm text-indigo-600">{call.driverName}</span>
                      </div>
                    )}
                  </div>

                  {/* 메모 */}
                  {call.memo && (
                    <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <MessageSquare size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900">{call.memo}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
