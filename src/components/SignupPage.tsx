import { Package, Mail, Lock, User, Phone, Eye, EyeOff, ArrowLeft, Truck, Camera, CheckCircle, Upload, CreditCard, Calendar, IdCard, Building } from 'lucide-react';
import { useState } from 'react';
import { JimfreeLogo } from './JimfreeLogo';

interface SignupPageProps {
  onSignup: (userType: 'customer' | 'admin' | 'driver') => void;
  onBack: () => void;
}

type UserType = 'customer' | 'admin' | 'driver';
type SignupStep = 'user-type' | 'basic-info' | 'driver-verification' | 'driver-vehicle' | 'driver-account';

export function SignupPage({ onSignup, onBack }: SignupPageProps) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('user-type');
  const [userType, setUserType] = useState<UserType>('customer');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
  });

  // 배달기사 전용 정보
  const [driverData, setDriverData] = useState({
    idType: 'license', // 'license' | 'id-card'
    idPhoto: null as string | null,
    facePhoto: null as string | null,
    vehicleType: 'motorcycle', // 'walk' | 'bicycle' | 'motorcycle' | 'car'
    vehicleNumber: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  });

  const [verificationStatus, setVerificationStatus] = useState({
    phoneVerified: false,
    idVerified: false,
    faceVerified: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDriverDataChange = (field: string, value: string) => {
    setDriverData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'face') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'id') {
          setDriverData(prev => ({ ...prev, idPhoto: reader.result as string }));
          // 시뮬레이션: 검수 중
          setTimeout(() => {
            setVerificationStatus(prev => ({ ...prev, idVerified: true }));
          }, 1500);
        } else {
          setDriverData(prev => ({ ...prev, facePhoto: reader.result as string }));
          // 시뮬레이션: 얼굴 인증 완료
          setTimeout(() => {
            setVerificationStatus(prev => ({ ...prev, faceVerified: true }));
          }, 1500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneVerification = () => {
    // 휴대폰 인증 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, phoneVerified: true }));
      setIsLoading(false);
      alert('휴대폰 인증이 완료되었습니다.');
    }, 1500);
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
    setCurrentStep('basic-info');
  };

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다');
      return;
    }

    if (!agreed) {
      alert('이용약관에 동의해주세요');
      return;
    }

    // 배달기사면 추가 정보 입력으로, 아니면 바로 완료
    if (userType === 'driver') {
      setCurrentStep('driver-verification');
    } else {
      completeSignup();
    }
  };

  const handleDriverVerificationNext = () => {
    if (!verificationStatus.phoneVerified) {
      alert('휴대폰 인증을 완료해주세요');
      return;
    }
    if (!verificationStatus.idVerified) {
      alert('신분증 인증을 완료해주세요');
      return;
    }
    if (!verificationStatus.faceVerified) {
      alert('얼굴 인증을 완료해주세요');
      return;
    }
    setCurrentStep('driver-vehicle');
  };

  const handleDriverVehicleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('driver-account');
  };

  const handleDriverAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeSignup();
  };

  const completeSignup = () => {
    setIsLoading(true);
    
    // 회원가입 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      onSignup(userType);
    }, 1500);
  };

  // 사용자 유형 선택 화면
  if (currentStep === 'user-type') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100/50 flex flex-col px-6 py-6">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&family=Rounded+Mplus+1c:wght@400;500;700;800&display=swap');
          
          body {
            font-family: 'Rounded Mplus 1c', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, sans-serif;
          }
        `}</style>

        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ArrowLeft className="text-gray-700" size={20} />
            </button>
            <h2 className="text-gray-900 ml-4">회원가입</h2>
          </div>

          {/* 로고 */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-xl">
                <JimfreeLogo size={40} />
              </div>
            </div>
            <h3 className="text-gray-900 mb-2">가입 유형을 선택해주세요</h3>
            <p className="text-gray-600">어떤 서비스를 이용하시나요?</p>
          </div>

          {/* 유형 선택 */}
          <div className="space-y-4 flex-1">
            <button
              onClick={() => handleUserTypeSelect('customer')}
              className="w-full p-6 bg-white border-2 border-indigo-200 rounded-3xl hover:border-indigo-400 hover:shadow-lg active:scale-[0.98] transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User size={32} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">일반 고객</h3>
                  <p className="text-gray-600 text-sm">짐 보관 및 배달 서비스를 이용합니다</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleUserTypeSelect('partner')}
              className="w-full p-6 bg-white border-2 border-purple-200 rounded-3xl hover:border-purple-400 hover:shadow-lg active:scale-[0.98] transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Package size={32} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">가맹점</h3>
                  <p className="text-gray-600 text-sm">짐 보관 및 배달 보관 서비스를 제공합니다</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleUserTypeSelect('driver')}
              className="w-full p-6 bg-white border-2 border-green-200 rounded-3xl hover:border-green-400 hover:shadow-lg active:scale-[0.98] transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Truck size={32} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">배달 기사</h3>
                  <p className="text-gray-600 text-sm">짐을 픽업하고 배달하는 기사로 등록합니다</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 기본 정보 입력 화면
  if (currentStep === 'basic-info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100/50 flex flex-col px-6 py-6">
        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('user-type')}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ArrowLeft className="text-gray-700" size={20} />
            </button>
            <h2 className="text-gray-900 ml-4">기본 정보</h2>
          </div>

          {/* 진행 표시 */}
          {userType === 'driver' && (
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">1/4 단계</p>
            </div>
          )}

          {/* 회원가입 폼 */}
          <form onSubmit={handleBasicInfoSubmit} className="space-y-4 flex-1 overflow-y-auto">
            {/* 이름 */}
            <div>
              <label className="block text-gray-900 mb-2 ml-1 text-sm">
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="홍길동"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-gray-900 mb-2 ml-1 text-sm">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* 휴대폰 번호 */}
            <div>
              <label className="block text-gray-900 mb-2 ml-1 text-sm">
                휴대폰 번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="010-0000-0000"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            {userType === 'driver' && (
              <>
                {/* 생년월일 */}
                <div>
                  <label className="block text-gray-900 mb-2 ml-1 text-sm">
                    생년월일 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar size={20} />
                    </div>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleChange('birthDate', e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900"
                    />
                  </div>
                </div>

                {/* 주소 */}
                <div>
                  <label className="block text-gray-900 mb-2 ml-1 text-sm">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="서울시 강남구 테헤란로 123"
                    required
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
                  />
                </div>

                {/* 긴급 연락처 */}
                <div>
                  <label className="block text-gray-900 mb-2 ml-1 text-sm">
                    긴급 연락처 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={20} />
                    </div>
                    <input
                      type="tel"
                      value={formData.emergencyContact}
                      onChange={(e) => handleChange('emergencyContact', e.target.value)}
                      placeholder="010-0000-0000"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </>
            )}

            {/* 비밀번호 */}
            <div>
              <label className="block text-gray-900 mb-2 ml-1 text-sm">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="8자 이상 입력하세요"
                  required
                  minLength={8}
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
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

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-gray-900 mb-2 ml-1 text-sm">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-lg peer-checked:bg-purple-600 peer-checked:border-purple-600 transition-all flex items-center justify-center">
                    {agreed && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-700 flex-1">
                  <span className="text-red-500">[필수]</span> 이용약관 및 개인정보처리방침에 동의합니다
                </div>
              </label>
            </div>

            {/* 다음 버튼 */}
            <div className="pt-4 pb-6 sticky bottom-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {userType === 'driver' ? '다음 단계' : '회원가입 완료'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 배달기사 인증 화면
  if (currentStep === 'driver-verification') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100/50 flex flex-col px-6 py-6">
        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('basic-info')}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ArrowLeft className="text-gray-700" size={20} />
            </button>
            <h2 className="text-gray-900 ml-4">본인 인증</h2>
          </div>

          {/* 진행 표시 */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">2/4 단계</p>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto">
            {/* 휴대폰 인증 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">휴대폰 본인인증</h3>
                {verificationStatus.phoneVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={20} />
                    <span className="text-sm">인증완료</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {formData.phone}
              </p>
              <button
                type="button"
                onClick={handlePhoneVerification}
                disabled={verificationStatus.phoneVerified || isLoading}
                className={`w-full py-3 rounded-xl transition-all ${
                  verificationStatus.phoneVerified
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                }`}
              >
                {verificationStatus.phoneVerified ? '인증 완료' : '인증번호 받기'}
              </button>
            </div>

            {/* 신분증 인증 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">신분증 인증</h3>
                {verificationStatus.idVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={20} />
                    <span className="text-sm">인증완료</span>
                  </div>
                )}
              </div>

              {/* 신분증 종류 선택 */}
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleDriverDataChange('idType', 'license')}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    driverData.idType === 'license'
                      ? 'bg-purple-100 border-purple-600 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  운전면허증
                </button>
                <button
                  type="button"
                  onClick={() => handleDriverDataChange('idType', 'id-card')}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                    driverData.idType === 'id-card'
                      ? 'bg-purple-100 border-purple-600 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  주민등록증
                </button>
              </div>

              {/* 사진 업로드 */}
              {driverData.idPhoto ? (
                <div className="relative rounded-2xl overflow-hidden mb-3">
                  <img src={driverData.idPhoto} alt="신분증" className="w-full h-48 object-cover" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <CheckCircle size={14} />
                    <span>검수중...</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-3">
                  <IdCard size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-4">
                    {driverData.idType === 'license' ? '운전면허증' : '주민등록증'} 사진을 촬영해주세요
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleFileUpload(e, 'id')}
                    className="hidden"
                    id="id-photo"
                  />
                  <label
                    htmlFor="id-photo"
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl cursor-pointer hover:bg-purple-700 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Camera size={20} />
                      <span>사진 촬영</span>
                    </div>
                  </label>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                ⓘ 신분증 정보는 안전하게 암호화되어 저장되며, 본인 확인 용도로만 사용됩니다.
              </p>
            </div>

            {/* 얼굴 인증 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">얼굴 인증</h3>
                {verificationStatus.faceVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={20} />
                    <span className="text-sm">인증완료</span>
                  </div>
                )}
              </div>

              {driverData.facePhoto ? (
                <div className="relative rounded-2xl overflow-hidden mb-3">
                  <img src={driverData.facePhoto} alt="얼굴" className="w-full h-48 object-cover" />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <CheckCircle size={14} />
                    <span>인증완료</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-3">
                  <User size={48} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm mb-4">
                    신분증과 대조할 얼굴 사진을 촬영해주세요
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleFileUpload(e, 'face')}
                    className="hidden"
                    id="face-photo"
                  />
                  <label
                    htmlFor="face-photo"
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl cursor-pointer hover:bg-purple-700 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Camera size={20} />
                      <span>셀카 촬영</span>
                    </div>
                  </label>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                ⓘ 신분증 사진과 얼굴이 일치하는지 확인합니다.
              </p>
            </div>
          </div>

          {/* 다음 버튼 */}
          <div className="pt-6 pb-6 sticky bottom-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <button
              type="button"
              onClick={handleDriverVerificationNext}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 active:scale-[0.98] transition-all shadow-lg"
            >
              다음 단계
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 배달기사 차량 정보 입력 화면
  if (currentStep === 'driver-vehicle') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100/50 flex flex-col px-6 py-6">
        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('driver-verification')}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ArrowLeft className="text-gray-700" size={20} />
            </button>
            <h2 className="text-gray-900 ml-4">배달 수단</h2>
          </div>

          {/* 진행 표시 */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">3/4 단계</p>
          </div>

          <form onSubmit={handleDriverVehicleNext} className="space-y-6 flex-1 overflow-y-auto">
            {/* 차량 유형 선택 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
              <h3 className="text-gray-900 mb-4">배달 수단을 선택해주세요</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDriverDataChange('vehicleType', 'walk')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    driverData.vehicleType === 'walk'
                      ? 'bg-purple-100 border-purple-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User size={40} className={`mx-auto mb-2 ${driverData.vehicleType === 'walk' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <p className={`text-sm ${driverData.vehicleType === 'walk' ? 'text-purple-700' : 'text-gray-600'}`}>도보</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDriverDataChange('vehicleType', 'car')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    driverData.vehicleType === 'car'
                      ? 'bg-purple-100 border-purple-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-4xl mx-auto mb-2`}>🚗</div>
                  <p className={`text-sm ${driverData.vehicleType === 'car' ? 'text-purple-700' : 'text-gray-600'}`}>자동차</p>
                </button>
              </div>
            </div>

            {/* 차량 번호 (자동차인 경우) */}
            {driverData.vehicleType === 'car' && (
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-200">
                <h3 className="text-gray-900 mb-4">차량 번호</h3>
                <input
                  type="text"
                  value={driverData.vehicleNumber}
                  onChange={(e) => handleDriverDataChange('vehicleNumber', e.target.value)}
                  placeholder="12가 3456"
                  required
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400 text-center text-xl"
                />
              </div>
            )}
          </form>

          {/* 다음 버튼 */}
          <div className="pt-6 pb-6 sticky bottom-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <button
              type="button"
              onClick={handleDriverVehicleNext}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-2xl hover:from-purple-700 hover:to-purple-800 active:scale-[0.98] transition-all shadow-lg"
            >
              다음 단계
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 배달기사 계좌 정보 입력 화면
  if (currentStep === 'driver-account') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100/50 flex flex-col px-6 py-6">
        <div className="max-w-md mx-auto w-full flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => setCurrentStep('driver-vehicle')}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ArrowLeft className="text-gray-700" size={20} />
            </button>
            <h2 className="text-gray-900 ml-4">정산 계좌</h2>
          </div>

          {/* 진행 표시 */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
              <div className="flex-1 h-2 bg-purple-600 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">4/4 단계 - 거의 다 왔어요!</p>
          </div>

          <form onSubmit={handleDriverAccountSubmit} className="space-y-6 flex-1 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 space-y-5">
              <div>
                <h3 className="text-gray-900 mb-2">정산 계좌 정보</h3>
                <p className="text-gray-600 text-sm mb-6">배달 수익을 받을 계좌 정보를 입력해주세요</p>
              </div>

              {/* 은행 선택 */}
              <div>
                <label className="block text-gray-900 mb-2 text-sm">
                  은행 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Building size={20} />
                  </div>
                  <select
                    value={driverData.bankName}
                    onChange={(e) => handleDriverDataChange('bankName', e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 appearance-none"
                  >
                    <option value="">은행을 선택하세요</option>
                    <option value="신한은행">신한은행</option>
                    <option value="국민은행">국민은행</option>
                    <option value="하나은행">하나은행</option>
                    <option value="우리은행">우리은행</option>
                    <option value="NH농협은행">NH농협은행</option>
                    <option value="카카오뱅크">카카오뱅크</option>
                    <option value="토스뱅크">토스뱅크</option>
                    <option value="케이뱅크">케이뱅크</option>
                  </select>
                </div>
              </div>

              {/* 계좌번호 */}
              <div>
                <label className="block text-gray-900 mb-2 text-sm">
                  계좌번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <CreditCard size={20} />
                  </div>
                  <input
                    type="text"
                    value={driverData.accountNumber}
                    onChange={(e) => handleDriverDataChange('accountNumber', e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="'-' 없이 숫자만 입력"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* 예금주 */}
              <div>
                <label className="block text-gray-900 mb-2 text-sm">
                  예금주 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    value={driverData.accountHolder}
                    onChange={(e) => handleDriverDataChange('accountHolder', e.target.value)}
                    placeholder="예금주명"
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-600 transition-colors text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  ⓘ 예금주는 본인 명의여야 합니다 ({formData.name})
                </p>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-900">
                💡 <strong>안내:</strong> 정산은 매주 월요일에 진행되며, 수수료를 제외한 금액이 입금됩니다.
              </p>
            </div>
          </form>

          {/* 완료 버튼 */}
          <div className="pt-6 pb-6 sticky bottom-0 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <button
              type="button"
              onClick={handleDriverAccountSubmit}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl hover:from-green-700 hover:to-emerald-700 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  가입 완료 중...
                </div>
              ) : (
                '회원가입 완료'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
