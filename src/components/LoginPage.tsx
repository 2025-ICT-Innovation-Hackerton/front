import { Package, Mail, Lock, Eye, EyeOff, User, Truck } from 'lucide-react';
import { useState } from 'react';
import { JimfreeLogo } from './JimfreeLogo';

interface LoginPageProps {
  onLogin: (userType: 'customer' | 'partner' | 'driver') => void;
  onSignup: () => void;
}

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'customer' | 'partner' | 'driver'>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 간단한 로그인 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('userType', userType);
      onLogin(userType);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100/50 flex flex-col px-6 py-10">
      <div className="max-w-md mx-auto w-full flex flex-col h-full">
        {/* 헤더 */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
              <JimfreeLogo size={40} />
            </div>
          </div>
          <h1 className="text-gray-900 mb-2">짐프리에 오신 것을 환영합니다</h1>
          <p className="text-gray-600">로그인하고 서비스를 시작하세요</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="space-y-5 flex-1">
          {/* 사용자 타입 선택 */}
          <div>
            <label className="block text-gray-900 mb-3 ml-1">
              로그인 유형
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`py-4 px-3 rounded-2xl border-2 transition-all ${
                  userType === 'customer'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <User className="mx-auto mb-1" size={20} />
                <span className="text-xs block">고객</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('partner')}
                className={`py-4 px-3 rounded-2xl border-2 transition-all ${
                  userType === 'partner'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-lg'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                }`}
              >
                <Package className="mx-auto mb-1" size={20} />
                <span className="text-xs block">가맹점</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('driver')}
                className={`py-4 px-3 rounded-2xl border-2 transition-all ${
                  userType === 'driver'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <Truck className="mx-auto mb-1" size={20} />
                <span className="text-xs block">기사</span>
              </button>
            </div>
          </div>

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-gray-900 mb-2 ml-1">
              이메일
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-600 transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-gray-900 mb-2 ml-1">
              비밀번호
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
                className="w-full pl-12 pr-12 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-600 transition-colors text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* 비밀번호 찾기 */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-indigo-600 hover:text-indigo-700 transition-colors text-sm"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                로그인 중...
              </div>
            ) : (
              '로그인'
            )}
          </button>

          {/* 구분선 */}
          <div className="relative py-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-br from-indigo-50 to-purple-100/50 text-gray-500 text-sm">
                또는
              </span>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            onClick={onSignup}
            className="w-full py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-2xl hover:bg-indigo-50 active:scale-[0.98] transition-all"
          >
            계정 만들기
          </button>
        </form>

        {/* 푸터 */}
        <div className="text-center text-gray-500 text-sm mt-8 pb-6">
          <p>계속 진행하면 이용약관 및 개인정보처리방침에 동의합니다</p>
        </div>
      </div>
    </div>
  );
}
