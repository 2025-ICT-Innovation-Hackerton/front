import { Package, MapPin, Phone, Mail, Clock, Settings, LogOut, ClipboardList, UserCircle, Star, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

type Page = 'partner-calls' | 'partner-history' | 'partner-profile';

interface PartnerProfilePageProps {
  onLogout: () => void;
  onNavigate: (page: Page) => void;
  currentTab: string;
}

export function PartnerProfilePage({ onLogout, onNavigate, currentTab }: PartnerProfilePageProps) {
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Mock 가맹점 정보
  const partnerInfo = {
    storeName: '강남역 짐보관소',
    ownerName: '김가맹',
    phone: '010-1234-5678',
    email: 'partner@jimpfree.com',
    address: '서울시 강남구 테헤란로 123, 1층',
    businessHours: '평일 09:00 - 22:00, 주말 10:00 - 20:00',
    rating: 4.8,
    reviewCount: 127,
    totalStorageCount: 342,
    monthlyEarnings: 1250000,
    storageCapacity: 50,
    currentStorage: 12,
    joinDate: '2023-05-15'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      <div className="p-6 pb-24 max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">내 정보</h2>
            <p className="text-gray-600">가맹점 정보 및 통계를 확인하세요</p>
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
          <div className="flex items-start gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
              <Package size={36} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-2xl mb-1">{partnerInfo.storeName}</h3>
              <p className="text-white/80">{partnerInfo.ownerName}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                  <Star size={14} className="text-yellow-300 fill-yellow-300" />
                  <span className="text-sm">{partnerInfo.rating}</span>
                </div>
                <span className="text-white/80 text-sm">({partnerInfo.reviewCount}개 리뷰)</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">이번 달 수익</p>
              <p className="text-xl text-white">{partnerInfo.monthlyEarnings.toLocaleString()}원</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-3">
              <p className="text-white/70 text-xs mb-1">총 보관 건수</p>
              <p className="text-xl text-white">{partnerInfo.totalStorageCount}건</p>
            </div>
          </div>
        </div>

        {/* 보관 현황 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-lg">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} />
            현재 보관 현황
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">보관 중</span>
              <span className="text-gray-900 text-lg">{partnerInfo.currentStorage}개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">총 수용 가능</span>
              <span className="text-gray-900 text-lg">{partnerInfo.storageCapacity}개</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full transition-all"
                style={{ width: `${(partnerInfo.currentStorage / partnerInfo.storageCapacity) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 text-center">
              {Math.round((partnerInfo.currentStorage / partnerInfo.storageCapacity) * 100)}% 사용 중
            </p>
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-lg">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <UserCircle size={20} />
            기본 정보
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <Phone size={20} className="text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-0.5">전화번호</p>
                <p className="text-gray-900">{partnerInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <Mail size={20} className="text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-0.5">이메일</p>
                <p className="text-gray-900">{partnerInfo.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <MapPin size={20} className="text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-0.5">가맹점 주소</p>
                <p className="text-gray-900">{partnerInfo.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
              <Clock size={20} className="text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-0.5">운영 시간</p>
                <p className="text-gray-900">{partnerInfo.businessHours}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-0.5">가입일</p>
                <p className="text-gray-900">{partnerInfo.joinDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-lg">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            월간 통계
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4">
              <p className="text-sm text-indigo-600 mb-1">이번 달 보관</p>
              <p className="text-2xl text-indigo-900">24건</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
              <p className="text-sm text-purple-600 mb-1">평균 단가</p>
              <p className="text-2xl text-purple-900">8,500원</p>
            </div>
          </div>
        </div>

        {/* 정보 수정 버튼 */}
        <button className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg">
          가맹점 정보 수정
        </button>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-50">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => onNavigate('partner-calls')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'calls'
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Package size={24} strokeWidth={currentTab === 'calls' ? 2.5 : 2} />
              <span className="text-xs">콜 목록</span>
            </button>

            <button
              onClick={() => onNavigate('partner-history')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'history'
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <ClipboardList size={24} strokeWidth={currentTab === 'history' ? 2.5 : 2} />
              <span className="text-xs">보관 내역</span>
            </button>

            <button
              onClick={() => onNavigate('partner-profile')}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${
                currentTab === 'profile'
                  ? 'text-indigo-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <UserCircle size={24} strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
              <span className="text-xs">내 정보</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
