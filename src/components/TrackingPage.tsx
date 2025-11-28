import { Package, MapPin, Clock, CheckCircle, Truck, User, Camera } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LiveTrackingMap } from './LiveTrackingMap';

type DeliveryStatus = 'before' | 'in_progress' | 'completed';

interface TrackingItem {
  id: number;
  type: 'storage' | 'delivery';
  status: DeliveryStatus;
  storeName: string;
  storeAddress: string;
  currentLocation?: string;
  destination?: string;
  estimatedTime?: string;
  completedTime?: string;
  driverName?: string;
  driverPhone?: string;
  imageUrl: string;
  deliveryPhotoUrl?: string;
}

export function TrackingPage() {
  // Mock 데이터
  const [trackingItems] = useState<TrackingItem[]>([
    {
      id: 1,
      type: 'delivery',
      status: 'in_progress',
      storeName: '편의점 GS25',
      storeAddress: '서울시 강남구 테헤란로 123',
      currentLocation: '서울시 강남구 역삼동',
      destination: '서울시 서초구 서초대로 456',
      estimatedTime: '15분',
      driverName: '김기사',
      driverPhone: '010-1234-5678',
      imageUrl: 'https://images.unsplash.com/photo-1641440616173-7241e6fe6be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZW5pZW5jZSUyMHN0b3JlfGVufDF8fHx8MTc2NDIyMzAzMnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      type: 'storage',
      status: 'before',
      storeName: '게스트하우스 서울',
      storeAddress: '서울시 강남구 선릉로 789',
      estimatedTime: '오늘 14:00',
      imageUrl: 'https://images.unsplash.com/photo-1675409145919-277c0fc2aa7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWVzdGhvdXNlJTIwaG90ZWx8ZW58MXx8fHwxNzY0MjUyMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 3,
      type: 'delivery',
      status: 'completed',
      storeName: '카페 투썸플레이스',
      storeAddress: '서울시 강남구 역삼동 456',
      destination: '서울시 송파구 올림픽로 789',
      completedTime: '어제 16:30',
      driverName: '이기사',
      imageUrl: 'https://images.unsplash.com/photo-1604552914267-90a8d81a4254?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZXxlbnwxfHx8fDE3NjQyNDEwODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      deliveryPhotoUrl: 'https://images.unsplash.com/photo-1760648311436-d18d39f499bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdWdnYWdlJTIwYmFnJTIwdHJhdmVsfGVufDF8fHx8MTc2NDI4NzUxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ]);

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'before': return 'text-gray-600 bg-gray-100';
      case 'in_progress': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
    }
  };

  const getStatusText = (status: DeliveryStatus) => {
    switch (status) {
      case 'before': return '배달 전';
      case 'in_progress': return '배달 중';
      case 'completed': return '배달 완료';
    }
  };

  const renderStatusBar = (status: DeliveryStatus) => {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between relative">
          {/* 배달 전 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              status === 'before' || status === 'in_progress' || status === 'completed'
                ? 'bg-purple-600'
                : 'bg-gray-200'
            }`}>
              <Package size={20} className={
                status === 'before' || status === 'in_progress' || status === 'completed'
                  ? 'text-white'
                  : 'text-gray-400'
              } />
            </div>
            <span className={`text-xs mt-2 ${
              status === 'before' ? 'text-purple-600' : 'text-gray-500'
            }`}>
              배달 전
            </span>
          </div>

          {/* 배달 중 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              status === 'in_progress' || status === 'completed'
                ? 'bg-purple-600'
                : 'bg-gray-200'
            }`}>
              <Truck size={20} className={
                status === 'in_progress' || status === 'completed'
                  ? 'text-white'
                  : 'text-gray-400'
              } />
            </div>
            <span className={`text-xs mt-2 ${
              status === 'in_progress' ? 'text-purple-600' : 'text-gray-500'
            }`}>
              배달 중
            </span>
          </div>

          {/* 배달 완료 */}
          <div className="flex flex-col items-center flex-1 z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              status === 'completed'
                ? 'bg-green-600'
                : 'bg-gray-200'
            }`}>
              <CheckCircle size={20} className={
                status === 'completed'
                  ? 'text-white'
                  : 'text-gray-400'
              } />
            </div>
            <span className={`text-xs mt-2 ${
              status === 'completed' ? 'text-green-600' : 'text-gray-500'
            }`}>
              배달 완료
            </span>
          </div>

          {/* 연결선 */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-0">
            <div 
              className="h-full bg-purple-600 transition-all duration-500"
              style={{
                width: status === 'before' ? '0%' : status === 'in_progress' ? '50%' : '100%'
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-gray-900 mb-6">실시간 짐 현황</h2>

        {trackingItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <Package size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">현재 진행 중인 배달이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trackingItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-6 shadow-lg">
                {/* 상태 표시 */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1.5 rounded-full text-sm ${getStatusColor(item.status)}`}>
                    {item.type === 'storage' ? '짐 보관' : '짐 배달'}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-sm ${getStatusColor(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>

                {/* 상태바 - 배달만 표시 */}
                {item.type === 'delivery' && renderStatusBar(item.status)}

                {/* 실시간 지도 - 배달 중일 때만 */}
                {item.type === 'delivery' && item.status === 'in_progress' && item.destination && (
                  <div className="mb-4">
                    <LiveTrackingMap
                      startLocation={item.storeAddress}
                      endLocation={item.destination}
                      currentLocation={item.currentLocation || '이동 중'}
                    />
                  </div>
                )}

                {/* 이미지 */}
                <div className="mb-4 rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={item.imageUrl}
                    alt={item.storeName}
                    className="w-full h-40 object-cover"
                  />
                </div>

                {/* 정보 */}
                <div className="space-y-3">
                  {/* 픽업 장소 */}
                  <div className="flex gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg h-fit">
                      <MapPin size={18} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-600 text-sm">
                        {item.type === 'storage' ? '보관 장소' : '픽업 장소'}
                      </p>
                      <p className="text-gray-900">{item.storeName}</p>
                      <p className="text-gray-500 text-sm mt-0.5">{item.storeAddress}</p>
                    </div>
                  </div>

                  {/* 현재 위치 - 배달 중일 때만 */}
                  {item.status === 'in_progress' && item.currentLocation && (
                    <>
                      <div className="border-t border-gray-100"></div>
                      <div className="flex gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                          <Truck size={18} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-600 text-sm">현재 위치</p>
                          <p className="text-gray-900">{item.currentLocation}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 도착지 */}
                  {item.destination && (
                    <>
                      <div className="border-t border-gray-100"></div>
                      <div className="flex gap-3">
                        <div className="bg-green-100 p-2 rounded-lg h-fit">
                          <MapPin size={18} className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-600 text-sm">도착지</p>
                          <p className="text-gray-900">{item.destination}</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 예상 시간 / 완료 시간 */}
                  {(item.estimatedTime || item.completedTime) && (
                    <>
                      <div className="border-t border-gray-100"></div>
                      <div className="flex gap-3">
                        <div className="bg-gray-100 p-2 rounded-lg h-fit">
                          <Clock size={18} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-600 text-sm">
                            {item.status === 'completed' ? '완료 시간' : item.status === 'before' ? '예약 시간' : '예상 도착'}
                          </p>
                          <p className="text-gray-900">
                            {item.completedTime || `${item.estimatedTime} 후`}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* 기사 정보 - 배달 중이거나 완료일 때 */}
                  {item.driverName && (item.status === 'in_progress' || item.status === 'completed') && (
                    <>
                      <div className="border-t border-gray-100"></div>
                      <div className="flex gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                          <User size={18} className="text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-600 text-sm">배달 기사</p>
                          <p className="text-gray-900">{item.driverName}</p>
                          {item.driverPhone && item.status === 'in_progress' && (
                            <a 
                              href={`tel:${item.driverPhone}`}
                              className="text-purple-600 text-sm mt-1 inline-block hover:underline"
                            >
                              {item.driverPhone}
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* 배달 완료 사진 - 배달 완료 시 */}
                  {item.type === 'delivery' && item.status === 'completed' && item.deliveryPhotoUrl && (
                    <>
                      <div className="border-t border-gray-100"></div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Camera size={18} className="text-green-600" />
                          <p className="text-gray-600 text-sm">배달 완료 사진</p>
                        </div>
                        <div className="relative">
                          <ImageWithFallback
                            src={item.deliveryPhotoUrl}
                            alt="배달 완료 사진"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
                            <CheckCircle size={12} />
                            <span>배달 완료</span>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs mt-2">
                          배달원이 짐을 안전하게 전달한 후 촬영한 사진입니다
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* 액션 버튼 - 배달 중일 때만 */}
                {item.status === 'in_progress' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a
                      href={`tel:${item.driverPhone}`}
                      className="w-full py-3 rounded-2xl text-white bg-purple-600 hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <User size={20} />
                      <span>기사님께 전화하기</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
