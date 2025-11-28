import { User, Phone, Calendar, MapPin, Car, CreditCard, CheckCircle, Settings, LogOut, List, Clock, Truck, DollarSign, Award } from 'lucide-react';
import { useState } from 'react';

interface DriverProfilePageProps {
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentTab: 'calls' | 'history' | 'profile';
}

export function DriverProfilePage({ onLogout, onNavigate, currentTab }: DriverProfilePageProps) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Mock 데이터
  const driverInfo = {
    name: '김배달',
    phone: '010-1234-5678',
    email: 'driver@jimfree.com',
    birthDate: '1990-05-15',
    address: '서울시 강남구 테헤란로 123',
    vehicleType: '자동차',
    vehicleNumber: '12가 3456',
    bankName: '신한은행',
    accountNumber: '110-123-456789',
    accountHolder: '김배달',
    joinDate: '2024-01-15',
    verificationStatus: {
      phone: true,
      id: true,
      face: true
    },
    stats: {
      totalDeliveries: 156,
      totalEarnings: 2340000,
      rating: 4.8,
      completionRate: 98.7
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="p-6 max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">내 정보</h2>
            <p className="text-gray-600">프로필 및 활동 정보</p>
          </div>
          
          {/* 설정 및 로그아웃 */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <Settings size={20} className="text-gray-700" />
            </button>
            
            {showSettingsMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowSettingsMenu(false)}
                ></div>
                <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[160px]">
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      // 설정 페이지로 이동
                    }}
                    className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors text-left"
                  >
                    <Settings size={18} />
                    <span>환경설정</span>
                  </button>
                  <div className="h-px bg-gray-200"></div>
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      onLogout();
                    }}
                    className="w-full px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors text-left"
                  >
                    <LogOut size={18} />
                    <span>로그아웃</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 프로필 카드 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 mb-6 shadow-xl text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white mb-1">{driverInfo.name}</h3>
              <p className="text-white/80 text-sm">{driverInfo.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg text-xs">
                  <CheckCircle size={14} />
                  <span>인증 완료</span>
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg text-xs">
                  <Award size={14} />
                  <span>⭐ {driverInfo.stats.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 활동 통계 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <Truck size={20} />
              <span className="text-sm">완료 건수</span>
            </div>
            <p className="text-2xl text-gray-900">{driverInfo.stats.totalDeliveries}건</p>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <DollarSign size={20} />
              <span className="text-sm">누적 수익</span>
            </div>
            <p className="text-2xl text-gray-900">{(driverInfo.stats.totalEarnings / 10000).toFixed(0)}만원</p>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-lg">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <User size={20} />
            기본 정보
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">이름</span>
              <span className="text-gray-900">{driverInfo.name}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">휴대폰</span>
              <span className="text-gray-900">{driverInfo.phone}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">이메일</span>
              <span className="text-gray-900">{driverInfo.email}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">생년월일</span>
              <span className="text-gray-900">{driverInfo.birthDate}</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 text-sm">주소</span>
              <span className="text-gray-900 text-right">{driverInfo.address}</span>
            </div>
          </div>
        </div>

        {/* 차량 정보 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-lg">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Car size={20} />
            배달 수단
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">수단</span>
              <span className="text-gray-900">{driverInfo.vehicleType}</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 text-sm">차량 번호</span>
              <span className="text-gray-900 text-xl tracking-wider">{driverInfo.vehicleNumber}</span>
            </div>
          </div>
        </div>

        {/* 정산 계좌 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-lg">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard size={20} />
            정산 계좌
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">은행</span>
              <span className="text-gray-900">{driverInfo.bankName}</span>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600 text-sm">계좌번호</span>
              <span className="text-gray-900">{driverInfo.accountNumber}</span>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <span className="text-gray-600 text-sm">예금주</span>
              <span className="text-gray-900">{driverInfo.accountHolder}</span>
            </div>
          </div>
        </div>

        {/* 가입 정보 */}
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-gray-600 text-sm">
            가입일: {driverInfo.joinDate}
          </p>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => onNavigate('driver-calls')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'calls'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={24} />
              <span className="text-xs">콜 목록</span>
            </button>
            
            <button
              onClick={() => onNavigate('driver-history')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'history'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Clock size={24} />
              <span className="text-xs">배달 내역</span>
            </button>
            
            <button
              onClick={() => onNavigate('driver-profile')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'profile'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User size={24} />
              <span className="text-xs">내 정보</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
