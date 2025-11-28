import { Search, MapPin, X, ArrowLeft, Truck, ChevronRight, Clock } from 'lucide-react';
import { useState } from 'react';
import { DispatchWaitingPage } from './DispatchWaitingPage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { KakaoMap } from './KakaoMap';

interface DeliveryStore {
  id: number;
  name: string;
  address: string;
  description: string;
  imageUrl: string;
  lat: number;
  lng: number;
  estimatedPrice?: number;
}

interface Location {
  id?: number;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

interface DeliveryMapPageProps {
  onBack: () => void;
  onProceedToWaiting: (details: {
    origin: string;
    originAddress: string;
    destination: string;
    destinationAddress: string;
    pickupTime: string;
    price: number;
  }) => void;
}

type MapMode = 'none' | 'selectOrigin' | 'selectDestination';

export function DeliveryMapPage({ onBack, onProceedToWaiting }: DeliveryMapPageProps) {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [pickupTime, setPickupTime] = useState('');
  const [mapMode, setMapMode] = useState<MapMode>('none');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<DeliveryStore | null>(null);
  const [apiStores, setApiStores] = useState<DeliveryStore[]>([]);
  const [apiDestinations, setApiDestinations] = useState<DeliveryStore[]>([]);

  // API에서 받아온 위치를 DeliveryStore 형태로 변환
  const handleOriginLocationsLoaded = (locations: any[]) => {
    console.log('🎯 DeliveryMapPage: 출발지 데이터 받음:', locations.length, '개');
    
    if (locations.length === 0) {
      console.log('⚠️ API 데이터가 없어서 더미 데이터 사용');
      return;
    }
    
    const deliveryStores = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      description: `${Math.round(loc.distance)}m 거리`,
      imageUrl: 'https://images.unsplash.com/photo-1641440616173-7241e6fe6be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZW5pZW5jZSUyMHN0b3JlfGVufDF8fHx8MTc2NDIyMzAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
      lat: loc.lat,
      lng: loc.lng,
      estimatedPrice: 5000
    }));
    console.log('✅ 출발지 가게 설정 완료:', deliveryStores);
    setApiStores(deliveryStores);
  };

  const handleDestinationLocationsLoaded = (locations: any[]) => {
    console.log('🎯 DeliveryMapPage: 도착지 데이터 받음:', locations.length, '개');
    
    if (locations.length === 0) {
      console.log('⚠️ API 데이터가 없어서 더미 데이터 사용');
      return;
    }
    
    const deliveryDestinations = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      description: `${Math.round(loc.distance)}m 거리`,
      imageUrl: 'https://images.unsplash.com/photo-1641440616173-7241e6fe6be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZW5pZW5jZSUyMHN0b3JlfGVufDF8fHx8MTc2NDIyMzAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
      lat: loc.lat,
      lng: loc.lng,
      estimatedPrice: 5000
    }));
    console.log('✅ 도착지 가게 설정 완료:', deliveryDestinations);
    setApiDestinations(deliveryDestinations);
  };

  // API에서 받아온 데이터 사용, 없으면 빈 배열
  const stores: DeliveryStore[] = apiStores.length > 0 ? apiStores : [
    { 
      id: 1, 
      name: '편의점 GS25', 
      address: '서울시 강남구 테헤란로 123',
      description: '24시간 운영, 짐 보관 서비스 제공',
      imageUrl: 'https://images.unsplash.com/photo-1641440616173-7241e6fe6be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZW5pZW5jZSUyMHN0b3JlfGVufDF8fHx8MTc2NDIyMzAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.500095,
      lng: 127.029610,
      estimatedPrice: 5000 
    },
    { 
      id: 2, 
      name: '카페 투썸플레이스', 
      address: '서울시 강남구 역삼동 456',
      description: '편안한 분위기, 짐 맡기기 편리',
      imageUrl: 'https://images.unsplash.com/photo-1604552914267-90a8d81a4254?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZXxlbnwxfHx8fDE3NjQyNDEwODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.495095,
      lng: 127.032610,
      estimatedPrice: 7000 
    },
    { 
      id: 3, 
      name: '게스트하우스 서울', 
      address: '서울시 강남구 선릉로 789',
      description: '친절한 직원, 안전한 보관',
      imageUrl: 'https://images.unsplash.com/photo-1675409145919-277c0fc2aa7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWVzdGhvdXNlJTIwaG90ZWx8ZW58MXx8fHwxNzY0MjUyMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.501095,
      lng: 127.024610,
      estimatedPrice: 8000 
    },
    { 
      id: 4, 
      name: 'CU 편의점', 
      address: '서울시 강남구 강남대로 234',
      description: '역 근처 위치, 접근성 우수',
      imageUrl: 'https://images.unsplash.com/photo-1636668150626-e5ddfcb5c3c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHN0b3JlJTIwc2hvcHxlbnwxfHx8fDE3NjQyNTIwNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.496095,
      lng: 127.026610,
      estimatedPrice: 4500 
    },
    { 
      id: 5, 
      name: '호텔 비즈니스', 
      address: '서울시 강남구 논현동 567',
      description: '고급 서비스, 보안 철저',
      imageUrl: 'https://images.unsplash.com/photo-1608022099316-02dbaebb4d7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhvdGVsfGVufDF8fHx8MTc2NDIwNjg1NXww&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.503095,
      lng: 127.030610,
      estimatedPrice: 6000 
    },
    { 
      id: 6, 
      name: '스타벅스', 
      address: '서울시 강남구 삼성로 890',
      description: '넓은 공간, 짐 보관 가능',
      imageUrl: 'https://images.unsplash.com/photo-1589476993333-f55b84301219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFyYnVja3MlMjBjb2ZmZWV8ZW58MXx8fHwxNzY0MjIwMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.499095,
      lng: 127.035610,
      estimatedPrice: 9000 
    },
  ];

  // API에서 받아온 데이터 사용, 없으면 기본 도착지 목록
  const destinations = apiDestinations.length > 0 ? apiDestinations : [
    { id: 101, name: '강남역 2번 출구', address: '서울시 강남구 강남대로 지하 396', lat: 37.497952, lng: 127.027619, description: '', imageUrl: '', estimatedPrice: 0 },
    { id: 102, name: '코엑스몰', address: '서울시 강남구 영동대로 513', lat: 37.512535, lng: 127.059196, description: '', imageUrl: '', estimatedPrice: 0 },
    { id: 103, name: '삼성역', address: '서울시 강남구 테헤란로 지하 419', lat: 37.508881, lng: 127.063596, description: '', imageUrl: '', estimatedPrice: 0 },
    { id: 104, name: '선릉역', address: '서울시 강남구 테헤란로 지하 607', lat: 37.504741, lng: 127.049080, description: '', imageUrl: '', estimatedPrice: 0 },
  ];

  const handleOriginSelect = (store: DeliveryStore) => {
    setOrigin({
      name: store.name,
      address: store.address
    });
    // estimatedPrice가 없으면 기본값 설정
    const storeWithPrice = {
      ...store,
      estimatedPrice: store.estimatedPrice || 5000
    };
    setSelectedStore(storeWithPrice);
    setMapMode('none');
  };

  const handleDestinationSelect = (dest: Location) => {
    setDestination(dest);
    setMapMode('none');
  };

  const calculatePrice = () => {
    if (!selectedStore) return 0;
    return selectedStore.estimatedPrice || 5000;
  };

  // 지도 선택 모드 - 출발지 선택
  if (mapMode === 'selectOrigin') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
          
          body {
            font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}</style>

        {/* 헤더 */}
        <header className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setMapMode('none')} className="p-2 -ml-2 active:scale-95 transition-transform">
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="text-gray-900 flex-1">짐을 맡길 위치 선택</h1>
          </div>
        </header>

        {/* 검색창 */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="가맹점 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 relative bg-gray-100">
          <KakaoMap
            onLocationSelect={handleOriginSelect}
            selectedLocationId={null}
            mapType="storage"
            onLocationsLoaded={handleOriginLocationsLoaded}
            allowMapClick={true}
            onMapClick={handleOriginSelect}
          />
        </div>
      </div>
    );
  }

  // 지도 선택 모드 - 도착지 선택
  if (mapMode === 'selectDestination') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
          
          body {
            font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}</style>

        {/* 헤더 */}
        <header className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setMapMode('none')} className="p-2 -ml-2 active:scale-95 transition-transform">
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <h1 className="text-gray-900 flex-1">짐을 받을 위치 선택</h1>
          </div>
        </header>

        {/* 검색창 */}
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="도착지 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 relative bg-gray-100">
          <KakaoMap
            onLocationSelect={handleDestinationSelect}
            selectedLocationId={null}
            mapType="delivery"
            onLocationsLoaded={handleDestinationLocationsLoaded}
          />
        </div>
      </div>
    );
  }

  // 메인 화면 - 출발지/도착지 입력
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* 헤더 */}
      <header className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-gray-900 flex-1">짐 배달</h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-md mx-auto">
          {/* 안내 문구 */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck size={32} className="text-purple-600" />
            </div>
            <h2 className="text-gray-900 text-center mb-2">배달 정보를 입력해주세요</h2>
            <p className="text-gray-600 text-sm text-center">
              짐을 맡길 곳과 받을 곳을 선택하세요
            </p>
          </div>

          {/* 경로 입력 영역 */}
          <div className="space-y-3 mb-8">
            {/* 출발지 */}
            <button
              onClick={() => setMapMode('selectOrigin')}
              className="w-full bg-white border-2 border-indigo-200 rounded-2xl p-4 hover:border-indigo-300 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-500 text-xs mb-0.5">짐을 맡길 위치</p>
                  {origin ? (
                    <>
                      <p className="text-gray-900 text-sm">{origin.name}</p>
                      <p className="text-gray-600 text-xs">{origin.address}</p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">가맹점을 선택하세요</p>
                  )}
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </button>

            {/* 연결선 */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-gradient-to-b from-indigo-300 to-purple-300"></div>
            </div>

            {/* 도착지 */}
            <button
              onClick={() => {
                if (origin) {
                  setMapMode('selectDestination');
                }
              }}
              disabled={!origin}
              className={`w-full border-2 rounded-2xl p-4 transition-all ${
                origin 
                  ? 'bg-white border-purple-200 hover:border-purple-300 active:scale-[0.98]' 
                  : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  origin ? 'bg-purple-100' : 'bg-gray-200'
                }`}>
                  <MapPin size={20} className={origin ? 'text-purple-600' : 'text-gray-400'} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-gray-500 text-xs mb-0.5">짐을 받을 위치</p>
                  {destination ? (
                    <>
                      <p className="text-gray-900 text-sm">{destination.name}</p>
                      <p className="text-gray-600 text-xs">{destination.address}</p>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      {origin ? '도착지를 선택하세요' : '출발지를 먼저 선택하세요'}
                    </p>
                  )}
                </div>
                {origin && <ChevronRight size={20} className="text-gray-400" />}
              </div>
            </button>
          </div>

          {/* 픽업 시간 입력 */}
          {origin && destination && (
            <div className="space-y-4 animate-slideUp mb-8">
              <div className="bg-white border-2 border-purple-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm">언제 짐을 찾으러 가시나요?</p>
                    <p className="text-gray-500 text-xs">픽업 예정 시간을 선택해주세요</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {['오전 10시', '오후 2시', '오후 4시', '오후 6시', '오후 8시', '직접입력'].map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        if (time === '직접입력') {
                          const customTime = prompt('픽업 시간을 입력하세요 (예: 오후 3시 30분)');
                          if (customTime) setPickupTime(customTime);
                        } else {
                          setPickupTime(time);
                        }
                      }}
                      className={`py-2.5 rounded-xl text-sm transition-all ${
                        pickupTime === time
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 active:scale-95'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                
                {pickupTime && pickupTime !== '오전 10시' && pickupTime !== '오후 2시' && 
                 pickupTime !== '오후 4시' && pickupTime !== '오후 6시' && pickupTime !== '오후 8시' && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-xl">
                    <p className="text-purple-700 text-sm">선택한 시간: {pickupTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 예상 금액 및 결제 버튼 */}
          {origin && destination && pickupTime && (
            <div className="space-y-4 animate-slideUp">
              {/* 예상 금액 */}
              <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-purple-600" />
                    <span className="text-gray-700 text-sm">예상 배달 금액</span>
                  </div>
                  <span className="text-purple-600">{calculatePrice().toLocaleString()}원</span>
                </div>
                <p className="text-gray-500 text-xs">
                  * 실제 금액은 짐의 크기와 무게에 따라 달라질 수 있습니다
                </p>
              </div>

              {/* 배달 요청하기 버튼 */}
              <button
                onClick={() => {
                  if (selectedStore && destination && pickupTime) {
                    onProceedToWaiting({
                      origin: selectedStore.name,
                      originAddress: selectedStore.address,
                      destination: destination.name,
                      destinationAddress: destination.address,
                      pickupTime: pickupTime,
                      price: calculatePrice()
                    });
                  }
                }}
                className="w-full py-4 rounded-2xl text-white transition-all duration-300 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] shadow-lg"
              >
                배달 요청하기
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
