import { ArrowLeft, CreditCard, Calendar, Lock, User } from 'lucide-react';
import { useState } from 'react';

interface AddCardPageProps {
  onBack: () => void;
  onComplete: (cardData: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
  }) => void;
}

export function AddCardPage({ onBack, onComplete }: AddCardPageProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value);
      if (errors.cardNumber) {
        setErrors(prev => ({ ...prev, cardNumber: '' }));
      }
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(value);
      if (errors.expiryDate) {
        setErrors(prev => ({ ...prev, expiryDate: '' }));
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCvv(value);
      if (errors.cvv) {
        setErrors(prev => ({ ...prev, cvv: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (cardNumber.length !== 16) {
      newErrors.cardNumber = '카드 번호 16자리를 입력해주세요';
    }
    if (!cardName.trim()) {
      newErrors.cardName = '카드사를 선택해주세요';
    }
    if (expiryDate.length !== 4) {
      newErrors.expiryDate = '유효기간을 입력해주세요 (MM/YY)';
    }
    if (cvv.length !== 3) {
      newErrors.cvv = 'CVV 3자리를 입력해주세요';
    }
    if (!cardHolder.trim()) {
      newErrors.cardHolder = '카드 소유자 이름을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onComplete({
        cardNumber: formatCardNumber(cardNumber),
        cardName,
        expiryDate: formatExpiryDate(expiryDate),
        cvv,
        cardHolder
      });
    }
  };

  const cardCompanies = [
    '신한카드', '국민카드', '현대카드', '삼성카드', 
    '롯데카드', '하나카드', 'NH농협카드', 'BC카드'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
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
          <h1 className="text-gray-900 flex-1">카드 등록</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto pb-32">
        {/* 카드 미리보기 */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-6 mb-8 shadow-2xl text-white min-h-[200px] flex flex-col justify-between">
          <div className="flex justify-between items-start mb-8">
            <CreditCard size={40} className="text-white/80" />
            <div className="text-right">
              <p className="text-white/60 text-xs">짐프리 카드</p>
            </div>
          </div>
          <div>
            <p className="text-xl tracking-wider mb-4">
              {formatCardNumber(cardNumber) || '**** **** **** ****'}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-xs mb-1">카드 소유자</p>
                <p className="text-sm">{cardHolder || '이름'}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-xs mb-1">유효기간</p>
                <p className="text-sm">{formatExpiryDate(expiryDate) || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 폼 필드들 */}
        <div className="space-y-5">
          {/* 카드사 선택 */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm">카드사</label>
            <select
              value={cardName}
              onChange={(e) => {
                setCardName(e.target.value);
                if (errors.cardName) {
                  setErrors(prev => ({ ...prev, cardName: '' }));
                }
              }}
              className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.cardName ? 'border-red-300' : 'border-gray-200'
              }`}
            >
              <option value="">카드사를 선택하세요</option>
              {cardCompanies.map((company) => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
            {errors.cardName && (
              <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>
            )}
          </div>

          {/* 카드 번호 */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm">카드 번호</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formatCardNumber(cardNumber)}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.cardNumber ? 'border-red-300' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* 유효기간과 CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2 text-sm">유효기간</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={formatExpiryDate(expiryDate)}
                  onChange={handleExpiryDateChange}
                  placeholder="MM/YY"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.expiryDate ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.expiryDate && (
                <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm">CVV</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={3}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    errors.cvv ? 'border-red-300' : 'border-gray-200'
                  }`}
                />
              </div>
              {errors.cvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* 카드 소유자 */}
          <div>
            <label className="block text-gray-700 mb-2 text-sm">카드 소유자</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => {
                  setCardHolder(e.target.value);
                  if (errors.cardHolder) {
                    setErrors(prev => ({ ...prev, cardHolder: '' }));
                  }
                }}
                placeholder="홍길동"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.cardHolder ? 'border-red-300' : 'border-gray-200'
                }`}
              />
            </div>
            {errors.cardHolder && (
              <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
            )}
          </div>

          {/* 안내 문구 */}
          <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
            <p className="text-indigo-900 text-sm mb-1">안전한 결제</p>
            <p className="text-indigo-600 text-xs">
              카드 정보는 암호화되어 안전하게 보관됩니다.
            </p>
          </div>
        </div>
      </form>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full max-w-4xl mx-auto py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg active:scale-[0.98]"
        >
          카드 등록하기
        </button>
      </div>
    </div>
  );
}
