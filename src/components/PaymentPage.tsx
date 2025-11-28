import { ArrowLeft, CreditCard, MapPin, Package, Truck, Clock } from 'lucide-react';
import { useState } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface PaymentPageProps {
  serviceType: 'storage' | 'delivery';
  storeName: string;
  storeAddress: string;
  destination?: string;
  price: number;
  selectedCard: {
    cardNumber: string;
    cardName: string;
  };
  onBack: () => void;
  onChangeCard: () => void;
  onPaymentComplete: () => void;
}

export function PaymentPage({
  serviceType,
  storeName,
  storeAddress,
  destination,
  price,
  selectedCard,
  onBack,
  onChangeCard,
  onPaymentComplete
}: PaymentPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { sendMessage, isConnected } = useWebSocketContext();

  const handlePayment = () => {
    setIsProcessing(true);

    // 결제 처리 시뮬레이션
    setTimeout(() => {
      setIsProcessing(false);

      // 웹소켓으로 콜 전송
      if (serviceType === 'storage') {
        const callId = Date.now(); // 고유 ID 생성
        sendMessage({
          type: 'CREATE_STORAGE_CALL',
          data: {
            id: callId,
            type: 'storage',
            customerName: '고객',
            customerPhone: '010-0000-0000',
            itemType: '짐',
            itemCount: 1,
            startTime: new Date().toLocaleString('ko-KR'),
            endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toLocaleString('ko-KR'),
            address: storeAddress,
            memo: `${storeName}에서 보관`,
            requestTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            estimatedPrice: price,
            price: price
          }
        });
        console.log('📦 보관 콜 전송 완료, callId:', callId);
      } else if (serviceType === 'delivery') {
        const callId = Date.now(); // 고유 ID 생성
        sendMessage({
          type: 'CREATE_DELIVERY_CALL',
          data: {
            id: callId,
            startLocation: storeName,
            startAddress: storeAddress,
            endLocation: '도착지',
            endAddress: destination || storeAddress,
            distance: '5km',
            price: price,
            estimatedPrice: price,
            itemType: '짐',
            itemCount: 1,
            desiredArrivalTime: new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString('ko-KR'),
            memo: '빠른 배달 부탁드립니다',
            urgency: 'normal',
            requestTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          }
        });
        console.log('🚚 배달 콜 전송 완료, callId:', callId);
      }

      // 바로 대기 화면으로 이동
      onPaymentComplete();
    }, 2000);
  };

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
          <button 
            onClick={onBack} 
            disabled={isProcessing}
            className="p-2 -ml-2 active:scale-95 transition-transform disabled:opacity-50"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-gray-900 flex-1">결제하기</h1>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto pb-32">
        {/* 서비스 정보 */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-2xl ${
              serviceType === 'storage' ? 'bg-indigo-100' : 'bg-purple-100'
            }`}>
              {serviceType === 'storage' ? (
                <Package size={24} className="text-indigo-600" />
              ) : (
                <Truck size={24} className="text-purple-600" />
              )}
            </div>
            <h3 className="text-gray-900">
              {serviceType === 'storage' ? '짐 보관' : '짐 배달'}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-600 text-sm">
                  {serviceType === 'storage' ? '보관 장소' : '픽업 장소'}
                </p>
                <p className="text-gray-900">{storeName}</p>
                <p className="text-gray-500 text-sm">{storeAddress}</p>
              </div>
            </div>

            {destination && (
              <>
                <div className="border-t border-gray-100"></div>
                <div className="flex gap-3">
                  <MapPin size={18} className="text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-gray-600 text-sm">도착지</p>
                    <p className="text-gray-900">{destination}</p>
                  </div>
                </div>
              </>
            )}

            <div className="border-t border-gray-100"></div>
            <div className="flex gap-3">
              <Clock size={18} className="text-gray-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-600 text-sm">예상 시간</p>
                <p className="text-gray-900">약 15분 소요</p>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 수단 */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">결제 수단</h3>
            <button
              onClick={onChangeCard}
              disabled={isProcessing}
              className="text-indigo-600 text-sm hover:underline disabled:opacity-50"
            >
              변경
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl">
              <CreditCard size={24} className="text-white" />
            </div>
            <div>
              <p className="text-gray-900">{selectedCard.cardName}</p>
              <p className="text-gray-600 text-sm">{selectedCard.cardNumber}</p>
            </div>
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="bg-white rounded-3xl p-6 shadow-md mb-6">
          <h3 className="text-gray-900 mb-4">결제 금액</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>서비스 이용료</span>
              <span>{price.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>할인</span>
              <span className="text-red-600">-0원</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-900">총 결제 금액</span>
                <span className="text-indigo-600 text-xl">{price.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 약관 동의 */}
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <p className="text-indigo-900 text-sm mb-2">결제 안내</p>
          <ul className="text-indigo-600 text-xs space-y-1">
            <li>• 결제 후 즉시 서비스가 시작됩니다</li>
            <li>• 취소는 서비스 시작 전까지 가능합니다</li>
            <li>• 결제 내역은 사용내역에서 확인하실 수 있습니다</li>
          </ul>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`w-full max-w-4xl mx-auto py-4 rounded-2xl text-white transition-all shadow-lg ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98]'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>결제 처리중...</span>
            </div>
          ) : (
            `${price.toLocaleString()}원 결제하기`
          )}
        </button>
      </div>
    </div>
  );
}
