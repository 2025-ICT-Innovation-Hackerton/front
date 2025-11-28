import { ArrowLeft, Truck, MapPin, Clock, CheckCircle, XCircle, Store } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface DeliveryWaitingPageProps {
  onBack: () => void;
  onComplete: () => void;
  origin: string;
  originAddress: string;
  destination: string;
  destinationAddress: string;
  estimatedPrice: number;
  pickupTime: string;
}

type WaitingStage = 'partner' | 'driver';
type StageStatus = 'checking' | 'success' | 'failed';

export function DeliveryWaitingPage({ 
  onBack, 
  onComplete,
  origin, 
  originAddress,
  destination,
  destinationAddress,
  estimatedPrice,
  pickupTime
}: DeliveryWaitingPageProps) {
  const [dots, setDots] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(5);
  const [stage, setStage] = useState<WaitingStage>('partner');
  const [status, setStatus] = useState<StageStatus>('checking');
  const [partnerCallId, setPartnerCallId] = useState<number | null>(null);
  const [driverCallId, setDriverCallId] = useState<number | null>(null);
  const { sendMessage, isConnected, lastMessage } = useWebSocketContext();

  // 점 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 예상 시간 카운트다운
  useEffect(() => {
    const interval = setInterval(() => {
      setEstimatedTime((prev) => Math.max(1, prev - 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 가맹점에게 보관 콜 전송 (컴포넌트 마운트 시)
  useEffect(() => {
    const callId = Date.now();
    setPartnerCallId(callId);
    
    console.log('🏪 가맹점에게 배달 전 보관 콜 전송, callId:', callId);
    sendMessage({
      type: 'NEW_CALL',
      userType: 'partner',
      call: {
        id: callId,
        type: 'pre-delivery', // 배달 전 보관
        customerName: '고객',
        customerPhone: '010-0000-0000',
        itemType: '짐',
        itemCount: 1,
        startTime: pickupTime, // 픽업 시간을 시작 시간으로
        endTime: '배달 완료까지',
        address: originAddress, // 픽업 위치
        memo: `목적지: ${destination} (${destinationAddress})`,
        requestTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        estimatedPrice: estimatedPrice,
        // 추가 정보 (배달용)
        destination: destination,
        destinationAddress: destinationAddress,
        pickupTime: pickupTime
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 웹소켓 메시지 수신 처리
  useEffect(() => {
    if (!lastMessage) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString('ko-KR');
    console.log(`📨 [${timestamp}] DeliveryWaiting에서 웹소켓 메시지 수신:`, lastMessage);
    console.log(`📍 [${timestamp}] 현재 상태 - stage: ${stage}, status: ${status}, partnerCallId: ${partnerCallId}, driverCallId: ${driverCallId}`);

    // 가맹점이 콜을 수락한 경우
    if (lastMessage.type === 'CALL_ACCEPTED' && 
        lastMessage.userType === 'partner' && 
        lastMessage.callId == partnerCallId && // == 로 변경 (타입 상관없이 비교)
        stage === 'partner' &&
        status === 'checking') {
      const timestamp = new Date().toLocaleTimeString('ko-KR');
      console.log(`✅ [${timestamp}] 가맹점이 콜 수락!`);
      setStatus('success');
      
      // 1.5초 후 배달기사 단계로 전환
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString('ko-KR');
        console.log(`🔄 [${timestamp}] 배달기사 단계로 전환 시작`);
        setStage('driver');
        setStatus('checking');
        setEstimatedTime(5);
        console.log(`🔄 [${timestamp}] stage -> 'driver', status -> 'checking'`);
        
        // 배달기사에게 콜 전송
        const driverCallIdNew = Date.now();
        setDriverCallId(driverCallIdNew);
        
        console.log('🚚 배달기사에게 배달 콜 전송, callId:', driverCallIdNew);
        sendMessage({
          type: 'NEW_CALL',
          userType: 'driver',
          call: {
            id: driverCallIdNew,
            startLocation: origin,
            startAddress: originAddress,
            endLocation: destination,
            endAddress: destinationAddress,
            distance: '5km',
            estimatedPrice: estimatedPrice,
            itemType: '짐',
            itemCount: 1,
            requestTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            desiredArrivalTime: pickupTime,
            memo: '안전한 배달 부탁드립니다',
            urgency: 'normal' as const
          }
        });
      }, 1500);
    }

    // 가맹점이 콜을 거절한 경우
    if (lastMessage.type === 'CALL_REJECTED' && 
        lastMessage.userType === 'partner' && 
        lastMessage.callId == partnerCallId && // == 로 변경
        stage === 'partner' &&
        status === 'checking') {
      console.log('❌ 가맹점이 콜 거절!');
      setStatus('failed');
    }

    // 배달기사가 콜을 수락한 경우
    if (lastMessage.type === 'CALL_ACCEPTED') {
      const timestamp = new Date().toLocaleTimeString('ko-KR');
      console.log(`🔍 [${timestamp}] 배달기사 수락 체크:`, {
        messageType: lastMessage.type,
        messageUserType: lastMessage.userType,
        messageCallId: lastMessage.callId,
        messageCallIdType: typeof lastMessage.callId,
        driverCallId: driverCallId,
        driverCallIdType: typeof driverCallId,
        stage: stage,
        status: status,
        조건1_type: lastMessage.type === 'CALL_ACCEPTED',
        조건2_userType: lastMessage.userType === 'driver',
        조건3_callId_strict: lastMessage.callId === driverCallId,
        조건3_callId_loose: lastMessage.callId == driverCallId,
        조건4_stage: stage === 'driver',
        조건5_status: status === 'checking'
      });
    }
    
    if (lastMessage.type === 'CALL_ACCEPTED' && 
        lastMessage.userType === 'driver' && 
        lastMessage.callId == driverCallId && // == 로 변경 (타입 상관없이 비교)
        stage === 'driver' &&
        status === 'checking') {
      const timestamp = new Date().toLocaleTimeString('ko-KR');
      console.log(`✅ [${timestamp}] 배달기사가 콜 수락!`);
      setStatus('success');
      
      // 2초 후 완료 콜백 호출 (추적 페이지로 이동)
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString('ko-KR');
        console.log(`🚀 [${timestamp}] 배달 추적 페이지로 이동 시작!`);
        onComplete();
      }, 2000);
    }

    // 배달기사가 콜을 거절한 경우
    if (lastMessage.type === 'CALL_REJECTED' && 
        lastMessage.userType === 'driver' && 
        lastMessage.callId == driverCallId && // == 로 변경
        stage === 'driver' &&
        status === 'checking') {
      console.log('❌ 배달기사가 콜 거절!');
      setStatus('failed');
    }
  }, [lastMessage, partnerCallId, driverCallId, stage, status, sendMessage, origin, originAddress, destination, destinationAddress, pickupTime, estimatedPrice, onComplete]);

  const getTitle = () => {
    if (stage === 'partner') {
      if (status === 'checking') return '가맹점 확인 중';
      if (status === 'success') return '가맹점 수락 완료';
      if (status === 'failed') return '가맹점 수락 실패';
    } else {
      if (status === 'checking') return '배달기사 배차 중';
      if (status === 'success') return '배차 완료';
      if (status === 'failed') return '배차 실패';
    }
  };

  const getMainText = () => {
    if (stage === 'partner') {
      if (status === 'checking') return `가맹점에서 확인하고 있어요${dots}`;
      if (status === 'success') return '가맹점에서 요청을 수락했습니다';
      if (status === 'failed') return '가맹점에서 요청을 거절했습니다';
    } else {
      if (status === 'checking') return `배달 기사님을 찾고 있어요${dots}`;
      if (status === 'success') return '배달 기사님이 배정되었습니다';
      if (status === 'failed') return '배달 기사님을 찾지 못했습니다';
    }
  };

  const getSubText = () => {
    if (stage === 'partner') {
      if (status === 'checking') return '잠시만 기다려 주세요';
      if (status === 'success') return '곧 배달 기사님을 배정합니다';
      if (status === 'failed') return '가맹점에서 짐을 보관할 수 없습니다';
    } else {
      if (status === 'checking') return '잠시만 기다려 주세요';
      if (status === 'success') return '배달 정보를 확인해 주세요';
      if (status === 'failed') return '현재 배차 가능한 기사님이 없습니다';
    }
  };

  const getIcon = () => {
    if (status === 'checking') {
      return stage === 'partner' ? (
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-indigo-400 rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-0 bg-indigo-400 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
          <div className="relative bg-indigo-600 p-6 rounded-full shadow-2xl">
            <Store size={48} className="text-white" />
          </div>
        </div>
      ) : (
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-purple-400 rounded-full animate-pulse-ring"></div>
          <div className="absolute inset-0 bg-purple-400 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
          <div className="relative bg-purple-600 p-6 rounded-full shadow-2xl">
            <Truck size={48} className="text-white" />
          </div>
        </div>
      );
    }
    
    if (status === 'success') {
      return (
        <div className="relative mb-5">
          <div className="relative bg-green-600 p-6 rounded-full shadow-2xl">
            <CheckCircle size={48} className="text-white" />
          </div>
        </div>
      );
    }

    return (
      <div className="relative mb-5">
        <div className="relative bg-red-500 p-6 rounded-full shadow-2xl">
          <XCircle size={48} className="text-white" />
        </div>
      </div>
    );
  };

  const bgColor = stage === 'partner' ? 'from-indigo-50' : 'from-purple-50';
  const accentColor = stage === 'partner' ? 'indigo' : 'purple';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgColor} to-white flex flex-col`}>
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
          <h1 className="text-gray-900 flex-1">{getTitle()}</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6">
        {/* 애니메이션 아이콘 */}
        {getIcon()}

        {/* 상태 텍스트 */}
        <h2 className="text-gray-900 mb-1 text-center">
          {getMainText()}
        </h2>
        <p className="text-gray-600 text-center mb-5">
          {getSubText()}
        </p>

        {/* 예상 시간 - 확인 중일 때만 표시 */}
        {status === 'checking' && (
          <div className="bg-white rounded-3xl p-4 shadow-lg w-full max-w-md mb-4">
            <div className="flex items-center gap-3">
              <div className={stage === 'partner' ? 'bg-indigo-100 p-2.5 rounded-full' : 'bg-purple-100 p-2.5 rounded-full'}>
                <Clock size={20} className={stage === 'partner' ? 'text-indigo-600' : 'text-purple-600'} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">
                  {stage === 'partner' ? '예상 응답 시간' : '예상 배차 시간'}
                </p>
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
              {/* 출발지 */}
              <div className="flex gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                  <MapPin size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">출발지</p>
                  <p className="text-gray-900">{origin}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{originAddress}</p>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-100"></div>

              {/* 도착지 */}
              <div className="flex gap-3">
                <div className="bg-purple-100 p-2 rounded-lg h-fit">
                  <MapPin size={18} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm">도착지</p>
                  <p className="text-gray-900">{destination}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{destinationAddress}</p>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-100"></div>

              {/* 픽업 시간 */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">픽업 시간</span>
                <span className="text-gray-900">{pickupTime}</span>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-100"></div>

              {/* 배달 금액 */}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {status === 'success' && stage === 'driver' ? '배달 금액' : '예상 금액'}
                </span>
                <span className={stage === 'partner' ? 'text-indigo-600' : 'text-purple-600'}>
                  {estimatedPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 실패 시 안내 카드 */}
        {status === 'failed' && (
          <div className="bg-white rounded-3xl p-5 shadow-lg w-full max-w-md mb-4">
            <h3 className="text-gray-900 mb-3">
              {stage === 'partner' ? '가맹점 수락 실패' : '배차 실패 사유'}
            </h3>
            <p className="text-gray-600">
              {stage === 'partner' ? (
                <>
                  가맹점에서 현재 짐을 보관할 수 없습니다.<br/>
                  다른 가맹점을 선택하거나 잠시 후 다시 시도해 주세요.
                </>
              ) : (
                <>
                  현재 근처에 배차 가능한 기사님이 없습니다.<br/>
                  잠시 후 다시 시도해 주세요.
                </>
              )}
            </p>
          </div>
        )}

        {/* 안내 메시지 */}
        {status === 'checking' && (
          <div className={stage === 'partner' ? 'bg-indigo-50 rounded-2xl p-3 w-full max-w-md' : 'bg-purple-50 rounded-2xl p-3 w-full max-w-md'}>
            <p className={stage === 'partner' ? 'text-indigo-800 text-sm text-center' : 'text-purple-800 text-sm text-center'}>
              {stage === 'partner' 
                ? '가맹점 응답을 기다리는 중입니다'
                : '배달 기사님이 배정되면 알림으로 안내해드립니다'
              }
            </p>
          </div>
        )}

        {status === 'success' && stage === 'driver' && (
          <div className="bg-green-50 rounded-2xl p-3 w-full max-w-md">
            <p className="text-green-800 text-sm text-center">
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
        {status === 'success' && stage === 'driver' && (
          <button
            onClick={onComplete}
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
