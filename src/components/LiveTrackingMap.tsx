import { Navigation } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { KAKAO_MAP_API_KEY } from '../config/kakaoMapConfig';

interface LiveTrackingMapProps {
  startLocation: string;
  endLocation: string;
  currentLocation: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export function LiveTrackingMap({ startLocation, endLocation, currentLocation }: LiveTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const mapRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    if (!KAKAO_MAP_API_KEY) {
      setLoadError(true);
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
        setLoadError(false);
      });
    };

    script.onerror = () => {
      console.log('카카오맵 로드 실패. Mock 지도를 사용합니다.');
      setLoadError(true);
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, [KAKAO_MAP_API_KEY]);

  // Mock 좌표 데이터 (실제로는 주소로 geocoding 필요)
  const startCoords = { lat: 37.498095, lng: 127.027610 }; // 강남역
  const endCoords = { lat: 37.504741, lng: 127.049080 }; // 선릉역

  // 배달원 위치를 경로를 따라 이동시키는 시뮬레이션
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0; // 100%에 도달하면 다시 시작 (데모)
        return prev + 0.3;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // 배달원의 현재 위치 계산
  useEffect(() => {
    const ratio = progress / 100;
    const lat = startCoords.lat + (endCoords.lat - startCoords.lat) * ratio;
    const lng = startCoords.lng + (endCoords.lng - startCoords.lng) * ratio;
    setDriverLocation({ lat, lng });
  }, [progress]);

  // 카카오맵 초기화 및 마커 표시
  useEffect(() => {
    if (!isMapLoaded || !mapContainer.current || !window.kakao || !driverLocation) return;

    // 지도 생성
    const options = {
      center: new window.kakao.maps.LatLng(driverLocation.lat, driverLocation.lng),
      level: 5
    };

    const map = new window.kakao.maps.Map(mapContainer.current, options);
    mapRef.current = map;

    // 출발지 마커
    const startMarkerContent = `
      <div style="position: relative;">
        <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #4f46e5; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);">
          <span style="color: white; font-size: 18px;">📦</span>
        </div>
        <div style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); background: white; padding: 4px 8px; border-radius: 8px; white-space: nowrap; font-size: 11px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          출발지
        </div>
      </div>
    `;

    const startCustomOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
      content: startMarkerContent,
      yAnchor: 1,
      zIndex: 10
    });
    startCustomOverlay.setMap(map);

    // 도착지 마커
    const endMarkerContent = `
      <div style="position: relative;">
        <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #059669; border: 3px solid white; border-radius: 50%; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);">
          <span style="color: white; font-size: 18px;">🏁</span>
        </div>
        <div style="position: absolute; top: 45px; left: 50%; transform: translateX(-50%); background: white; padding: 4px 8px; border-radius: 8px; white-space: nowrap; font-size: 11px; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          도착지
        </div>
      </div>
    `;

    const endCustomOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng),
      content: endMarkerContent,
      yAnchor: 1,
      zIndex: 10
    });
    endCustomOverlay.setMap(map);

    // 경로선 (출발지 → 도착지)
    const linePath = [
      new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
      new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng)
    ];

    const polyline = new window.kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 4,
      strokeColor: '#cbd5e1',
      strokeOpacity: 0.7,
      strokeStyle: 'dashed'
    });
    polyline.setMap(map);

    // 이미 지나온 경로 (진행 상황)
    const completedPath = [
      new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
      new window.kakao.maps.LatLng(driverLocation.lat, driverLocation.lng)
    ];

    const completedPolyline = new window.kakao.maps.Polyline({
      path: completedPath,
      strokeWeight: 5,
      strokeColor: '#a855f7',
      strokeOpacity: 1,
      strokeStyle: 'solid'
    });
    completedPolyline.setMap(map);
    polylineRef.current = completedPolyline;

    // 배달원 마커 (움직이는 마커)
    const driverMarkerContent = `
      <div style="position: relative;">
        <div style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: #a855f7; border: 4px solid white; border-radius: 50%; box-shadow: 0 4px 16px rgba(168, 85, 247, 0.5); animation: pulse 2s ease-in-out infinite;">
          <span style="color: white; font-size: 22px;">🚗</span>
        </div>
        <div style="position: absolute; top: 53px; left: 50%; transform: translateX(-50%); background: #a855f7; color: white; padding: 4px 10px; border-radius: 12px; white-space: nowrap; font-size: 11px; font-weight: 700; box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);">
          배달 중 ${Math.round(progress)}%
        </div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `;

    const driverCustomOverlay = new window.kakao.maps.CustomOverlay({
      position: new window.kakao.maps.LatLng(driverLocation.lat, driverLocation.lng),
      content: driverMarkerContent,
      yAnchor: 1,
      zIndex: 100
    });
    driverCustomOverlay.setMap(map);
    driverMarkerRef.current = driverCustomOverlay;

    // 지도 범위 조정 (모든 마커가 보이도록)
    const bounds = new window.kakao.maps.LatLngBounds();
    bounds.extend(new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng));
    bounds.extend(new window.kakao.maps.LatLng(endCoords.lat, endCoords.lng));
    bounds.extend(new window.kakao.maps.LatLng(driverLocation.lat, driverLocation.lng));
    map.setBounds(bounds);

  }, [isMapLoaded, driverLocation, progress]);

  // 배달원 마커 위치 업데이트
  useEffect(() => {
    if (!driverMarkerRef.current || !driverLocation || !polylineRef.current) return;

    // 배달원 마커 위치 업데이트
    const newPosition = new window.kakao.maps.LatLng(driverLocation.lat, driverLocation.lng);
    
    const driverMarkerContent = `
      <div style="position: relative;">
        <div style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: #a855f7; border: 4px solid white; border-radius: 50%; box-shadow: 0 4px 16px rgba(168, 85, 247, 0.5); animation: pulse 2s ease-in-out infinite;">
          <span style="color: white; font-size: 22px;">🚗</span>
        </div>
        <div style="position: absolute; top: 53px; left: 50%; transform: translateX(-50%); background: #a855f7; color: white; padding: 4px 10px; border-radius: 12px; white-space: nowrap; font-size: 11px; font-weight: 700; box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);">
          배달 중 ${Math.round(progress)}%
        </div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      </style>
    `;
    
    driverMarkerRef.current.setContent(driverMarkerContent);
    driverMarkerRef.current.setPosition(newPosition);

    // 진행 경로 업데이트
    const completedPath = [
      new window.kakao.maps.LatLng(startCoords.lat, startCoords.lng),
      newPosition
    ];
    polylineRef.current.setPath(completedPath);

    // 지도는 움직이지 않음 - 출발지와 도착지가 항상 보이도록 고정
  }, [driverLocation, progress]);

  // Mock 지도 표시 (API 키 없을 때)
  if (loadError || !isMapLoaded) {
    return (
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-inner">
        {/* 지도 제목 */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md z-10">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Navigation size={16} className="text-purple-600" />
            <span>실시간 위치 추적</span>
          </p>
        </div>

        {/* 진행률 표시 */}
        <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-xl shadow-md z-10">
          <p className="text-sm">
            {Math.round(progress)}% 완료
          </p>
        </div>

        {/* SVG 지도 */}
        <svg 
          viewBox="0 0 600 400" 
          className="w-full h-64 md:h-80"
          style={{ minHeight: '256px' }}
        >
          {/* 배경 도로망 */}
          <g opacity="0.2">
            <line x1="0" y1="150" x2="600" y2="150" stroke="#94a3b8" strokeWidth="2" />
            <line x1="0" y1="250" x2="600" y2="250" stroke="#94a3b8" strokeWidth="2" />
            <line x1="150" y1="0" x2="150" y2="400" stroke="#94a3b8" strokeWidth="2" />
            <line x1="300" y1="0" x2="300" y2="400" stroke="#94a3b8" strokeWidth="2" />
            <line x1="450" y1="0" x2="450" y2="400" stroke="#94a3b8" strokeWidth="2" />
          </g>

          {/* 건물들 (장식) */}
          <rect x="100" y="180" width="40" height="60" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="2" rx="4" />
          <rect x="200" y="200" width="35" height="45" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="2" rx="4" />
          <rect x="350" y="160" width="45" height="70" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="2" rx="4" />
          <rect x="480" y="140" width="40" height="50" fill="#e0e7ff" stroke="#c7d2fe" strokeWidth="2" rx="4" />

          {/* 경로선 */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
            </linearGradient>
            <radialGradient id="pulse">
              <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: '#a855f7', stopOpacity: 0 }} />
            </radialGradient>
          </defs>

          <path
            d="M 50 300 Q 300 150, 550 100"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeDasharray="10,5"
            opacity="0.5"
          />

          <path
            d="M 50 300 Q 300 150, 550 100"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            strokeDasharray={`${progress * 8} ${800 - progress * 8}`}
            strokeLinecap="round"
          />

          {/* 출발지 마커 */}
          <g transform="translate(50, 300)">
            <circle r="20" fill="#4f46e5" opacity="0.2">
              <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="12" fill="#4f46e5" stroke="white" strokeWidth="3" />
            <text y="40" textAnchor="middle" className="text-xs" fill="#1e293b" fontWeight="600">
              출발지
            </text>
          </g>

          {/* 도착지 마커 */}
          <g transform="translate(550, 100)">
            <circle r="20" fill="#059669" opacity="0.2">
              <animate attributeName="r" values="20;25;20" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="12" fill="#059669" stroke="white" strokeWidth="3" />
            <text y="40" textAnchor="middle" className="text-xs" fill="#1e293b" fontWeight="600">
              도착지
            </text>
          </g>

          {/* 배달원 현재 위치 */}
          <g transform={`translate(${50 + (550 - 50) * (progress / 100)}, ${300 + (100 - 300) * (progress / 100)})`}>
            <circle r="30" fill="url(#pulse)">
              <animate attributeName="r" values="15;35;15" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle r="16" fill="#a855f7" stroke="white" strokeWidth="3">
              <animate attributeName="r" values="16;18;16" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>

        {/* 하단 위치 정보 */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-600 mb-1"></div>
              <p className="text-xs text-gray-600 line-clamp-1">{startLocation}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-purple-600 mb-1 animate-pulse"></div>
              <p className="text-xs text-purple-600 line-clamp-1">배달 중</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-green-600 mb-1"></div>
              <p className="text-xs text-gray-600 line-clamp-1">{endLocation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 실제 카카오맵 표시
  return (
    <div className="relative bg-gray-100 rounded-2xl overflow-hidden shadow-lg">
      {/* 지도 제목 */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md z-50">
        <p className="text-sm text-gray-700 flex items-center gap-2 font-medium">
          <Navigation size={16} className="text-purple-600" />
          <span>실시간 위치 추적</span>
        </p>
      </div>

      {/* 진행률 표시 */}
      <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-xl shadow-lg z-50">
        <p className="text-sm font-bold">
          {Math.round(progress)}% 완료
        </p>
      </div>

      {/* 카카오맵 */}
      <div ref={mapContainer} className="w-full h-64 md:h-80" style={{ minHeight: '256px' }}></div>

      {/* 하단 위치 정보 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-600 mb-1"></div>
            <p className="text-xs text-gray-600 line-clamp-1">{startLocation}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-purple-600 mb-1 animate-pulse"></div>
            <p className="text-xs text-purple-600 font-medium line-clamp-1">배달 중</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-green-600 mb-1"></div>
            <p className="text-xs text-gray-600 line-clamp-1">{endLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
