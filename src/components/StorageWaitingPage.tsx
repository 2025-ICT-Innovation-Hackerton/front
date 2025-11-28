import { ArrowLeft, Package, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StorageWaitingPageProps {
  onBack: () => void;
  storeName: string;
  storeAddress: string;
  dropOffTime: string;
  pickUpTime: string;
  totalPrice: number;
  onAccepted: () => void;
}

export function StorageWaitingPage({ 
  onBack, 
  storeName, 
  storeAddress, 
  dropOffTime, 
  pickUpTime, 
  totalPrice,
  onAccepted 
}: StorageWaitingPageProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* 헤더 */}
      <header className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-gray-900 flex-1">
            가맹점 응답 대기 중
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        {/* 애니메이션 아이콘 */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-400 rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-0 bg-indigo-400 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
          <div className="relative bg-indigo-600 p-8 rounded-full shadow-2xl">
            <Package size={64} className="text-white" />
          </div>
        </div>

        {/* 상태 텍스트 */}
        <h2 className="text-gray-900 mb-1 text-center">
          가맹점의 응답을 기다리는 중{dots}
        </h2>
        <p className="text-gray-600 text-center mb-5">
          가맹점에서 곧 확인할 예정입니다
        </p>

        {/* 보관 정보 카드 */}
        <div className="bg-white rounded-3xl p-5 shadow-lg w-full max-w-md mb-4">
            <h3 className="text-gray-900 mb-3">보관 정보</h3>
            
            <div className="space-y-3">
              {/* 보관 장소 */}
              <div className="flex gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                  <MapPin size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">보관 장소</p>
                  <p className="text-gray-900">{storeName}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{storeAddress}</p>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-100"></div>

              {/* 맡길 시간 */}
              <div className="flex gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                  <Clock size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">맡길 시간</p>
                  <p className="text-gray-900">{dropOffTime}</p>
                </div>
              </div>

              {/* 찾을 시간 */}
              <div className="flex gap-3">
                <div className="bg-purple-100 p-2 rounded-lg h-fit">
                  <Clock size={18} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">찾을 시간</p>
                  <p className="text-gray-900">{pickUpTime}</p>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-100"></div>

              {/* 결제 금액 */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">결제 금액</span>
                <span className="text-indigo-600">{totalPrice.toLocaleString()}원</span>
              </div>
            </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl text-gray-700 transition-all duration-300 bg-gray-100 hover:bg-gray-200 active:scale-[0.98]"
        >
          취소하기
        </button>
      </div>
    </div>
  );
}
