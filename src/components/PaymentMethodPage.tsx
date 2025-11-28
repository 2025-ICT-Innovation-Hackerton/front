import { CreditCard, Plus, Check, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethod {
  id: number;
  type: 'card';
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  isDefault: boolean;
}

interface PaymentMethodPageProps {
  onBack: () => void;
  onSelectCard: (card: PaymentMethod) => void;
  onAddCard: () => void;
}

export function PaymentMethodPage({ onBack, onSelectCard, onAddCard }: PaymentMethodPageProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      type: 'card',
      cardNumber: '**** **** **** 1234',
      cardName: '신한카드',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      cardNumber: '**** **** **** 5678',
      cardName: '국민카드',
      expiryDate: '06/26',
      isDefault: false
    }
  ]);

  const [selectedCardId, setSelectedCardId] = useState<number>(1);

  const handleSetDefault = (id: number) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    setSelectedCardId(id);
  };

  const handleDeleteCard = (id: number) => {
    if (paymentMethods.length === 1) {
      alert('최소 1개의 결제 수단이 필요합니다.');
      return;
    }
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  const handleConfirm = () => {
    const selectedCard = paymentMethods.find(card => card.id === selectedCardId);
    if (selectedCard) {
      onSelectCard(selectedCard);
    }
  };

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
          <h1 className="text-gray-900 flex-1">결제 수단 선택</h1>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto pb-32">
        {/* 카드 추가 버튼 */}
        <button
          onClick={onAddCard}
          className="w-full bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-all mb-6 border-2 border-dashed border-indigo-200 hover:border-indigo-400"
        >
          <div className="flex items-center justify-center gap-3 text-indigo-600">
            <Plus size={24} strokeWidth={2.5} />
            <span className="text-lg">새 카드 등록</span>
          </div>
        </button>

        {/* 카드 목록 */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white rounded-3xl p-6 shadow-md transition-all cursor-pointer relative ${
                selectedCardId === method.id
                  ? 'ring-2 ring-indigo-600 shadow-lg'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedCardId(method.id)}
            >
              {/* 선택 체크 */}
              {selectedCardId === method.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" strokeWidth={3} />
                </div>
              )}

              <div className="flex items-start gap-4">
                {/* 카드 아이콘 */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl">
                  <CreditCard size={32} className="text-white" />
                </div>

                {/* 카드 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-gray-900">{method.cardName}</h3>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                        기본
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">{method.cardNumber}</p>
                  <p className="text-gray-500 text-sm">유효기간: {method.expiryDate}</p>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                {!method.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(method.id);
                    }}
                    className="flex-1 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors text-sm"
                  >
                    기본 카드로 설정
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCard(method.id);
                  }}
                  className="py-2 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <button
          onClick={handleConfirm}
          className="w-full max-w-4xl mx-auto py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg active:scale-[0.98]"
        >
          이 카드로 결제하기
        </button>
      </div>
    </div>
  );
}
