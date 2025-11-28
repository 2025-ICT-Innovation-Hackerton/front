import { MapPin, Package, DollarSign, Clock, User, Phone, MessageSquare, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { RoutePreviewMap } from './RoutePreviewMap';

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

interface DriverCallDetailPageProps {
  call: DriverCall;
  onBack: () => void;
  onAccept: (callId: number) => void;
}

export function DriverCallDetailPage({ call, onBack, onAccept }: DriverCallDetailPageProps) {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      onAccept(call.id);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4 max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex-1">
            <h2 className="text-gray-900">콜 상세정보</h2>
          </div>
          {call.urgency === 'high' && (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <Clock size={14} />
              <span>긴급</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        {/* 수익 카드 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 mb-6 shadow-xl text-white">
          <p className="text-white/80 mb-2">예상 수익</p>
          <p className="text-5xl mb-3">{call.estimatedPrice.toLocaleString()}원</p>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{call.distance}</span>
            </div>
            <div className="h-3 w-px bg-white/30"></div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{call.requestTime} 요청</span>
            </div>
          </div>
        </div>

        {/* 도착 시간 알림 */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-5 mb-6 shadow-xl text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Clock size={24} className="fill-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/90 text-sm mb-1">고객 희망 도착시간</p>
              <p className="text-2xl">{call.desiredArrivalTime}</p>
            </div>
          </div>
        </div>

        {/* 지도 영역 (실제 배달 경로 표시) */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <h3 className="text-gray-900 mb-4">배달 경로</h3>
          
          {/* 실제 지도로 경로 표시 */}
          <div className="mb-4">
            <RoutePreviewMap
              startLocation={call.startLocation}
              startAddress={call.startAddress}
              endLocation={call.endLocation}
              endAddress={call.endAddress}
            />
          </div>

          {/* 위치 정보 */}
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                <MapPin size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">출발지</p>
                <p className="text-gray-900">{call.startLocation}</p>
                <p className="text-sm text-gray-500 mt-0.5">{call.startAddress}</p>
              </div>
            </div>

            <div className="border-t border-gray-100"></div>

            <div className="flex gap-3">
              <div className="bg-green-100 p-2 rounded-lg h-fit">
                <MapPin size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">도착지</p>
                <p className="text-gray-900">{call.endLocation}</p>
                <p className="text-sm text-gray-500 mt-0.5">{call.endAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 짐 정보 */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <h3 className="text-gray-900 mb-4">짐 정보</h3>
          
          <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <Package size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900">{call.itemType}</p>
              <p className="text-sm text-gray-500">{call.itemCount}개의 짐</p>
            </div>
          </div>
        </div>

        {/* 고객 메모 */}
        {call.memo && (
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
            <h3 className="text-gray-900 mb-4">고객 메모</h3>
            
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <MessageSquare size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-900">{call.memo}</p>
            </div>
          </div>
        )}

        {/* 고객 정보 */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <h3 className="text-gray-900 mb-4">고객 정보</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <div className="bg-gray-200 p-3 rounded-xl">
                <User size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">고객명</p>
                <p className="text-gray-900">김민수</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
              <div className="bg-gray-200 p-3 rounded-xl">
                <Phone size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">연락처</p>
                <a href="tel:010-1234-5678" className="text-indigo-600 hover:underline">
                  010-1234-5678
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 주의사항 */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
          <p className="text-sm text-blue-900">
            💡 <strong>안내:</strong> 콜을 수락하면 픽업 위치로 이동하여 짐을 픽업한 후 배달을 진행합니다. 
            각 단계에서 사진 촬영이 필요하며, 고객과의 원활한 소통을 위해 연락처를 확인해주세요.
          </p>
        </div>

        {/* 콜 잡기 버튼 */}
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isAccepting ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>수락 중...</span>
            </>
          ) : (
            <>
              <CheckCircle size={24} />
              <span>이 콜 잡기</span>
            </>
          )}
        </button>

        {/* 취소 버튼 */}
        <button
          onClick={onBack}
          className="w-full mt-3 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all"
        >
          다른 콜 보기
        </button>
      </div>
    </div>
  );
}
