import { Package } from 'lucide-react';
import { useEffect } from 'react';

interface LoadingPageProps {
  onComplete: () => void;
}

export function LoadingPage({ onComplete }: LoadingPageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center px-6">
      <div className="text-center">
        {/* 로고 아이콘 */}
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl">
            <Package className="text-indigo-600" size={48} strokeWidth={2.5} />
          </div>
          {/* 펄스 애니메이션 */}
          <div className="absolute inset-0 bg-white rounded-3xl animate-ping opacity-20"></div>
        </div>

        {/* 앱 이름 */}
        <h1 className="text-white mb-3">짐프리</h1>
        <p className="text-indigo-100 text-lg">안전하고 편리한 짐 관리</p>

        {/* 로딩 인디케이터 */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
