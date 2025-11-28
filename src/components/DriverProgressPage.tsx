import { MapPin, Package, Camera, CheckCircle, Upload, Phone, Navigation, Clock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { KAKAO_MAP_API_KEY } from '../config/kakaoMapConfig';

type DeliveryStep = 'going_to_pickup' | 'at_pickup' | 'picked_up' | 'delivering' | 'at_destination' | 'completed';

interface DriverProgressPageProps {
  callId: number;
  startLocation: string;
  startAddress: string;
  endLocation: string;
  endAddress: string;
  onComplete: () => void;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function DriverProgressPage({ 
  callId, 
  startLocation, 
  startAddress, 
  endLocation, 
  endAddress,
  onComplete 
}: DriverProgressPageProps) {
  const [currentStep, setCurrentStep] = useState<DeliveryStep>('going_to_pickup');
  const [pickupPhoto, setPickupPhoto] = useState<string | null>(null);
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const currentMarkerRef = useRef<any>(null);

  // 현재 위치 추적
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.log('위치 추적 실패:', error);
        // 기본 위치 (강남역 근처)
        setCurrentLocation({
          lat: 37.500095,
          lng: 127.030610
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    if (!KAKAO_MAP_API_KEY) {
      setIsMapLoaded(false);
      return;
    }

    if (window.kakao && window.kakao.maps) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    };

    script.onerror = () => {
      console.log('카카오맵 로드 실패');
      setIsMapLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [KAKAO_MAP_API_KEY]);

  // 카카오맵 초기화
  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current || !window.kakao || !currentLocation) return;

    const options = {
      center: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      level: 4
    };

    const map = new window.kakao.maps.Map(mapContainer.current, options);
    mapRef.current = map;

    // 목적지 좌표 (Mock - 실제로는 geocoding 필요)
    const targetCoords = currentStep === 'going_to_pickup' || currentStep === 'at_pickup'
      ? { lat: 37.498095, lng: 127.027610 } // 픽업지 (강남역)
      : { lat: 37.504741, lng: 127.049080 }; // 배달지 (선릉역)

    // 목적지 마커
    const targetColor = currentStep === 'going_to_pickup' || currentStep === 'at_pickup' 
      ? '#4f46e5' 
      : '#059669';
    
    const targetEmoji = currentStep === 'going_to_pickup' || currentStep === 'at_pickup'
      ? '📦'
      : '🏁';

    const targetLabel = currentStep === 'going_to_pickup' || currentStep === 'at_pickup'
      ? '픽업지'
      : '배달지';

    const targetMarkerContent = `
      <div style="position: relative;">
        <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: ${targetColor}; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          <span style="font-size: 20px;">${targetEmoji}</span>
        </div>
        <div style="position: absolute; top: 49px; left: 50%; transform: translateX(-50%); background: white; padding: 4px 8px; border-radius: 8px; white-space: nowrap; font-size: 11px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          ${targetLabel}
        </div>
      </div>
    `;

    const targetOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(targetCoords.lat, targetCoords.lng),
      content: targetMarkerContent,
      yAnchor: 1,
      zIndex: 10
    });
    targetOverlay.setMap(map);

    // 현재 위치 마커
    const currentMarkerContent = `
      <div style="position: relative;">
        <div style="width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: #a855f7; border: 4px solid white; border-radius: 50%; box-shadow: 0 6px 16px rgba(168, 85, 247, 0.5); animation: driverPulse 2s ease-in-out infinite;">
          <span style="font-size: 24px;">🚗</span>
        </div>
        <div style="position: absolute; top: 57px; left: 50%; transform: translateX(-50%); background: #a855f7; color: white; padding: 4px 10px; border-radius: 12px; white-space: nowrap; font-size: 11px; font-weight: 700; box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);">
          내 위치
        </div>
      </div>
      <style>
        @keyframes driverPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      </style>
    `;

    const currentOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      content: currentMarkerContent,
      yAnchor: 1,
      zIndex: 100
    });
    currentOverlay.setMap(map);
    currentMarkerRef.current = currentOverlay;

    // 경로선 그리기
    const linePath = [
      new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      new window.kakao.maps.LatLng(targetCoords.lat, targetCoords.lng)
    ];

    const polyline = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#a855f7',
      strokeOpacity: 0.8,
      strokeStyle: 'solid'
    });
    polyline.setMap(map);

    // 지도 범위 조정
    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng));
    bounds.extend(new window.kakao.maps.LatLng(targetCoords.lat, targetCoords.lng));
    map.setBounds(bounds);

  }, [isMapLoaded, currentLocation, currentStep]);

  // 현재 위치 마커 업데이트
  useEffect(() => {
    if (!currentMarkerRef.current || !currentLocation) return;

    const newPosition = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
    currentMarkerRef.current.setPosition(newPosition);

    // 지도는 고정 - 목적지가 항상 보이도록 유지
  }, [currentLocation]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'pickup' | 'delivery') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'pickup') {
          setPickupPhoto(reader.result as string);
          // 픽업 사진 업로드 후 자동으로 다음 단계로
          setTimeout(() => {
            setCurrentStep('picked_up');
          }, 500);
        } else {
          setDeliveryPhoto(reader.result as string);
          // 배달 사진 업로드 후 완료 처리
          setTimeout(() => {
            setCurrentStep('completed');
          }, 500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getStepInfo = () => {
    switch (currentStep) {
      case 'going_to_pickup':
        return {
          title: '픽업 장소로 이동 중',
          description: '픽업 장소에 도착하면 "도착" 버튼을 눌러주세요',
          color: 'from-blue-600 to-indigo-600'
        };
      case 'at_pickup':
        return {
          title: '픽업 장소 도착',
          description: '짐을 확인하고 사진을 촬영해주세요',
          color: 'from-indigo-600 to-purple-600'
        };
      case 'picked_up':
        return {
          title: '픽업 완료',
          description: '배달 장소로 이동 중입니다',
          color: 'from-purple-600 to-pink-600'
        };
      case 'delivering':
        return {
          title: '배달 중',
          description: '도착지로 안전하게 배달해주세요',
          color: 'from-purple-600 to-pink-600'
        };
      case 'at_destination':
        return {
          title: '배달 장소 도착',
          description: '짐을 전달하고 완료 사진을 촬영해주세요',
          color: 'from-pink-600 to-red-600'
        };
      case 'completed':
        return {
          title: '배달 완료!',
          description: '수고하셨습니다',
          color: 'from-green-600 to-emerald-600'
        };
    }
  };

  const stepInfo = getStepInfo();

  const renderStepProgress = () => {
    const steps = [
      { key: 'going_to_pickup', label: '픽업 이동' },
      { key: 'at_pickup', label: '픽업 도착' },
      { key: 'picked_up', label: '픽업 완료' },
      { key: 'delivering', label: '배달 중' },
      { key: 'at_destination', label: '배달 도착' },
      { key: 'completed', label: '완료' }
    ];

    const currentIndex = steps.findIndex(s => s.key === currentStep);

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={step.key} className="flex flex-col items-center flex-1 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                index <= currentIndex
                  ? 'bg-purple-600'
                  : 'bg-gray-200'
              }`}>
                {index < currentIndex ? (
                  <CheckCircle size={16} className="text-white" />
                ) : (
                  <div className={`w-3 h-3 rounded-full ${
                    index <= currentIndex ? 'bg-white' : 'bg-gray-400'
                  }`}></div>
                )}
              </div>
              <span className={`text-xs mt-1 text-center ${
                index <= currentIndex ? 'text-purple-600' : 'text-gray-400'
              }`} style={{ maxWidth: '60px' }}>
                {step.label}
              </span>
            </div>
          ))}
          
          {/* 연결선 */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0">
            <div 
              className="h-full bg-purple-600 transition-all duration-500"
              style={{
                width: `${(currentIndex / (steps.length - 1)) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="p-6 max-w-2xl mx-auto">
        {/* 상태 헤더 */}
        <div className={`bg-gradient-to-r ${stepInfo.color} rounded-3xl p-6 mb-6 shadow-xl text-white`}>
          <div className="flex items-center gap-2 mb-2">
            <Navigation size={24} />
            <h2 className="text-white">{stepInfo.title}</h2>
          </div>
          <p className="text-white/90">{stepInfo.description}</p>
        </div>

        {/* 진행 상태바 */}
        {renderStepProgress()}

        {/* 실시간 지도 */}
        {currentStep !== 'completed' && (
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">실시간 위치</h3>
              <div className="flex items-center gap-2 text-purple-600 text-sm font-medium">
                <Navigation size={16} />
                <span>
                  {currentStep === 'going_to_pickup' || currentStep === 'at_pickup' 
                    ? '픽업지로 이동' 
                    : '배달지로 이동'}
                </span>
              </div>
            </div>

            {isMapLoaded && KAKAO_MAP_API_KEY ? (
              <div ref={mapContainer} className="w-full h-64 rounded-2xl overflow-hidden shadow-inner"></div>
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Navigation size={48} className="text-purple-300 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">실시간 지도를 불러오는 중...</p>
                  <p className="text-gray-400 text-xs mt-1">카카오맵 API 키를 설정하면 실제 지도가 표시됩니다</p>
                </div>
              </div>
            )}

            {currentLocation && (
              <div className="mt-3 p-3 bg-purple-50 rounded-xl">
                <p className="text-sm text-purple-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <span>위치 추적 활성화됨</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 위치 정보 */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <h3 className="text-gray-900 mb-4">배달 정보</h3>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                <MapPin size={18} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">픽업 장소</p>
                <p className="text-gray-900">{startLocation}</p>
                <p className="text-sm text-gray-500 mt-0.5">{startAddress}</p>
                {(currentStep === 'going_to_pickup' || currentStep === 'at_pickup') && (
                  <a 
                    href={`https://map.kakao.com/link/to/${startLocation},${startAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-indigo-600 hover:underline"
                  >
                    📍 길찾기
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100"></div>

            <div className="flex gap-3">
              <div className="bg-green-100 p-2 rounded-lg h-fit">
                <MapPin size={18} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">배달 장소</p>
                <p className="text-gray-900">{endLocation}</p>
                <p className="text-sm text-gray-500 mt-0.5">{endAddress}</p>
                {(currentStep === 'picked_up' || currentStep === 'delivering' || currentStep === 'at_destination') && (
                  <a 
                    href={`https://map.kakao.com/link/to/${endLocation},${endAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-green-600 hover:underline"
                  >
                    📍 길찾기
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 픽업 사진 촬영 (픽업 장소 도착 시) */}
        {currentStep === 'at_pickup' && (
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
            <h3 className="text-gray-900 mb-4">픽업 사진 촬영</h3>
            
            <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 text-center bg-indigo-50">
              <Camera size={48} className="text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">짐을 확인하고 사진을 촬영해주세요</p>
              
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileUpload(e, 'pickup')}
                className="hidden"
                id="pickup-photo"
              />
              <label
                htmlFor="pickup-photo"
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Camera size={20} />
                  <span>사진 촬영</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 픽업 사진 미리보기 */}
        {pickupPhoto && currentStep !== 'at_pickup' && (
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
            <h3 className="text-gray-900 mb-4">픽업 사진</h3>
            
            <div className="relative rounded-2xl overflow-hidden">
              <img src={pickupPhoto} alt="픽업 사진" className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <CheckCircle size={14} />
                <span>촬영 완료</span>
              </div>
            </div>
          </div>
        )}

        {/* 배달 사진 촬영 (배달 장소 도착 시) */}
        {currentStep === 'at_destination' && (
          <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
            <h3 className="text-gray-900 mb-4">배달 완료 사진 촬영</h3>
            
            <div className="border-2 border-dashed border-green-300 rounded-2xl p-8 text-center bg-green-50">
              <Camera size={48} className="text-green-600 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">짐을 전달하고 완료 사진을 촬영해주세요</p>
              
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleFileUpload(e, 'delivery')}
                className="hidden"
                id="delivery-photo"
              />
              <label
                htmlFor="delivery-photo"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl cursor-pointer hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Camera size={20} />
                  <span>완료 사진 촬영</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* 완료 화면 */}
        {currentStep === 'completed' && (
          <div className="bg-white rounded-3xl p-8 mb-6 shadow-lg text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h3 className="text-gray-900 mb-2">배달이 완료되었습니다!</h3>
            <p className="text-gray-600 mb-6">수고하셨습니다. 수익이 정산됩니다.</p>
            
            {deliveryPhoto && (
              <div className="rounded-2xl overflow-hidden mb-4">
                <img src={deliveryPhoto} alt="배달 완료 사진" className="w-full h-48 object-cover" />
              </div>
            )}

            <button
              onClick={onComplete}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all shadow-lg"
            >
              다른 콜 보기
            </button>
          </div>
        )}

        {/* 액션 버튼들 */}
        {currentStep === 'going_to_pickup' && (
          <button
            onClick={() => setCurrentStep('at_pickup')}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <MapPin size={20} />
            <span>픽업 장소 도착</span>
          </button>
        )}

        {currentStep === 'picked_up' && (
          <button
            onClick={() => setCurrentStep('at_destination')}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <MapPin size={20} />
            <span>배달 장소 도착</span>
          </button>
        )}

        {/* 고객 연락 버튼 */}
        {currentStep !== 'completed' && (
          <button className="w-full mt-3 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <Phone size={20} />
            <span>고객에게 전화하기</span>
          </button>
        )}
      </div>
    </div>
  );
}
