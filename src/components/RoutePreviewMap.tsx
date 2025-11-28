import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { KAKAO_MAP_API_KEY } from '../config/kakaoMapConfig';

declare global {
  interface Window {
    kakao: any;
  }
}

interface RoutePreviewMapProps {
  startLocation: string;
  startAddress: string;
  endLocation: string;
  endAddress: string;
}

export function RoutePreviewMap({ startLocation, startAddress, endLocation, endAddress }: RoutePreviewMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [startCoords, setStartCoords] = useState({ lat: 37.4979, lng: 127.0276 });
  const [endCoords, setEndCoords] = useState({ lat: 37.5079, lng: 127.0376 });

  // 카카오맵 스크립트 로드
  useEffect(() => {
    if (!KAKAO_MAP_API_KEY) {
      setIsMapLoaded(false);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsMapLoaded(true);
      });
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // 주소를 좌표로 변환
  useEffect(() => {
    if (!isMapLoaded || !window.kakao) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 출발지 좌표 변환
    geocoder.addressSearch(startAddress, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setStartCoords({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x)
        });
      }
    });

    // 도착지 좌표 변환
    geocoder.addressSearch(endAddress, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setEndCoords({
          lat: parseFloat(result[0].y),
          lng: parseFloat(result[0].x)
        });
      }
    });
  }, [isMapLoaded, startAddress, endAddress]);

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current || !window.kakao) return;

    // 지도 생성
    const mapOption = {
      center: new window.kakao.maps.LatLng(
        (startCoords.lat + endCoords.lat) / 2,
        (startCoords.lng + endCoords.lng) / 2
      ),
      level: 5
    };

    const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
    mapRef.current = map;

    // 출발지 마커
    const startMarkerContent = `
      <div style="position: relative;">
        <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #4f46e5; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);">
          <span style="color: white; font-size: 20px;">📦</span>
        </div>
        <div style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); background: #4f46e5; color: white; padding: 4px 10px; border-radius: 12px; white-space: nowrap; font-size: 11px; font-weight: 700; box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);">
          출발지
        </div>
      </div>
    `;

    const startCustomOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
      content: startMarkerContent,
      yAnchor: 1
    });

    startCustomOverlay.setMap(map);

    // 도착지 마커
    const endMarkerContent = `
      <div style="position: relative;">
        <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #059669; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);">
          <span style="color: white; font-size: 20px;">🏁</span>
        </div>
        <div style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); background: #059669; color: white; padding: 4px 10px; border-radius: 12px; white-space: nowrap; font-size: 11px; font-weight: 700; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);">
          도착지
        </div>
      </div>
    `;

    const endCustomOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng),
      content: endMarkerContent,
      yAnchor: 1
    });

    endCustomOverlay.setMap(map);

    // 경로선 그리기
    const linePath = [
      new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
      new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng)
    ];

    const polyline = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#a855f7',
      strokeOpacity: 0.7,
      strokeStyle: 'solid'
    });

    polyline.setMap(map);

    // 두 지점이 모두 보이도록 지도 범위 설정
    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng));
    bounds.extend(new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng));
    map.setBounds(bounds);

    // 약간의 패딩 추가
    setTimeout(() => {
      const level = map.getLevel();
      map.setLevel(level + 1);
    }, 100);

  }, [isMapLoaded, startCoords, endCoords]);

  // Mock 지도 (API 키가 없을 때)
  if (!KAKAO_MAP_API_KEY || !isMapLoaded) {
    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden" style={{ height: '300px' }}>
        <svg viewBox="0 0 400 300" className="w-full h-full">
          {/* 배경 도로 */}
          <line x1="0" y1="150" x2="400" y2="150" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* 경로선 */}
          <path
            d="M 50 200 Q 200 100, 350 150"
            fill="none"
            stroke="url(#mockRouteGradient)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          
          <defs>
            <linearGradient id="mockRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          {/* 출발지 마커 */}
          <circle cx="50" cy="200" r="15" fill="#4f46e5" stroke="white" strokeWidth="3" />
          <text x="50" y="206" textAnchor="middle" fontSize="16">📦</text>
          <text x="50" y="235" textAnchor="middle" className="text-xs" fill="#1e293b" fontWeight="600">출발지</text>
          
          {/* 도착지 마커 */}
          <circle cx="350" cy="150" r="15" fill="#059669" stroke="white" strokeWidth="3" />
          <text x="350" y="156" textAnchor="middle" fontSize="16">🏁</text>
          <text x="350" y="130" textAnchor="middle" className="text-xs" fill="#1e293b" fontWeight="600">도착지</text>
        </svg>
        
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm text-gray-700 flex items-center gap-2">
          <MapPin size={16} className="text-indigo-600" />
          <span>지도 미리보기</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-100 rounded-2xl overflow-hidden" style={{ height: '300px' }}>
      <div ref={mapContainer} className="w-full h-full" />
      
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-sm text-gray-700 flex items-center gap-2">
        <MapPin size={16} className="text-indigo-600" />
        <span>배달 경로</span>
      </div>
    </div>
  );
}
