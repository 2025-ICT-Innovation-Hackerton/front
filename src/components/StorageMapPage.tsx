import { Search, MapPin, X, ArrowLeft, Clock } from 'lucide-react';
import { useState } from 'react';
import { StorageWaitingPage } from './StorageWaitingPage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { KakaoMap } from './KakaoMap';

interface StorageLocation {
  id: number;
  name: string;
  address: string;
  description: string;
  imageUrl: string;
  lat: number;
  lng: number;
  pricePerHour: number;
}

interface StorageMapPageProps {
  onBack: () => void;
  onProceedToPayment: (details: {
    serviceType: 'storage' | 'delivery';
    storeName: string;
    storeAddress: string;
    destination?: string;
    price: number;
    dropOffTime?: string;
    pickUpTime?: string;
  }) => void;
}

export function StorageMapPage({ onBack, onProceedToPayment }: StorageMapPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<StorageLocation | null>(null);
  const [dropOffTime, setDropOffTime] = useState('');
  const [pickUpTime, setPickUpTime] = useState('');
  const [showStorageWaiting, setShowStorageWaiting] = useState(false);
  const [apiLocations, setApiLocations] = useState<StorageLocation[]>([]);

  // API에서 받아온 위치를 StorageLocation 형태로 변환
  const handleLocationsLoaded = (locations: any[]) => {
    console.log('🏪 StorageMapPage: 보관소 데이터 받음:', locations.length, '개');
    
    if (locations.length === 0) {
      console.log('⚠️ API 데이터가 없어서 더미 데이터 사용');
      return;
    }
    
    const storageLocations = locations.map(loc => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
      description: loc.distance ? `${Math.round(loc.distance)}m 거리` : '짐 보관 가능',
      imageUrl: 'https://images.unsplash.com/photo-1641440616173-7241e6fe6be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZW5pZW5jZSUyMHN0b3JlfGVufDF8fHx8MTc2NDIyMzAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
      lat: loc.lat,
      lng: loc.lng,
      pricePerHour: loc.pricePerHour || 1000
    }));
    console.log('✅ 보관소 설정 완료:', storageLocations);
    setApiLocations(storageLocations);
  };

  // API에서 받아온 데이터 사용, 없으면 빈 배열
  const locations: StorageLocation[] = apiLocations.length > 0 ? apiLocations : [
    { 
      id: 1, 
      name: '편의점 GS25', 
      address: '서울시 강남구 테헤란로 123',
      description: '24시간 운영, 짐 보관 서비스 제공',
      imageUrl: 'https://images.unsplash.com/photo-1641440616173-7241e6fe6be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZW5pZW5jZSUyMHN0b3JlfGVufDF8fHx8MTc2NDIyMzAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.500095,
      lng: 127.029610,
      pricePerHour: 1000 
    },
    { 
      id: 2, 
      name: '카페 투썸플레이스', 
      address: '서울시 강남구 역삼동 456',
      description: '편안한 분위기, 짐 맡기기 편리',
      imageUrl: 'https://images.unsplash.com/photo-1604552914267-90a8d81a4254?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZXxlbnwxfHx8fDE3NjQyNDEwODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.495095,
      lng: 127.032610,
      pricePerHour: 1500 
    },
    { 
      id: 3, 
      name: '게스트하우스 서울', 
      address: '서울시 강남구 선릉로 789',
      description: '친절한 직원, 안전한 보관',
      imageUrl: 'https://images.unsplash.com/photo-1675409145919-277c0fc2aa7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWVzdGhvdXNlJTIwaG90ZWx8ZW58MXx8fHwxNzY0MjUyMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.501095,
      lng: 127.024610,
      pricePerHour: 2000 
    },
    { 
      id: 4, 
      name: 'CU 편의점', 
      address: '서울시 강남구 강남대로 234',
      description: '역 근처 위치, 접근성 우수',
      imageUrl: 'https://images.unsplash.com/photo-1636668150626-e5ddfcb5c3c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHN0b3JlJTIwc2hvcHxlbnwxfHx8fDE3NjQyNTIwNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.496095,
      lng: 127.026610,
      pricePerHour: 1000 
    },
    { 
      id: 5, 
      name: '호텔 비즈니스', 
      address: '서울시 강남구 논현동 567',
      description: '고급 서비스, 보안 철저',
      imageUrl: 'https://images.unsplash.com/photo-1608022099316-02dbaebb4d7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhvdGVsfGVufDF8fHx8MTc2NDIwNjg1NXww&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.503095,
      lng: 127.030610,
      pricePerHour: 3000 
    },
    { 
      id: 6, 
      name: '스타벅스', 
      address: '서울시 강남구 삼성로 890',
      description: '넓은 공간, 짐 보관 가능',
      imageUrl: 'https://images.unsplash.com/photo-1589476993333-f55b84301219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFyYnVja3MlMjBjb2ZmZWV8ZW58MXx8fHwxNzY0MjIwMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      lat: 37.499095,
      lng: 127.035610,
      pricePerHour: 1500 
    },
  ];

  const calculatePrice = () => {
    if (!dropOffTime || !pickUpTime || !selectedLocation) return 0;
    
    const dropOff = new Date(`2024-01-01 ${dropOffTime}`);
    const pickUp = new Date(`2024-01-01 ${pickUpTime}`);
    let hours = (pickUp.getTime() - dropOff.getTime()) / (1000 * 60 * 60);
    
    // 다음날인 경우
    if (hours < 0) {
      hours += 24;
    }
    
    return Math.ceil(hours) * (selectedLocation.pricePerHour || 1000);
  };

  const totalPrice = calculatePrice();

  if (showStorageWaiting && selectedLocation) {
    return (
      <StorageWaitingPage
        onBack={() => setShowStorageWaiting(false)}
        storeName={selectedLocation.name}
        storeAddress={selectedLocation.address}
        dropOffTime={dropOffTime}
        pickUpTime={pickUpTime}
        totalPrice={totalPrice}
      />
    );
  }

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
          <h1 className="text-gray-900 flex-1">짐 보관</h1>
        </div>
      </header>

      {/* 검색창 */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="보관할 장소를 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="flex-1 relative bg-gray-100">
        <KakaoMap
          onLocationSelect={setSelectedLocation}
          selectedLocationId={selectedLocation?.id || null}
          mapType="storage"
          onLocationsLoaded={handleLocationsLoaded}
        />
      </div>

      {/* 선택된 장소 팝업 */}
      {selectedLocation && (
        <div 
          className="absolute inset-0 bg-black/30 flex items-end z-50"
          onClick={() => {
            setSelectedLocation(null);
            setDropOffTime('');
            setPickUpTime('');
          }}
        >
          <div 
            className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => {
                setSelectedLocation(null);
                setDropOffTime('');
                setPickUpTime('');
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>

            {/* 장소 이미지 */}
            {/* <div className="mb-4 -mx-6 -mt-6">
              <ImageWithFallback
                src={selectedLocation.imageUrl}
                alt={selectedLocation.name}
                className="w-full h-48 object-cover rounded-t-3xl"
              />
            </div> */}

            {/* 장소 정보 */}
            <div className="mb-6">
              <h2 className="text-gray-900 mb-2">{selectedLocation.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{selectedLocation.address}</p>
              <p className="text-gray-500 text-sm mb-2">{selectedLocation.description}</p>
              <p className="text-indigo-600 text-sm">시간당 {(selectedLocation.pricePerHour || 1000).toLocaleString()}원</p>
            </div>

            {/* 시간 입력 */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <Clock size={18} className="text-indigo-600" />
                  맡길 시간
                </label>
                <input
                  type="time"
                  value={dropOffTime}
                  onChange={(e) => setDropOffTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 flex items-center gap-2">
                  <Clock size={18} className="text-purple-600" />
                  찾을 시간
                </label>
                <input
                  type="time"
                  value={pickUpTime}
                  onChange={(e) => setPickUpTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* 가격 표시 */}
            {dropOffTime && pickUpTime && (
              <div className="bg-indigo-50 rounded-2xl p-4 mb-4 border border-indigo-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">예상 금액</span>
                  <span className="text-indigo-600">{totalPrice.toLocaleString()}원</span>
                </div>
              </div>
            )}

            {/* 결제하기 버튼 */}
            <button
              disabled={!dropOffTime || !pickUpTime}
              onClick={() => {
                if (dropOffTime && pickUpTime && selectedLocation) {
                  onProceedToPayment({
                    serviceType: 'storage',
                    storeName: selectedLocation.name,
                    storeAddress: selectedLocation.address,
                    price: totalPrice,
                    dropOffTime: dropOffTime,
                    pickUpTime: pickUpTime
                  });
                }
              }}
              className={`
                w-full py-4 rounded-2xl text-white transition-all duration-300
                ${dropOffTime && pickUpTime 
                  ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-lg' 
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              결제하기
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
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
