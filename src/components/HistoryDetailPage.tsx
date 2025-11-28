import { ArrowLeft, Package, Truck, Calendar, MapPin, Clock, CheckCircle, XCircle, CreditCard, Camera } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HistoryItem {
  id: number;
  type: 'storage' | 'delivery';
  storeName: string;
  storeAddress: string;
  date: string;
  time: string;
  price: number;
  status: 'completed' | 'cancelled';
  imageUrl: string;
  deliveryPhotoUrl?: string;
  details?: {
    dropOffTime?: string;
    pickUpTime?: string;
    destination?: string;
    pickupScheduledTime?: string;
  };
}

interface HistoryDetailPageProps {
  item: HistoryItem;
  onBack: () => void;
}

export function HistoryDetailPage({ item, onBack }: HistoryDetailPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* 헤더 */}
      <header className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-gray-900 flex-1">이용 상세</h1>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto">
        {/* 상태 배너 */}
        <div className={`rounded-3xl p-6 mb-6 shadow-lg text-white ${
          item.status === 'completed'
            ? 'bg-gradient-to-br from-green-500 to-green-600'
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {item.status === 'completed' ? (
              <CheckCircle size={32} className="text-white" />
            ) : (
              <XCircle size={32} className="text-white" />
            )}
            <div>
              <p className="text-white/90 text-sm">서비스 상태</p>
              <h2 className="text-white">{item.status === 'completed' ? '정상 완료' : '취소됨'}</h2>
            </div>
          </div>
          {item.status === 'cancelled' && (
            <p className="text-white/90 text-sm mt-2">
              취소 완료 • 결제 금액이 환불되었습니다
            </p>
          )}
        </div>

        {/* 서비스 타입 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-xl ${
              item.type === 'storage' ? 'bg-indigo-100' : 'bg-purple-100'
            }`}>
              {item.type === 'storage' ? (
                <Package size={28} className="text-indigo-600" />
              ) : (
                <Truck size={28} className="text-purple-600" />
              )}
            </div>
            <div>
              <p className="text-gray-500 text-sm">서비스</p>
              <p className="text-gray-900">{item.type === 'storage' ? '짐 보관' : '짐 배달'}</p>
            </div>
          </div>
        </div>

        {/* 가맹점 정보 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-md">
          <h3 className="text-gray-900 mb-4">가맹점 정보</h3>
          
          <div className="mb-4">
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.storeName}
              className="w-full h-48 object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-sm mb-1">가맹점명</p>
              <p className="text-gray-900">{item.storeName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm mb-1">주소</p>
              <div className="flex items-start gap-2">
                <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{item.storeAddress}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 이용 정보 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-md">
          <h3 className="text-gray-900 mb-4">이용 정보</h3>
          
          <div className="space-y-4">
            {/* 날짜 및 시간 */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <Calendar size={20} className="text-indigo-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-500 text-sm mb-1">이용 날짜</p>
                <p className="text-gray-900">{item.date} {item.time}</p>
              </div>
            </div>

            {/* 보관 서비스 상세 */}
            {item.type === 'storage' && item.details && (
              <>
                {item.details.dropOffTime && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Clock size={20} className="text-indigo-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-1">보관 시작</p>
                      <p className="text-gray-900">{item.details.dropOffTime}</p>
                    </div>
                  </div>
                )}
                {item.details.pickUpTime && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Clock size={20} className="text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-1">찾아간 시간</p>
                      <p className="text-gray-900">{item.details.pickUpTime}</p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 배달 서비스 상세 */}
            {item.type === 'delivery' && item.details && (
              <>
                <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-100">
                  <MapPin size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm mb-1">출발지 (짐을 맡긴 곳)</p>
                    <p className="text-gray-900">{item.storeAddress}</p>
                  </div>
                </div>
                
                {/* 화살표 */}
                <div className="flex justify-center">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-300 to-purple-300"></div>
                </div>

                {item.details.destination && (
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-100">
                    <MapPin size={20} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-1">도착지 (짐을 받은 곳)</p>
                      <p className="text-gray-900">{item.details.destination}</p>
                    </div>
                  </div>
                )}

                {item.details.pickupScheduledTime && (
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <Clock size={20} className="text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-gray-500 text-sm mb-1">픽업 예정 시간</p>
                      <p className="text-gray-900">{item.details.pickupScheduledTime}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 배달 완료 사진 (배달 서비스만) */}
        {item.type === 'delivery' && item.status === 'completed' && item.deliveryPhotoUrl && (
          <div className="bg-white rounded-3xl p-6 mb-4 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <Camera size={20} className="text-purple-600" />
              <h3 className="text-gray-900">배달 완료 사진</h3>
            </div>
            
            <div className="relative">
              <ImageWithFallback
                src={item.deliveryPhotoUrl}
                alt="배달 완료 사진"
                className="w-full h-64 object-cover rounded-2xl"
              />
              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 shadow-lg">
                <CheckCircle size={14} />
                <span>배달 완료</span>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm mt-3">
              배달원이 짐을 안전하게 전달한 후 촬영한 사진입니다
            </p>
          </div>
        )}

        {/* 결제 정보 */}
        <div className="bg-white rounded-3xl p-6 shadow-md">
          <h3 className="text-gray-900 mb-4">결제 정보</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-gray-400" />
                <span className="text-gray-700">결제 금액</span>
              </div>
              <span className={`${
                item.status === 'completed'
                  ? item.type === 'storage' ? 'text-indigo-600' : 'text-purple-600'
                  : 'text-gray-400'
              }`}>
                {item.price.toLocaleString()}원
              </span>
            </div>

            {item.status === 'cancelled' && (
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <span className="text-red-700">환불 금액</span>
                <span className="text-red-600">{item.price.toLocaleString()}원</span>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white">
              <span className="text-white/90">최종 금액</span>
              <span className="text-white">
                {item.status === 'completed' ? item.price.toLocaleString() : '0'}원
              </span>
            </div>
          </div>

          {item.status === 'cancelled' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
              <p className="text-yellow-800 text-sm">
                ℹ️ 취소된 서비스입니다. 결제 금액은 영업일 기준 3-5일 내에 환불됩니다.
              </p>
            </div>
          )}
        </div>

        {/* 하단 여백 */}
        <div className="h-8"></div>
      </div>
    </div>
  );
}
