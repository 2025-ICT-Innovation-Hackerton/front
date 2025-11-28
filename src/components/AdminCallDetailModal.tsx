import { X, MapPin, Package, User, Phone, Clock, DollarSign, MessageSquare, Truck } from 'lucide-react';

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

interface AdminCallDetailModalProps {
  call: Call;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminCallDetailModal({ call, isOpen, onClose }: AdminCallDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
          
          body {
            font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}</style>

        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <h2 className="text-gray-900">콜 상세정보 #{call.id}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {/* 지도 영역 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 relative" style={{ height: '250px' }}>
            <svg viewBox="0 0 600 250" className="w-full h-full">
              {/* 배경 도로망 */}
              <g opacity="0.2">
                <line x1="0" y1="100" x2="600" y2="100" stroke="#94a3b8" strokeWidth="2" />
                <line x1="0" y1="180" x2="600" y2="180" stroke="#94a3b8" strokeWidth="2" />
                <line x1="150" y1="0" x2="150" y2="250" stroke="#94a3b8" strokeWidth="2" />
                <line x1="300" y1="0" x2="300" y2="250" stroke="#94a3b8" strokeWidth="2" />
                <line x1="450" y1="0" x2="450" y2="250" stroke="#94a3b8" strokeWidth="2" />
              </g>

              {/* 경로선 */}
              <path
                d="M 100 200 Q 300 100, 500 120"
                fill="none"
                stroke="url(#adminGradient)"
                strokeWidth="4"
                strokeDasharray="10,5"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient id="adminGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* 출발지 마커 */}
              <g transform="translate(100, 200)">
                <circle r="20" fill="#4f46e5" opacity="0.2">
                  <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="12" fill="#4f46e5" stroke="white" strokeWidth="3" />
                <text y="35" textAnchor="middle" className="text-xs" fill="#1e293b" fontWeight="600">
                  출발지
                </text>
              </g>

              {/* 도착지 마커 */}
              <g transform="translate(500, 120)">
                <circle r="20" fill="#059669" opacity="0.2">
                  <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="12" fill="#059669" stroke="white" strokeWidth="3" />
                <text y="35" textAnchor="middle" className="text-xs" fill="#1e293b" fontWeight="600">
                  도착지
                </text>
              </g>
            </svg>

            {/* 거리 표시 */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md">
              <p className="text-sm text-gray-600">{call.distance}</p>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 mb-6">
            <h3 className="text-gray-900 mb-4">위치 정보</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-indigo-100 p-3 rounded-xl h-fit">
                  <MapPin size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">출발지</p>
                  <p className="text-gray-900">{call.startLocation}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{call.startAddress}</p>
                </div>
              </div>

              <div className="border-t border-gray-100"></div>

              <div className="flex gap-3">
                <div className="bg-green-100 p-3 rounded-xl h-fit">
                  <MapPin size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">도착지</p>
                  <p className="text-gray-900">{call.endLocation}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{call.endAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 짐 & 요금 정보 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Package size={20} className="text-indigo-600" />
                <p className="text-sm text-gray-600">짐 정보</p>
              </div>
              <p className="text-gray-900 text-lg">{call.itemType}</p>
              <p className="text-gray-600">{call.itemCount}개</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={20} className="text-purple-600" />
                <p className="text-sm text-gray-600">예상 요금</p>
              </div>
              <p className="text-purple-600 text-2xl">{call.estimatedPrice.toLocaleString()}원</p>
            </div>
          </div>

          {/* 사용자 정보 */}
          <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 mb-6">
            <h3 className="text-gray-900 mb-4">사용자 정보</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <User size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">고객명</p>
                  <p className="text-gray-900">{call.userName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Phone size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">연락처</p>
                  <a href={`tel:${call.userPhone}`} className="text-indigo-600 hover:underline">
                    {call.userPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-xl">
                  <Clock size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">요청 시간</p>
                  <p className="text-gray-900">{call.requestTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 기사 정보 */}
          {call.driverName && (
            <div className="bg-white border-2 border-indigo-100 rounded-3xl p-6 mb-6">
              <h3 className="text-gray-900 mb-4">배정된 기사</h3>
              
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl">
                <div className="bg-indigo-600 p-3 rounded-xl">
                  <Truck size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{call.driverName}</p>
                  <p className="text-sm text-gray-600">배달 기사</p>
                </div>
              </div>
            </div>
          )}

          {/* 고객 메모 */}
          {call.memo && (
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 mb-6">
              <h3 className="text-gray-900 mb-4">고객 메모</h3>
              
              <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl">
                <MessageSquare size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-900">{call.memo}</p>
              </div>
            </div>
          )}

          {/* 상태 변경 버튼들 (관리자용) */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all">
              기사 배정
            </button>
            <button className="py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 active:scale-[0.98] transition-all">
              콜 취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
