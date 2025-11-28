import { ArrowLeft, Package, MapPin, Clock, CheckCircle, Phone } from 'lucide-react';

interface StorageCompleteDetailsPageProps {
  onBack: () => void;
  storeName: string;
  storeAddress: string;
  dropOffTime: string;
  pickUpTime: string;
  totalPrice: number;
}

export function StorageCompleteDetailsPage({ 
  onBack, 
  storeName, 
  storeAddress, 
  dropOffTime, 
  pickUpTime, 
  totalPrice 
}: StorageCompleteDetailsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col">
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
          <h1 className="text-gray-900 flex-1">
            짐 보관 완료
          </h1>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* 완료 아이콘 */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative bg-indigo-600 p-6 rounded-full shadow-xl mb-4">
            <CheckCircle size={56} className="text-white" />
          </div>
          <h2 className="text-gray-900 mb-1 text-center">
            가맹점에서 콜을 수락했습니다!
          </h2>
          <p className="text-gray-600 text-center">
            예약된 시간에 방문해 주세요
          </p>
        </div>

        {/* 보관 정보 카드 */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-4">
          <h3 className="text-gray-900 mb-4">보관 정보</h3>
          
          <div className="space-y-4">
            {/* 보관 장소 */}
            <div className="flex gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                <MapPin size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">보관 장소</p>
                <p className="text-gray-900">{storeName}</p>
                <p className="text-gray-500 text-sm mt-0.5">{storeAddress}</p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100"></div>

            {/* 맡길 시간 */}
            <div className="flex gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg h-fit">
                <Clock size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">맡길 시간</p>
                <p className="text-gray-900">{dropOffTime}</p>
              </div>
            </div>

            {/* 찾을 시간 */}
            <div className="flex gap-3">
              <div className="bg-purple-100 p-2 rounded-lg h-fit">
                <Clock size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">찾을 시간</p>
                <p className="text-gray-900">{pickUpTime}</p>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100"></div>

            {/* 결제 금액 */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">결제 금액</span>
              <span className="text-indigo-600">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-indigo-50 rounded-2xl p-4 mb-4">
          <div className="flex gap-3">
            <Package size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-gray-900 text-sm mb-1">보관 안내</p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• 예약된 시간에 맞춰 방문해 주세요</li>
                <li>• 신분증을 지참해 주세요</li>
                <li>• 귀중품은 보관하지 않는 것을 권장합니다</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 가맹점 연락처 (선택사항) */}
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Phone size={20} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm">문의사항이 있으신가요?</p>
              <p className="text-gray-900">가맹점으로 직접 연락하시거나</p>
              <p className="text-gray-900">고객센터 1544-0000</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="p-4 bg-white border-t border-gray-100">
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl text-white transition-all duration-300 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
