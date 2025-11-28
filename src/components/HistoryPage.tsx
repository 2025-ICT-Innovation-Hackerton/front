import { Package, Truck, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { CalendarModal } from './CalendarModal';

interface HistoryItem {
  id: number;
  type: 'storage' | 'delivery';
  storeName: string;
  storeAddress: string;
  date: string;
  time: string;
  price: number;
  status: 'completed' | 'cancelled';
  imageUrl: string;
  deliveryPhotoUrl?: string;
  details?: {
    dropOffTime?: string;
    pickUpTime?: string;
    destination?: string;
    pickupScheduledTime?: string;
  };
}

interface HistoryPageProps {
  onItemClick?: (item: HistoryItem) => void;
}

export function HistoryPage({ onItemClick }: HistoryPageProps = {}) {
  const [filter, setFilter] = useState<'all' | 'storage' | 'delivery'>('all');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Mock 데이터
  const [historyItems] = useState<HistoryItem[]>([
    {
      id: 1,
      type: 'delivery',
      storeName: '편의점 GS25',
      storeAddress: '서울시 강남구 테헤란로 123',
      date: '2024.11.26',
      time: '14:30',
      price: 5000,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1641440616173-7241e6fe6be9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb252ZW5pZW5jZSUyMHN0b3JlfGVufDF8fHx8MTc2NDIyMzAzMnww&ixlib=rb-4.1.0&q=80&w=1080',
      deliveryPhotoUrl: 'https://images.unsplash.com/photo-1656543802898-41c8c46683a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYm9hcmQlMjBib3glMjBwYWNrYWdlfGVufDF8fHx8MTc2NDI4NzUxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      details: {
        destination: '서울시 서초구 서초대로 456',
        pickupScheduledTime: '오후 2시'
      }
    },
    {
      id: 2,
      type: 'storage',
      storeName: '게스트하우스 서울',
      storeAddress: '서울시 강남구 선릉로 789',
      date: '2024.11.25',
      time: '10:00',
      price: 8000,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1675409145919-277c0fc2aa7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWVzdGhvdXNlJTIwaG90ZWx8ZW58MXx8fHwxNzY0MjUyMDcwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      details: {
        dropOffTime: '2024.11.25 10:00',
        pickUpTime: '2024.11.25 18:00'
      }
    },
    {
      id: 3,
      type: 'delivery',
      storeName: '카페 투썸플레이스',
      storeAddress: '서울시 강남구 역삼동 456',
      date: '2024.11.24',
      time: '16:30',
      price: 7000,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1604552914267-90a8d81a4254?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZXxlbnwxfHx8fDE3NjQyNDEwODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      deliveryPhotoUrl: 'https://images.unsplash.com/photo-1760648311436-d18d39f499bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdWdnYWdlJTIwYmFnJTIwdHJhdmVsfGVufDF8fHx8MTc2NDI4NzUxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      details: {
        destination: '서울시 송파구 올림픽로 789',
        pickupScheduledTime: '오후 4시 30분'
      }
    },
    {
      id: 4,
      type: 'storage',
      storeName: 'CU 편의점',
      storeAddress: '서울시 강남구 강남대로 234',
      date: '2024.11.23',
      time: '12:00',
      price: 4500,
      status: 'cancelled',
      imageUrl: 'https://images.unsplash.com/photo-1636668150626-e5ddfcb5c3c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHN0b3JlJTIwc2hvcHxlbnwxfHx8fDE3NjQyNTIwNzB8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 5,
      type: 'delivery',
      storeName: '호텔 비즈니스',
      storeAddress: '서울시 강남구 논현동 567',
      date: '2024.11.22',
      time: '09:15',
      price: 6000,
      status: 'completed',
      imageUrl: 'https://images.unsplash.com/photo-1608022099316-02dbaebb4d7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGhvdGVsfGVufDF8fHx8MTc2NDIwNjg1NXww&ixlib=rb-4.1.0&q=80&w=1080',
      deliveryPhotoUrl: 'https://images.unsplash.com/photo-1545591841-4a97f1da8d1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBkb29yfGVufDF8fHx8MTc2NDI4NzUxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      details: {
        destination: '서울시 강남구 테헤란로 999',
        pickupScheduledTime: '오전 9시 15분'
      }
    }
  ]);

  const filteredItems = historyItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const totalSpent = filteredItems
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-gray-900 mb-4">사용 내역</h2>

        {/* 통계 카드 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 mb-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80">총 이용 금액</span>
            <button 
              onClick={() => setIsCalendarOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-95"
              title="달력으로 보기"
            >
              <Calendar size={20} className="text-white/80" />
            </button>
          </div>
          <p className="text-3xl mb-1">{totalSpent.toLocaleString()}원</p>
          <p className="text-white/80 text-sm">
            총 {filteredItems.filter(i => i.status === 'completed').length}건 완료
          </p>
        </div>

        {/* 필터 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full transition-all ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('storage')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              filter === 'storage'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Package size={16} />
            짐 보관
          </button>
          <button
            onClick={() => setFilter('delivery')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 ${
              filter === 'delivery'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Truck size={16} />
            짐 배달
          </button>
        </div>

        {/* 내역 리스트 */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <Clock size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">사용 내역이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl p-5 shadow-md hover:shadow-lg transition-shadow">
                {/* 상단: 타입과 상태 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'storage' ? 'bg-indigo-100' : 'bg-purple-100'
                    }`}>
                      {item.type === 'storage' ? (
                        <Package size={20} className="text-indigo-600" />
                      ) : (
                        <Truck size={20} className="text-purple-600" />
                      )}
                    </div>
                    <span className="text-gray-900">
                      {item.type === 'storage' ? '짐 보관' : '짐 배달'}
                    </span>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-sm ${
                    item.status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {item.status === 'completed' ? '완료' : '취소'}
                  </span>
                </div>

                <div className="flex gap-4">
                  {/* 이미지 */}
                  <div className="flex-shrink-0">
                    <ImageWithFallback
                      src={item.imageUrl}
                      alt={item.storeName}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 mb-1 truncate">{item.storeName}</h3>
                    <p className="text-gray-500 text-sm mb-2 truncate">{item.storeAddress}</p>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* 상세 정보 */}
                    {item.details && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        {item.details.destination && (
                          <div className="flex items-start gap-1.5 text-xs text-gray-500">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                            <span className="truncate">도착: {item.details.destination}</span>
                          </div>
                        )}
                        {item.details.dropOffTime && item.details.pickUpTime && (
                          <div className="flex items-start gap-1.5 text-xs text-gray-500 mt-1">
                            <Clock size={12} className="mt-0.5 flex-shrink-0" />
                            <span className="truncate">
                              {item.details.dropOffTime.split(' ')[1]} ~ {item.details.pickUpTime.split(' ')[1]}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 금액 */}
                  <div className="flex-shrink-0 text-right">
                    <p className={`${
                      item.status === 'completed'
                        ? item.type === 'storage' ? 'text-indigo-600' : 'text-purple-600'
                        : 'text-gray-400'
                    }`}>
                      {item.price.toLocaleString()}원
                    </p>
                  </div>
                </div>

                {/* 상세보기 버튼 */}
                <button
                  onClick={() => onItemClick?.(item)}
                  className="w-full mt-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center gap-2 text-gray-700 active:scale-[0.98]"
                >
                  <span>상세보기</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 달력 모달 */}
      <CalendarModal 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        historyItems={historyItems}
      />
    </div>
  );
}
