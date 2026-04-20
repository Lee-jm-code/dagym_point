import { useState, useEffect } from 'react';
import { Calendar, ShoppingBag, Save, CheckCircle } from 'lucide-react';
import type { PointPolicy as PointPolicyType } from '../../types/point';
import './PointPolicy.css';

const STORAGE_KEY = 'point_policy';

const initialPolicy: PointPolicyType = {
  expirationMonths: 12,
  minUsageAmount: 100,
  maxUsagePerTransaction: 0,
  usableProducts: {
    membership: true,
    lesson: true,
    locker: true,
    etc: false,
  },
};

const loadStoredPolicy = (): PointPolicyType => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load policy from localStorage:', e);
  }
  return initialPolicy;
};

const PointPolicy = () => {
  const [policy, setPolicy] = useState<PointPolicyType>(() => loadStoredPolicy());
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [expirationInput, setExpirationInput] = useState<string>(() => {
    const stored = loadStoredPolicy();
    return String(stored.expirationMonths);
  });
  const [expirationError, setExpirationError] = useState<string | null>(null);

  useEffect(() => {
    const storedPolicy = loadStoredPolicy();
    setPolicy(storedPolicy);
    setExpirationInput(String(storedPolicy.expirationMonths));
  }, []);

  const handleSave = () => {
    const numValue = parseInt(expirationInput) || 0;
    
    if (expirationInput === '' || numValue < 12) {
      setSaveError(true);
      setTimeout(() => setSaveError(false), 3000);
      return;
    }
    
    const policyToSave = {
      ...policy,
      expirationMonths: numValue
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(policyToSave));
    setPolicy(policyToSave);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExpirationChange = (value: string) => {
    setExpirationInput(value);
    
    const numValue = parseInt(value) || 0;
    
    if (value === '' || numValue < 12) {
      setExpirationError('12개월 이하는 적용할 수 없습니다.');
      return;
    }
    
    setExpirationError(null);
    setPolicy({
      ...policy,
      expirationMonths: numValue
    });
  };

  const handleQuickSelect = (months: number) => {
    setExpirationInput(String(months));
    setExpirationError(null);
    setPolicy({ ...policy, expirationMonths: months });
  };

  const updateUsableProducts = (key: keyof PointPolicyType['usableProducts'], value: boolean) => {
    setPolicy({
      ...policy,
      usableProducts: {
        ...policy.usableProducts,
        [key]: value,
      },
    });
  };

  return (
    <div className="point-policy">
      <div className="page-header">
        <h1 className="page-title">정책 설정</h1>
        <p className="page-description">
          포인트 유효기간 및 사용 제한 정책을 설정합니다.
        </p>
      </div>

      <div className="policy-grid">
        {/* 유효기간 설정 */}
        <div className="policy-card">
          <div className="card-header">
            <div className="card-icon">
              <Calendar size={24} />
            </div>
            <h3 className="card-title">포인트 유효기간</h3>
          </div>
          
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">유효기간 설정</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  className={`form-input ${expirationError ? 'error' : ''}`}
                  value={expirationInput}
                  onChange={e => handleExpirationChange(e.target.value)}
                  min={12}
                />
                <span className="input-suffix">개월</span>
              </div>
              <p className="form-hint">
                포인트 적립일 기준으로 유효기간이 적용됩니다.
              </p>
              {expirationError && (
                <p className="form-error">{expirationError}</p>
              )}
            </div>

            <div className="quick-select">
              <span className="quick-label">빠른 설정:</span>
              <button 
                className={`quick-btn ${policy.expirationMonths === 12 && !expirationError ? 'active' : ''}`}
                onClick={() => handleQuickSelect(12)}
              >
                12개월
              </button>
              <button 
                className={`quick-btn ${policy.expirationMonths === 18 && !expirationError ? 'active' : ''}`}
                onClick={() => handleQuickSelect(18)}
              >
                18개월
              </button>
              <button 
                className={`quick-btn ${policy.expirationMonths === 24 && !expirationError ? 'active' : ''}`}
                onClick={() => handleQuickSelect(24)}
              >
                24개월
              </button>
            </div>
          </div>
        </div>

        {/* 사용 제한 설정 */}
        <div className="policy-card">
          <div className="card-header">
            <div className="card-icon blue">
              <ShoppingBag size={24} />
            </div>
            <h3 className="card-title">사용 제한 설정</h3>
          </div>
          
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">최소 사용 포인트</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  className="form-input"
                  value={policy.minUsageAmount}
                  onChange={e => setPolicy({
                    ...policy,
                    minUsageAmount: parseInt(e.target.value) || 0
                  })}
                  min={0}
                />
                <span className="input-suffix">P</span>
              </div>
              <p className="form-hint">
                이 금액 이상 보유 시 포인트 사용이 가능합니다.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">1회 최대 사용 포인트</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  className="form-input"
                  value={policy.maxUsagePerTransaction}
                  onChange={e => setPolicy({
                    ...policy,
                    maxUsagePerTransaction: parseInt(e.target.value) || 0
                  })}
                  min={0}
                />
                <span className="input-suffix">P</span>
              </div>
              <p className="form-hint">
                0으로 설정 시 제한 없이 사용 가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 사용 가능 상품 */}
        <div className="policy-card full-width">
          <div className="card-header">
            <div className="card-icon green">
              <ShoppingBag size={24} />
            </div>
            <h3 className="card-title">사용 가능 상품</h3>
          </div>
          
          <div className="card-body">
            <p className="section-description">
              포인트를 사용할 수 있는 상품 유형을 선택합니다.
            </p>
            
            <div className="product-checkboxes">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={policy.usableProducts.membership}
                  onChange={e => updateUsableProducts('membership', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <span className="checkbox-label">회원권</span>
                  <span className="checkbox-desc">월/기간 회원권 구매 시 사용</span>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={policy.usableProducts.lesson}
                  onChange={e => updateUsableProducts('lesson', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <span className="checkbox-label">PT/레슨</span>
                  <span className="checkbox-desc">개인 트레이닝, 그룹 레슨 등</span>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={policy.usableProducts.locker}
                  onChange={e => updateUsableProducts('locker', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <span className="checkbox-label">락커/용품</span>
                  <span className="checkbox-desc">락커 대여, 운동용품 구매</span>
                </div>
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={policy.usableProducts.etc}
                  onChange={e => updateUsableProducts('etc', e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <div className="checkbox-content">
                  <span className="checkbox-label">기타</span>
                  <span className="checkbox-desc">음료, 식품, 기타 상품</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="save-section">
        <button className="btn-save" onClick={handleSave}>
          <Save size={18} />
          설정 저장
        </button>
      </div>

      {/* 성공 토스트 */}
      {isSaved && (
        <div className="toast success">
          <CheckCircle size={20} />
          <span>정책이 저장되었습니다.</span>
        </div>
      )}

      {/* 에러 토스트 */}
      {saveError && (
        <div className="toast error">
          <span>유효기간은 12개월 이하는 적용할 수 없습니다.</span>
        </div>
      )}
    </div>
  );
};

export default PointPolicy;

