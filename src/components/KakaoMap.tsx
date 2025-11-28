import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { KAKAO_MAP_API_KEY } from '../config/kakaoMapConfig';

declare global {
  interface Window {
    kakao: any;
  }
}

interface Location {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

interface KakaoMapProps {
  locations?: Location[];
  onLocationSelect?: (location: Location) => void;
  selectedLocationId?: number | null;
  mapType?: 'storage' | 'delivery';
  onLocationsLoaded?: (locations: Location[]) => void;
  allowMapClick?: boolean; // 지도 클릭으로 위치 선택 허용
  onMapClick?: (location: Location) => void; // 지도 클릭 시 호출
}

export function KakaoMap({ locations: propLocations, onLocationSelect, selectedLocationId, mapType = 'storage', onLocationsLoaded, allowMapClick = false, onMapClick }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [apiLocations, setApiLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const hasFetchedRef = useRef(false);
  const customMarkerRef = useRef<any>(null); // 사용자가 찍은 마커

  // propLocations가 있으면 그것을 사용하고, 없으면 API에서 받아온 locations 사용
  const locations = propLocations || apiLocations;

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(false);
        },
        (error) => {
          console.log('위치 정보를 가져올 수 없습니다. 기본 위치(강남역)를 사용합니다.');
          // 기본 위치: 강남역
          setCurrentLocation({
            lat: 37.498095,
            lng: 127.027610
          });
          setLocationError(true);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      // Geolocation을 지원하지 않는 브라우저
      setCurrentLocation({
        lat: 37.498095,
        lng: 127.027610
      });
      setLocationError(true);
    }
  }, []);

  // API에서 가맹점 정보 가져오기 (propLocations가 없을 때만, 1번만 실행)
  useEffect(() => {
    if (!currentLocation || propLocations || hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    setIsLoadingLocations(true);
    
    console.log('🌐 API 호출 시작:', `http://192.168.0.23:8080/map/${currentLocation.lat}/${currentLocation.lng}`);
    
    fetch(`http://192.168.0.23:8080/map/${currentLocation.lat}/${currentLocation.lng}`)
      .then(response => {
        console.log('📡 API 응답 받음:', response.status);
        return response.json();
      })
      .then((data: Location[]) => {
        console.log('✅ API 데이터 받음:', data.length, '개의 가맹점');
        console.log('📍 가맹점 목록:', data);
        setApiLocations(data);
        if (onLocationsLoaded) {
          onLocationsLoaded(data);
        }
        setIsLoadingLocations(false);
      })
      .catch(error => {
        console.error('❌ 가맹점 정보를 불러오는데 실패했습니다:', error);
        console.log('🔧 API 서버가 꺼져있거나 응답이 없습니다.');
        setIsLoadingLocations(false);
        // 에러 시 빈 배열 - 부모 컴포넌트가 더미 데이터를 사용하도록
        setApiLocations([]);
        // 부모 컴포넌트에 빈 배열 전달 (더미 데이터 사용 유도)
        if (onLocationsLoaded) {
          onLocationsLoaded([]);
        }
      });
  }, [currentLocation, propLocations]); // onLocationsLoaded 제거

  // 카카오맵 스크립트 로드
  useEffect(() => {
    // API 키가 없으면 스크립트 로드하지 않고 Mock 지도 표시
    if (!KAKAO_MAP_API_KEY || KAKAO_MAP_API_KEY.trim() === '') {
      setLoadError(true);
      return;
    }

    // 이미 카카오맵이 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;
    
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsMapLoaded(true);
        });
      } else {
        setLoadError(true);
      }
    };

    script.onerror = () => {
      setLoadError(true);
    };

    document.head.appendChild(script);

    return () => {
      // 이미 다른 인스턴스에서 사용 중일 수 있으므로 제거하지 않음
      try {
        if (script.parentNode) {
          document.head.removeChild(script);
        }
      } catch (e) {
        // 에러 무시
      }
    };
  }, [KAKAO_MAP_API_KEY]);

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current || !window.kakao || !currentLocation) return;

    // 지도 중심 좌표 (현재 위치 기준)
    const centerLat = 35.1609510984934;
    const centerLng = 129.167202119639;

    const options = {
      center: new window.kakao.maps.LatLng(centerLat, centerLng),
      level: 4 // 확대 레벨
    };

    // 지도 생성
    const map = new window.kakao.maps.Map(mapContainer.current, options);
    mapRef.current = map;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 현재 위치 마커 표시
    const currentMarkerContent = `
      <div style="position: relative;">
        <div style="width: 16px; height: 16px; background: #ef4444; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
        <div style="position: absolute; top: 0; left: 0; width: 16px; height: 16px; background: #ef4444; border-radius: 50%; opacity: 0.5; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      </div>
    `;

    const currentCustomOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(centerLat, centerLng),
      content: currentMarkerContent,
      zIndex: 100
    });
    currentCustomOverlay.setMap(map);

    // 각 장소에 마커 추가
    locations.forEach((location) => {
      const markerPosition = new window.kakao.maps.LatLng(location.lat, location.lng);
      
      // 마커 이미지 설정
      const markerColor = mapType === 'storage' ? '#4f46e5' : '#9333ea';
      const isSelected = selectedLocationId === location.id;
      
      const markerContent = `
        <div style="position: relative; cursor: pointer;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="${isSelected ? markerColor : '#374151'}" stroke="white" stroke-width="2" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); ${isSelected ? 'transform: scale(1.2);' : ''}">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
          </svg>
        </div>
      `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: markerPosition,
        content: markerContent,
        yAnchor: 1,
        zIndex: isSelected ? 50 : 10
      });

      customOverlay.setMap(map);
      markersRef.current.push(customOverlay);

      // 마커 클릭 이벤트
      const markerElement = customOverlay.a;
      if (markerElement && onLocationSelect) {
        markerElement.onclick = () => {
          onLocationSelect(location);
        };
      }
    });

    // 지도 클릭 이벤트 (allowMapClick이 true일 때만)
    if (allowMapClick && onMapClick) {
      window.kakao.maps.event.addListener(map, 'click', function(mouseEvent: any) {
        const latlng = mouseEvent.latLng;
        
        // 사용자가 찍은 마커 제거
        if (customMarkerRef.current) {
          customMarkerRef.current.setMap(null);
        }
        
        // 새로운 마커 생성 (초록색으로 구분)
        const customMarkerContent = `
          <div style="position: relative; cursor: pointer;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#10b981" stroke="white" stroke-width="2" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); animation: bounce 1s infinite;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3" fill="white"></circle>
            </svg>
          </div>
        `;
        
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position: latlng,
          content: customMarkerContent,
          yAnchor: 1,
          zIndex: 200
        });
        
        customOverlay.setMap(map);
        customMarkerRef.current = customOverlay;
        
        // 역지오코딩 (좌표 -> 주소) - services가 로드되어 있을 때만
        if (window.kakao.maps.services) {
          try {
            const geocoder = new window.kakao.maps.services.Geocoder();
            
            geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result: any, status: any) {
              let address = '선택한 위치';
              
              if (status === window.kakao.maps.services.Status.OK && result[0]) {
                address = result[0].address.address_name || '선택한 위치';
              }
              
              // 콜백 호출
              onMapClick({
                id: -1,
                name: '📍 선택한 위치',
                address: address,
                lat: latlng.getLat(),
                lng: latlng.getLng()
              });
            });
          } catch (error) {
            console.error('역지오코딩 실패:', error);
            // 에러 시에도 콜백 호출 (주소 없이)
            onMapClick({
              id: -1,
              name: '📍 선택한 위치',
              address: '선택한 위치',
              lat: latlng.getLat(),
              lng: latlng.getLng()
            });
          }
        } else {
          // services 라이브러리가 없을 때
          onMapClick({
            id: -1,
            name: '📍 선택한 위치',
            address: '선택한 위치',
            lat: latlng.getLat(),
            lng: latlng.getLng()
          });
        }
      });
    }

  }, [isMapLoaded, locations, selectedLocationId, mapType, onLocationSelect, currentLocation, allowMapClick, onMapClick]);

  // Mock 지도 클릭 핸들러
  const [mockCustomMarker, setMockCustomMarker] = useState<{ x: number; y: number } | null>(null);

  const handleMockMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!allowMapClick || !onMapClick) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMockCustomMarker({ x, y });
    
    // 대략적인 좌표 계산 (강남역 기준)
    const baseLat = currentLocation?.lat || 37.498095;
    const baseLng = currentLocation?.lng || 127.027610;
    const lat = baseLat + (y - 50) * -0.001;
    const lng = baseLng + (x - 50) * 0.001;
    
    onMapClick({
      id: -1,
      name: '📍 선택한 위치',
      address: '서울시 강남구 (지도 클릭)',
      lat,
      lng
    });
  };

  // 에러 또는 API 키 없을 때 Mock 지도 표시
  if (loadError || !isMapLoaded) {
    return (
      <div className="absolute inset-0 bg-gray-100">
        {/* Mock 지도 배경 */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"
          onClick={handleMockMapClick}
          style={{ cursor: allowMapClick ? 'crosshair' : 'default' }}
        >
          {/* 가상의 도로 라인들 */}
          <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-gray-300 opacity-30"></div>
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 opacity-30"></div>
          <div className="absolute top-3/4 left-0 right-0 h-0.5 bg-gray-300 opacity-30"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-0.5 bg-gray-300 opacity-30"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300 opacity-30"></div>
          <div className="absolute top-0 bottom-0 left-3/4 w-0.5 bg-gray-300 opacity-30"></div>
        </div>

        {/* 현재 위치 마커 (빨간색) */}
        <div 
          className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg z-50"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </div>

        {/* 위치 정보 안내 */}
        {locationError && (
          <div className="absolute bottom-20 left-4 right-4 z-50">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-lg">
              <p className="text-blue-800 text-xs">
                📍 위치 정보를 사용할 수 없어 기본 위치(강남역)를 표시합니다
              </p>
            </div>
          </div>
        )}

        {/* 지도 클릭 안내 */}
        {allowMapClick && (
          <div className="absolute top-20 left-4 right-4 z-50">
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 shadow-lg animate-pulse">
              <p className="text-green-800">
                📍 지도를 클릭해서 위치를 선택하거나, 아래 가게를 선택하세요!
              </p>
            </div>
          </div>
        )}

        {/* Mock 마커들 */}
        {locations.map((location, index) => {
          const x = 30 + (index % 3) * 20;
          const y = 25 + Math.floor(index / 3) * 25;
          
          return (
            <button
              key={location.id}
              onClick={(e) => {
                e.stopPropagation();
                onLocationSelect?.(location);
              }}
              className="absolute transform -translate-x-1/2 -translate-y-full active:scale-95 transition-transform"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className={`relative ${selectedLocationId === location.id ? 'scale-110' : ''} transition-transform`}>
                <MapPin 
                  size={36} 
                  className={`${selectedLocationId === location.id ? (mapType === 'storage' ? 'text-indigo-600' : 'text-purple-600') : 'text-gray-700'} drop-shadow-lg`}
                  fill={selectedLocationId === location.id ? (mapType === 'storage' ? '#4f46e5' : '#9333ea') : '#374151'}
                />
                <div className="absolute top-1 left-1/2 -translate-x-1/2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </button>
          );
        })}

        {/* 사용자가 찍은 커스텀 마커 (초록색) */}
        {mockCustomMarker && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full animate-bounce z-50"
            style={{ left: `${mockCustomMarker.x}%`, top: `${mockCustomMarker.y}%` }}
          >
            <MapPin 
              size={42} 
              className="text-green-500 drop-shadow-lg"
              fill="#10b981"
            />
            <div className="absolute top-1 left-1/2 -translate-x-1/2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        )}

        {/* API 키 안내 - 개발 모드에서만 표시 */}
        {!loadError && (
          <div className="absolute top-4 left-4 right-4 z-50">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 shadow-lg">
              <p className="text-blue-800 text-xs">
                💡 카카오맵 API 키를 설정하면 실제 지도가 표시됩니다
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="absolute inset-0"
      style={{ width: '100%', height: '100%', cursor: allowMapClick ? 'crosshair' : 'default' }}
    >
      {/* 지도 클릭 안내 (실제 카카오맵) */}
      {allowMapClick && (
        <div className="absolute top-4 left-4 right-4 z-50">
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4 shadow-lg animate-pulse">
            <p className="text-green-800">
              📍 지도를 클릭해서 위치를 선택하거나, 가게 핀을 클릭하세요!
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
