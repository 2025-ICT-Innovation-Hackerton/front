import { ArrowLeft, Truck, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface DispatchWaitingPageProps {
  onBack: () => void;
  storeName: string;
  storeAddress: string;
  estimatedPrice: number;
}

type DispatchStatus = 'checking' | 'success' | 'failed';

export function DispatchWaitingPage({ onBack, storeName, storeAddress, estimatedPrice }: DispatchWaitingPageProps) {
  const [dots, setDots] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [status, setStatus] = useState<DispatchStatus>('checking');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEstimatedTime((prev) => Math.max(1, prev - 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 2-4초 후 랜덤으로 성공/실패 결정 (80% 성공률)
    const delay = 2000 + Math.random() * 2000;
    const timer = setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% 성공률
      setStatus(isSuccess ? 'success' : 'failed');
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col">
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
            {status === 'checking' && '배차 대기'}
            {status === 'success' && '배차 완료'}
            {status === 'failed' && '배차 실패'}
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        {/* 애니메이션 아이콘 */}
        {status === 'checking' && (
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-purple-400 rounded-full animate-pulse-ring"></div>
            <div className="absolute inset-0 bg-purple-400 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
            <div className="relative bg-purple-600 p-6 rounded-full shadow-2xl">
              <Truck size={48} className="text-white" />
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="relative mb-5">
            <div className="relative bg-indigo-600 p-6 rounded-full shadow-2xl">
              <CheckCircle size={48} className="text-white" />
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="relative mb-5">
            <div className="relative bg-red-500 p-6 rounded-full shadow-2xl">
              <XCircle size={48} className="text-white" />
            </div>
          </div>
        )}

        {/* 상태 텍스트 */}
        <h2 className="text-gray-900 mb-1 text-center">
          {status === 'checking' && `배달 기사님을 찾고 있어요${dots}`}
          {status === 'success' && '배달 기사님이 배정되었습니다'}
          {status === 'failed' && '배달 기사님을 찾지 못했습니다'}
        </h2>
        <p className="text-gray-600 text-center mb-5">
          {status === 'checking' && '잠시만 기다려 주세요'}
          {status === 'success' && '배달 정보를 확인해 주세요'}
          {status === 'failed' && '현재 배차 가능한 기사님이 없습니다'}
        </p>

        {/* 예상 시간 - 확인 중일 때만 표시 */}
        {status === 'checking' && (
          <div className="bg-white rounded-3xl p-4 shadow-lg w-full max-w-md mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2.5 rounded-full">
                <Clock size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">예상 배차 시간</p>
                <p className="text-gray-900">약 {estimatedTime}분</p>
              </div>
            </div>
          </div>
        )}

        {/* 배달 정보 카드 - 실패가 아닐 때만 표시 */}
        {status !== 'failed' && (
          <div className="bg-white rounded-3xl p-5 shadow-lg w-full max-w-md mb-4">
            <h3 className="text-gray-900 mb-3">배달 정보</h3>
            
            <div className="space-y-3">
              {/* 픽업 장소 */}
              <div className="flex gap-3">
                <div className="bg-purple-100 p-2 rounded-lg h-fit">
                  <MapPin size={18} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">픽업 장소</p>
                  <p className="text-gray-900">{storeName}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{storeAddress}</p>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-100"></div>

              {/* 배달 금액 */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{status === 'success' ? '배달 금액' : '예상 금액'}</span>
                <span className="text-purple-600">{estimatedPrice.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        )}

        {/* 실패 시 안내 카드 */}
        {status === 'failed' && (
          <div className="bg-white rounded-3xl p-5 shadow-lg w-full max-w-md mb-4">
            <h3 className="text-gray-900 mb-3">배차 실패 사유</h3>
            <p className="text-gray-600">
              현재 근처에 배차 가능한 기사님이 없습니다.<br/>
              잠시 후 다시 시도해 주세요.
            </p>
          </div>
        )}

        {/* 안내 메시지 */}
        {status === 'checking' && (
          <div className="bg-indigo-50 rounded-2xl p-3 w-full max-w-md">
            <p className="text-indigo-800 text-sm text-center">
              배달 기사님이 배정되면 알림으로 안내해드립니다
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-purple-50 rounded-2xl p-3 w-full max-w-md">
            <p className="text-purple-800 text-sm text-center">
              곧 배달 기사님께서 픽업 장소로 출발합니다
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="bg-red-50 rounded-2xl p-3 w-full max-w-md">
            <p className="text-red-800 text-sm text-center">
              다시 시도하려면 뒤로 가기를 눌러주세요
            </p>
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 bg-white border-t border-gray-100">
        {status === 'checking' && (
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl text-gray-700 transition-all duration-300 bg-gray-100 hover:bg-gray-200 active:scale-[0.98]"
          >
            취소하기
          </button>
        )}
        {status === 'success' && (
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl text-white transition-all duration-300 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] shadow-lg"
          >
            확인
          </button>
        )}
        {status === 'failed' && (
          <button
            onClick={onBack}
            className="w-full py-4 rounded-2xl text-white transition-all duration-300 bg-gray-700 hover:bg-gray-800 active:scale-[0.98] shadow-lg"
          >
            뒤로 가기
          </button>
        )}
      </div>
    </div>
  );
}
