import { Package, Truck } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { StorageMapPage } from './components/StorageMapPage';
import { DeliveryMapPage } from './components/DeliveryMapPage';
import { LoadingPage } from './components/LoadingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { TrackingPage } from './components/TrackingPage';
import { HistoryPage } from './components/HistoryPage';
import { HistoryDetailPage } from './components/HistoryDetailPage';
import { SettingsPage } from './components/SettingsPage';
import { PaymentMethodPage } from './components/PaymentMethodPage';
import { AddCardPage } from './components/AddCardPage';
import { PaymentPage } from './components/PaymentPage';
import { PartnerCallsPage } from './components/PartnerCallsPage';
import { PartnerCallDetailModal } from './components/PartnerCallDetailModal';
import { PartnerHistoryPage } from './components/PartnerHistoryPage';
import { PartnerProfilePage } from './components/PartnerProfilePage';
import { DriverCallsPage } from './components/DriverCallsPage';
import { DriverCallDetailPage } from './components/DriverCallDetailPage';
import { DriverProgressPage } from './components/DriverProgressPage';
import { DriverHistoryPage } from './components/DriverHistoryPage';
import { DriverProfilePage } from './components/DriverProfilePage';
import { StorageWaitingPage } from './components/StorageWaitingPage';
import { DeliveryWaitingPage } from './components/DeliveryWaitingPage';
import { StorageCompleteDetailsPage } from './components/StorageCompleteDetailsPage';
import { useWebSocket } from './hooks/useWebSocket';
import { WebSocketContext, WebSocketMessage } from './contexts/WebSocketContext';

type Page = 'loading' | 'login' | 'signup' | 'home' | 'storage' | 'delivery' | 'tracking' | 'history' | 'history-detail' | 'settings' | 'payment-method' | 'add-card' | 'payment' | 'waiting' | 'delivery-waiting' | 'storage-complete' | 'partner-calls' | 'partner-history' | 'partner-profile' | 'driver-calls' | 'driver-call-detail' | 'driver-progress' | 'driver-history' | 'driver-profile';
type Tab = 'home' | 'tracking' | 'history';
type UserType = 'customer' | 'partner' | 'driver';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [selectedService, setSelectedService] = useState<'storage' | 'delivery' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<UserType>('customer');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedCard, setSelectedCard] = useState<any>({
    cardNumber: '**** **** **** 1234',
    cardName: '신한카드'
  });
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const [selectedPartnerCall, setSelectedPartnerCall] = useState<any>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedDriverCall, setSelectedDriverCall] = useState<any>(null);
  const [acceptedCall, setAcceptedCall] = useState<any>(null);
  const [partnerCalls, setPartnerCalls] = useState<any[]>([]);
  const [driverCalls, setDriverCalls] = useState<any[]>([]);

  // 콜 수락 핸들러 (먼저 정의)
  const handleCallAccepted = useCallback(() => {
    // 짐 보관 콜 수락 후 상세 페이지로
    console.log('✨ handleCallAccepted 실행: storage-complete 페이지로 이동');
    // orderDetails는 유지 (상세 페이지에서 사용)
    setCurrentPage('storage-complete');
  }, []);

  // 웹소켓 메시지 핸들러
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    const timestamp = new Date().toLocaleTimeString('ko-KR');
    console.log(`📨 [${timestamp}] 앱에서 수신한 메시지:`, JSON.stringify(message, null, 2));
    
    // 메시지 타입에 따라 처리
    switch (message.type) {
      case 'NEW_CALL':
        // 새로운 콜이 들어왔을 때
        console.log('🔔 새로운 콜 수신:', message.data);
        
        if (userType === 'partner') {
          // 가맹점용 콜
          setPartnerCalls(prev => [...prev, message.data]);
          console.log('✅ 가맹점 콜 목록 업데이트됨');
        } else if (userType === 'driver') {
          // 배달기사용 콜
          setDriverCalls(prev => [...prev, message.data]);
          console.log('✅ 배달기사 콜 목록 업데이트됨');
        }
        break;
      case 'CALL_ACCEPTED':
        console.log('🎉 콜 수락됨! callId:', message.callId);
        console.log('📍 현재 상태 - userType:', userType, 'currentPage:', currentPage);
        
        // 수락된 콜은 목록에서 제거 (다른 가맹점/배달기사들)
        setPartnerCalls(prev => {
          const filtered = prev.filter(call => call.id !== message.callId);
          console.log('📋 가맹점 콜 목록: CALL_ACCEPTED로 인한 제거 -', prev.length, '→', filtered.length);
          return filtered;
        });
        setDriverCalls(prev => {
          const filtered = prev.filter(call => call.id !== message.callId);
          console.log('📋 배달기사 콜 목록: CALL_ACCEPTED로 인한 제거 -', prev.length, '→', filtered.length);
          return filtered;
        });
        
        // 고객이 대기 화면에 있다면 완료 페이지로 이동
        if (userType === 'customer' && (currentPage === 'waiting' || currentPage === 'delivery-waiting')) {
          console.log('✅ 고객: 콜이 수락되어 (현재 페이지:', currentPage, ')');
          // delivery-waiting은 자체적으로 처리하므로 waiting만 자동 이동
          if (currentPage === 'waiting') {
            setTimeout(() => {
              console.log('🚀 짐 보관 완료 페이지로 이동 실행!');
              handleCallAccepted();
            }, 2000);
          }
        }
        break;
      case 'CALL_CANCELLED':
        console.log('콜 취소됨:', message.callId);
        // 취소된 콜은 목록에서 제거
        setPartnerCalls(prev => prev.filter(call => call.id !== message.callId));
        setDriverCalls(prev => prev.filter(call => call.id !== message.callId));
        break;
    }
  }, [userType, currentPage, handleCallAccepted]);

  // 웹소켓 연결
  const { sendMessage, isConnected, lastMessage, disconnect, reconnect } = useWebSocket({
    url: 'ws://localhost:8080/ws',
    onMessage: handleWebSocketMessage,
    onConnect: () => {
      console.log('웹소켓 연결됨');
    },
    onDisconnect: () => {
      console.log('웹소켓 연결 해제됨');
    },
    onError: (error) => {
      console.error('웹소켓 에러:', error);
    },
    autoReconnect: true,
    reconnectInterval: 3000
  });

  // 앱 시작 시 세션 체크
  useEffect(() => {
    const hasSession = localStorage.getItem('jimgi_session');
    const savedUserType = localStorage.getItem('userType') as UserType;
    
    if (hasSession && savedUserType) {
      // 세션이 있으면 자동 로그인
      setIsAuthenticated(true);
      setUserType(savedUserType);
      
      // 사용자 타입에 따라 적절한 페이지로 이동
      if (savedUserType === 'partner') {
        setCurrentPage('partner-calls');
      } else if (savedUserType === 'driver') {
        setCurrentPage('driver-calls');
      } else {
        setCurrentPage('home');
      }
    } else {
      // 세션이 없으면 로그인 페이지 유지
      setCurrentPage('login');
    }
  }, []);



  const handleLogin = (type: UserType) => {
    localStorage.setItem('jimgi_session', 'true');
    localStorage.setItem('userType', type);
    setIsAuthenticated(true);
    setUserType(type);
    
    // 사용자 타입에 따라 페이지 이동
    if (type === 'partner') {
      setCurrentPage('partner-calls');
    } else if (type === 'driver') {
      setCurrentPage('driver-calls');
    } else {
      // 고객은 선택했던 서비스로 이동
      if (selectedService === 'storage') {
        setCurrentPage('storage');
      } else if (selectedService === 'delivery') {
        setCurrentPage('delivery');
      } else {
        setCurrentPage('home');
      }
    }
  };

  const handleSignupComplete = (type: UserType) => {
    localStorage.setItem('jimgi_session', 'true');
    localStorage.setItem('userType', type);
    setIsAuthenticated(true);
    setUserType(type);
    
    // 사용자 타입에 따라 페이지 이동
    if (type === 'partner') {
      setCurrentPage('partner-calls');
    } else if (type === 'driver') {
      setCurrentPage('driver-calls');
    } else {
      // 고객은 선택했던 서비스로 이동
      if (selectedService === 'storage') {
        setCurrentPage('storage');
      } else if (selectedService === 'delivery') {
        setCurrentPage('delivery');
      } else {
        setCurrentPage('home');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jimgi_session');
    localStorage.removeItem('userType');
    setIsAuthenticated(false);
    setUserType('customer');
    setSelectedService(null);
    setCurrentPage('login');
  };

  const handleServiceSelect = (service: 'storage' | 'delivery') => {
    setSelectedService(service);
  };

  const handleStart = () => {
    // 로그인 확인
    if (!isAuthenticated) {
      // 로그인 안 되어 있으면 로그인 페이지로
      setCurrentPage('login');
      return;
    }
    
    // 로그인 되어 있으면 서비스로 이동
    if (selectedService === 'storage') {
      setCurrentPage('storage');
    } else if (selectedService === 'delivery') {
      setCurrentPage('delivery');
    }
  };

  const handleBack = () => {
    setCurrentPage('home');
    setSelectedService(null);
    setActiveTab('home');
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentPage('home');
    } else if (tab === 'tracking') {
      setCurrentPage('tracking');
    } else if (tab === 'history') {
      setCurrentPage('history');
    }
  };

  const handleSettingsOpen = () => {
    setCurrentPage('settings');
  };

  const handleSettingsBack = () => {
    // 이전 페이지로 돌아가기
    if (activeTab === 'home') {
      setCurrentPage('home');
    } else if (activeTab === 'tracking') {
      setCurrentPage('tracking');
    } else if (activeTab === 'history') {
      setCurrentPage('history');
    }
  };

  const handleManageCards = () => {
    setCurrentPage('payment-method');
  };

  const handleAddCard = () => {
    setCurrentPage('add-card');
  };

  const handleCardAdded = (cardData: any) => {
    // 카드 정보 저장 (실제로는 서버에 저장)
    setSelectedCard({
      cardNumber: cardData.cardNumber,
      cardName: cardData.cardName
    });
    // 결제 수단 페이지로 돌아가기
    setCurrentPage('payment-method');
  };

  const handleSelectCard = (card: any) => {
    setSelectedCard(card);
    // 주문 상세가 있으면 결제 페이지로, 없으면 설정으로
    if (orderDetails) {
      setCurrentPage('payment');
    } else {
      setCurrentPage('settings');
    }
  };

  const handleProceedToPayment = (details: any) => {
    setOrderDetails(details);
    setCurrentPage('payment');
  };

  const handleProceedToDeliveryWaiting = (details: any) => {
    setOrderDetails(details);
    setCurrentPage('delivery-waiting');
  };

  const handlePaymentComplete = () => {
    // 결제 완료 후 대기 페이지로 (가맹점/기사의 수락을 기다림)
    console.log('💳 결제 완료! waiting 페이지로 이동');
    setCurrentPage('waiting');
  };

  // 가맹점 콜 클릭
  const handlePartnerCallClick = (call: any) => {
    setSelectedPartnerCall(call);
    setIsPartnerModalOpen(true);
  };

  // 기사 콜 클릭
  const handleDriverCallClick = (call: any) => {
    setSelectedDriverCall(call);
    setCurrentPage('driver-call-detail');
  };

  // 기사 콜 수락
  const handleDriverCallAccept = (callId: number) => {
    console.log('🚚 배달기사가 콜 수락! callId:', callId);
    
    // 웹소켓으로 수락 메시지 전송
    sendMessage({
      type: 'ACCEPT_CALL',
      callId: callId,
      userId: localStorage.getItem('userId') || 'user_' + Date.now(),
      userType: 'driver'
    });
    
    setAcceptedCall(selectedDriverCall);
    setCurrentPage('driver-progress');
  };

  // 배달 완료
  const handleDeliveryComplete = () => {
    setAcceptedCall(null);
    setSelectedDriverCall(null);
    setCurrentPage('driver-calls');
  };

  // WebSocket Context Provider로 감싸기
  const content = (() => {
    // 로그인 화면
    if (currentPage === 'login') {
      return (
        <LoginPage 
          onLogin={handleLogin} 
          onSignup={() => setCurrentPage('signup')}
        />
      );
    }

    // 회원가입 화면
    if (currentPage === 'signup') {
      return (
        <SignupPage 
          onSignup={handleSignupComplete}
          onBack={() => setCurrentPage('login')}
        />
      );
    }

    // 환경설정 페이지
    if (currentPage === 'settings') {
      return <SettingsPage onBack={handleSettingsBack} onManageCards={handleManageCards} />;
    }

    // 결제 수단 관리 페이지
    if (currentPage === 'payment-method') {
      return (
      <PaymentMethodPage
        onBack={() => setCurrentPage('settings')}
        onSelectCard={handleSelectCard}
        onAddCard={handleAddCard}
      />
    );
    }

    // 카드 등록 페이지
    if (currentPage === 'add-card') {
      return (
      <AddCardPage
        onBack={() => setCurrentPage('payment-method')}
        onComplete={handleCardAdded}
      />
    );
  }

  // 결제 페이지
  if (currentPage === 'payment' && orderDetails) {
    return (
      <PaymentPage
        serviceType={orderDetails.serviceType}
        storeName={orderDetails.storeName}
        storeAddress={orderDetails.storeAddress}
        destination={orderDetails.destination}
        price={orderDetails.price}
        selectedCard={selectedCard}
        onBack={() => setCurrentPage(orderDetails.serviceType === 'storage' ? 'storage' : 'delivery')}
        onChangeCard={() => setCurrentPage('payment-method')}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  // 짐 배달 대기 페이지 (가맹점 수락 -> 배달기사 수락)
  if (currentPage === 'delivery-waiting' && orderDetails) {
    return (
      <DeliveryWaitingPage
        onBack={handleBack}
        onComplete={() => {
          console.log('✅ 배달기사 수락 완료! 추적 페이지로 이동');
          setCurrentPage('tracking');
        }}
        origin={orderDetails.origin}
        originAddress={orderDetails.originAddress}
        destination={orderDetails.destination}
        destinationAddress={orderDetails.destinationAddress}
        estimatedPrice={orderDetails.price}
        pickupTime={orderDetails.pickupTime}
      />
    );
  }

  // 대기 페이지 (가맹점/기사의 콜 수락 대기) - 기존 짐 보관용
  if (currentPage === 'waiting' && orderDetails) {
    if (orderDetails.serviceType === 'storage') {
      return (
        <StorageWaitingPage
          onBack={handleBack}
          storeName={orderDetails.storeName}
          storeAddress={orderDetails.storeAddress}
          dropOffTime={orderDetails.dropOffTime || '14:00'}
          pickUpTime={orderDetails.pickUpTime || '18:00'}
          totalPrice={orderDetails.price}
          onAccepted={handleCallAccepted}
        />
      );
    }
  }

  // 짐 보관 완료 상세 페이지
  if (currentPage === 'storage-complete' && orderDetails) {
    return (
      <StorageCompleteDetailsPage
        onBack={() => {
          setOrderDetails(null);
          setCurrentPage('home');
        }}
        storeName={orderDetails.storeName}
        storeAddress={orderDetails.storeAddress}
        dropOffTime={orderDetails.dropOffTime || '14:00'}
        pickUpTime={orderDetails.pickUpTime || '18:00'}
        totalPrice={orderDetails.price}
      />
    );
  }

  // 짐 보관 지도 페이지
  if (currentPage === 'storage') {
    return <StorageMapPage onBack={handleBack} onProceedToPayment={handleProceedToPayment} />;
  }

  // 짐 배달 지도 페이지
  if (currentPage === 'delivery') {
    return <DeliveryMapPage onBack={handleBack} onProceedToWaiting={handleProceedToDeliveryWaiting} />;
  }

  // 짐 추적 페이지
  if (currentPage === 'tracking') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onLogin={() => setCurrentPage('login')}
          onSettings={handleSettingsOpen}
        />
        <div className="flex-1">
          <TrackingPage />
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    );
  }

  // 사용내역 상세 페이지
  if (currentPage === 'history-detail' && selectedHistoryItem) {
    return (
      <HistoryDetailPage
        item={selectedHistoryItem}
        onBack={() => {
          setCurrentPage('history');
          setSelectedHistoryItem(null);
        }}
      />
    );
  }

  // 사용내역 페이지
  if (currentPage === 'history') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          onLogin={() => setCurrentPage('login')}
          onSettings={handleSettingsOpen}
        />
        <div className="flex-1">
          <HistoryPage 
            onItemClick={(item) => {
              setSelectedHistoryItem(item);
              setCurrentPage('history-detail');
            }}
          />
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    );
  }

  // 가맹점 콜 관리 페이지
  if (currentPage === 'partner-calls') {
    return (
      <>
        <PartnerCallsPage 
          onCallClick={handlePartnerCallClick}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          currentTab="calls"
          calls={partnerCalls}
        />
        <PartnerCallDetailModal
          call={selectedPartnerCall}
          isOpen={isPartnerModalOpen}
          onClose={() => {
            setIsPartnerModalOpen(false);
            setSelectedPartnerCall(null);
          }}
          onAccept={(callId) => {
            // 웹소켓으로 콜 수락 메시지 전송
            console.log('🔔 가맹점: 콜 수락 버튼 클릭! callId:', callId);
            const sent = sendMessage({
              type: 'ACCEPT_CALL',
              callId,
              userType: 'partner'
            });
            console.log('📤 ACCEPT_CALL 메시지 전송:', sent ? '성공' : '실패');
            
            // 콜 목록에서 제거
            setPartnerCalls(prev => {
              const filtered = prev.filter(call => call.id !== callId);
              console.log('📋 가맹점 콜 목록 업데이트:', prev.length, '→', filtered.length);
              return filtered;
            });
          }}
        />
      </>
    );
  }

  // 가맹점 보관 내역 페이지
  if (currentPage === 'partner-history') {
    return (
      <PartnerHistoryPage
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentTab="history"
      />
    );
  }

  // 가맹점 프로필 페이지
  if (currentPage === 'partner-profile') {
    return (
      <PartnerProfilePage
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentTab="profile"
      />
    );
  }

  // 기사 콜 리스트 페이지
  if (currentPage === 'driver-calls') {
    return (
      <DriverCallsPage 
        onCallClick={handleDriverCallClick}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentTab="calls"
        calls={driverCalls}
      />
    );
  }

  // 기사 콜 상세 페이지
  if (currentPage === 'driver-call-detail' && selectedDriverCall) {
    return (
      <DriverCallDetailPage
        call={selectedDriverCall}
        onBack={() => {
          setCurrentPage('driver-calls');
          setSelectedDriverCall(null);
        }}
        onAccept={handleDriverCallAccept}
      />
    );
  }

  // 기사 배달 진행 페이지
  if (currentPage === 'driver-progress' && acceptedCall) {
    return (
      <DriverProgressPage
        callId={acceptedCall.id}
        startLocation={acceptedCall.startLocation}
        startAddress={acceptedCall.startAddress}
        endLocation={acceptedCall.endLocation}
        endAddress={acceptedCall.endAddress}
        onComplete={handleDeliveryComplete}
      />
    );
  }

  // 기사 배달 내역 페이지
  if (currentPage === 'driver-history') {
    return (
      <DriverHistoryPage
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentTab="history"
      />
    );
  }

  // 기사 프로필 페이지
  if (currentPage === 'driver-profile') {
    return (
      <DriverProfilePage
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
        currentTab="profile"
      />
    );
  }

  // 메인 홈 화면
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* 헤더 */}
      <Header 
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onLogin={() => setCurrentPage('login')}
        onSettings={handleSettingsOpen}
      />

      {/* 서브 헤더 */}
      <div className="px-6 pt-6 pb-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-500">안전하고 편리한 짐 관리</p>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 px-6 pb-6">
        <div className="max-w-md mx-auto">
          {/* 서비스 선택 버튼들 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 짐 보관하기 버튼 */}
            <button
              onClick={() => handleServiceSelect('storage')}
              className={`
                relative flex flex-col items-center justify-center
                p-8 rounded-3xl transition-all duration-300 border-2
                ${selectedService === 'storage' 
                  ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-200 scale-[1.02]' 
                  : 'bg-white border-indigo-200 hover:border-indigo-300 active:scale-95 shadow-sm'
                }
              `}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4
                ${selectedService === 'storage' ? 'bg-white/20' : 'bg-indigo-50'}
              `}>
                <Package 
                  className={selectedService === 'storage' ? 'text-white' : 'text-indigo-600'} 
                  size={32} 
                  strokeWidth={2.5}
                />
              </div>
              <span className={`
                ${selectedService === 'storage' ? 'text-white' : 'text-gray-900'}
              `}>
                짐 보관
              </span>
            </button>

            {/* 짐 배달하기 버튼 */}
            <button
              onClick={() => handleServiceSelect('delivery')}
              className={`
                relative flex flex-col items-center justify-center
                p-8 rounded-3xl transition-all duration-300 border-2
                ${selectedService === 'delivery' 
                  ? 'bg-purple-600 border-purple-600 shadow-xl shadow-purple-200 scale-[1.02]' 
                  : 'bg-white border-purple-200 hover:border-purple-300 active:scale-95 shadow-sm'
                }
              `}
            >
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center mb-4
                ${selectedService === 'delivery' ? 'bg-white/20' : 'bg-purple-50'}
              `}>
                <Truck 
                  className={selectedService === 'delivery' ? 'text-white' : 'text-purple-600'} 
                  size={32}
                  strokeWidth={2.5}
                />
              </div>
              <span className={`
                ${selectedService === 'delivery' ? 'text-white' : 'text-gray-900'}
              `}>
                짐 배달
              </span>
            </button>
          </div>

          {/* 선택 확인 버튼 */}
          {selectedService && (
            <div className="mt-6">
              <button
                onClick={handleStart}
                className={`
                  w-full py-4 rounded-2xl text-white transition-all duration-300
                  ${selectedService === 'storage' 
                    ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]' 
                    : 'bg-purple-600 hover:bg-purple-700 active:scale-[0.98]'
                  }
                  shadow-lg
                `}
              >
                {selectedService === 'storage' ? '보관 시작하기' : '배달 시작하기'}
              </button>
            </div>
          )}

          {/* 안내 문구 */}
          <div className="mt-16 space-y-3">
            <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Package className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-0.5">짐 보관</h3>
                  <p className="text-gray-600 text-sm">안전하게 보관해드려요</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                  <Truck className="text-white" size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-0.5">짐 배달</h3>
                  <p className="text-gray-600 text-sm">빠르게 배달해드려요</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* 하단 네비게이션 */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
    );
  })();

  return (
    <WebSocketContext.Provider value={{ sendMessage, isConnected, lastMessage, disconnect, reconnect }}>
      {content}
    </WebSocketContext.Provider>
  );
}
