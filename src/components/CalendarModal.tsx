import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

interface HistoryItem {
  id: number;
  type: 'storage' | 'delivery';
  date: string;
  price: number;
  status: 'completed' | 'cancelled';
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: HistoryItem[];
}

export function CalendarModal({ isOpen, onClose, historyItems }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // 이번 달의 첫날과 마지막날
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // 달력 시작일 (이전 달 날짜 포함)
  const startDay = new Date(firstDay);
  startDay.setDate(startDay.getDate() - firstDay.getDay());

  // 달력 종료일 (다음 달 날짜 포함)
  const endDay = new Date(lastDay);
  endDay.setDate(endDay.getDate() + (6 - lastDay.getDay()));

  // 날짜별 이용 금액 계산
  const dateUsage = useMemo(() => {
    const usage: { [key: string]: { total: number; count: number; types: string[] } } = {};
    
    historyItems.forEach(item => {
      if (item.status === 'completed') {
        // date 형식: "2024.11.26" -> "2024-11-26"
        const dateKey = item.date.replace(/\./g, '-');
        if (!usage[dateKey]) {
          usage[dateKey] = { total: 0, count: 0, types: [] };
        }
        usage[dateKey].total += item.price;
        usage[dateKey].count += 1;
        usage[dateKey].types.push(item.type);
      }
    });
    
    return usage;
  }, [historyItems]);

  // 달력 날짜 생성
  const calendarDays = [];
  const current = new Date(startDay);
  
  while (current <= endDay) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
          
          body {
            font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}</style>

        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">이용 달력</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h3 className="text-gray-900">{year}년 {monthNames[month]}</h3>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* 달력 */}
        <div className="p-6">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day, index) => (
              <div 
                key={day} 
                className={`text-center text-sm py-2 ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              const dateKey = formatDateKey(date);
              const usage = dateUsage[dateKey];
              const hasUsage = !!usage;
              const isCurrent = isCurrentMonth(date);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={index}
                  className={`
                    aspect-square rounded-xl p-1 flex flex-col items-center justify-center
                    transition-all relative
                    ${!isCurrent ? 'opacity-30' : ''}
                    ${hasUsage && isCurrent 
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md' 
                      : isTodayDate 
                        ? 'bg-gray-100 border-2 border-indigo-300'
                        : 'hover:bg-gray-50'
                    }
                  `}
                >
                  <span className={`text-sm ${hasUsage ? 'mb-0.5' : ''} ${isTodayDate && !hasUsage ? 'text-indigo-600' : ''}`}>
                    {date.getDate()}
                  </span>
                  {hasUsage && isCurrent && (
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] leading-none opacity-90">
                        {usage.count}건
                      </span>
                      <span className="text-[9px] leading-none mt-0.5">
                        {usage.total >= 10000 
                          ? `${Math.floor(usage.total / 1000) / 10}만` 
                          : `${(usage.total / 1000).toFixed(0)}천`
                        }
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 범례 */}
          <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">💡 이용 내역이 있는 날짜</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500"></div>
                  <span>이용 건수와 총 금액이 표시됩니다</span>
                </div>
              </div>
            </div>
          </div>

          {/* 이번 달 통계 */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-4 bg-white border-2 border-indigo-100 rounded-2xl">
              <p className="text-gray-600 text-sm mb-1">총 이용 일수</p>
              <p className="text-indigo-600 text-xl">
                {Object.keys(dateUsage).filter(key => {
                  const date = new Date(key);
                  return date.getMonth() === month && date.getFullYear() === year;
                }).length}일
              </p>
            </div>
            <div className="p-4 bg-white border-2 border-purple-100 rounded-2xl">
              <p className="text-gray-600 text-sm mb-1">총 이용 금액</p>
              <p className="text-purple-600 text-xl">
                {Object.entries(dateUsage)
                  .filter(([key]) => {
                    const date = new Date(key);
                    return date.getMonth() === month && date.getFullYear() === year;
                  })
                  .reduce((sum, [, value]) => sum + value.total, 0)
                  .toLocaleString()}원
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
