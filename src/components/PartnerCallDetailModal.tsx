import { X, Package, MapPin, Clock, User as UserIcon, Calendar, Phone, MessageSquare, CheckCircle } from 'lucide-react';

type CallType = 'storage' | 'pre-delivery' | 'post-delivery';

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

interface PartnerCallDetailModalProps {
  call: PartnerCall | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (callId: number) => void;
}

export function PartnerCallDetailModal({ call, isOpen, onClose, onAccept }: PartnerCallDetailModalProps) {
  if (!isOpen || !call) return null;

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

  const getCallTypeDescription = (type: CallType) => {
    switch (type) {
      case 'storage':
        return '고객이 지정한 시간 동안 짐을 보관합니다';
      case 'pre-delivery':
        return '배달 기사가 픽업할 때까지 짐을 임시 보관합니다';
      case 'post-delivery':
        return '배달된 짐을 고객이 찾아갈 때까지 보관합니다';
    }
  };

  const handleAccept = () => {
    console.log('✅ 가맹점 모달: 요청 수락! callId:', call.id);
    // 콜 수락 처리 - 웹소켓으로 메시지 전송
    onAccept(call.id);
    // 모달 닫기
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white">보관 요청 상세</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all active:scale-95"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm border-2 ${getCallTypeColor(call.type)} bg-white`}>
              {getCallTypeLabel(call.type)}
            </span>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock size={16} />
              <span>{call.requestTime}</span>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-4">
          {/* 설명 */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-blue-900 text-sm">{getCallTypeDescription(call.type)}</p>
          </div>

          {/* 고객 정보 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon size={20} />
              고객 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm">이름</span>
                <span className="text-gray-900">{call.customerName}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 text-sm">연락처</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900">{call.customerPhone}</span>
                  <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors">
                    <Phone size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 보관 시간 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              보관 기간
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs text-indigo-600 mb-1">보관 시작</p>
                <p className="text-lg text-indigo-900">{call.startTime}</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-xs text-purple-600 mb-1">보관 종료</p>
                <p className="text-lg text-purple-900">{call.endTime}</p>
              </div>
            </div>
          </div>

          {/* 위치 정보 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              보관 위치
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-900">{call.address}</p>
            </div>
          </div>

          {/* 짐 정보 */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
            <h3 className="text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} />
              짐 정보
            </h3>
            <div className="flex items-center gap-4 bg-indigo-50 rounded-xl p-4">
              <div className="bg-indigo-600 p-3 rounded-xl">
                <Package size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 mb-1">{call.itemType}</p>
                <p className="text-sm text-gray-600">{call.itemCount}개</p>
              </div>
            </div>
          </div>

          {/* 고객 메모 */}
          {call.memo && (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-5">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={20} />
                고객 메모
              </h3>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-900">{call.memo}</p>
              </div>
            </div>
          )}

          {/* 수익 정보 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">예상 수익</span>
              <span className="text-2xl text-green-700">{call.estimatedPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="sticky bottom-0 bg-white p-6 border-t border-gray-200 rounded-b-3xl">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
            >
              취소
            </button>
            <button
              onClick={handleAccept}
              className="py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              <span>요청 수락</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
