import { User, Bell, Shield, CreditCard, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  onManageCards: () => void;
}

export function SettingsPage({ onBack, onManageCards }: SettingsPageProps) {
  const settingsSections = [
    {
      title: '계정',
      items: [
        { icon: User, label: '프로필 정보', value: '홍길동' },
        { icon: Shield, label: '개인정보 보호', value: '' },
      ]
    },
    {
      title: '알림',
      items: [
        { icon: Bell, label: '푸시 알림', value: '켜짐' },
      ]
    },
    {
      title: '결제',
      items: [
        { icon: CreditCard, label: '결제 수단 관리', value: '', onClick: onManageCards },
      ]
    },
    {
      title: '지원',
      items: [
        { icon: HelpCircle, label: '고객 센터', value: '' },
        { icon: HelpCircle, label: '서비스 이용약관', value: '' },
        { icon: HelpCircle, label: '개인정보 처리방침', value: '' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
        
        body {
          font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
        }
      `}</style>

      {/* 헤더 */}
      <header className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 -ml-2 active:scale-95 transition-transform">
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-gray-900 flex-1">환경설정</h1>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto pb-24">
        {/* 프로필 카드 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 mb-6 shadow-lg text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <p className="text-xl mb-1">홍길동</p>
              <p className="text-white/80 text-sm">hong@example.com</p>
            </div>
          </div>
        </div>

        {/* 설정 섹션들 */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-gray-900 mb-3 px-2">{section.title}</h3>
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <item.icon size={20} className="text-gray-600" />
                      </div>
                      <span className="text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-gray-500 text-sm">{item.value}</span>
                      )}
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 앱 정보 */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">짐프리 v1.0.0</p>
          <p className="text-gray-400 text-xs mt-1">© 2024 짐프리. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
