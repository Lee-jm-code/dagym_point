import { useState, useEffect } from 'react';
import { Calendar, ShoppingBag, Save, CheckCircle, RefreshCw } from 'lucide-react';
import type { MembershipRefundMode, PointPolicy as PointPolicyType } from '../../types/point';
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
  membershipRefundMode: 'points_first',
  reclaimAutoGrantOnMembershipCancel: true,
};

const parseStoredMembershipRefundMode = (raw: unknown): MembershipRefundMode =>
  raw === 'cash_only' ? 'cash_only' : 'points_first';

const loadStoredPolicy = (): PointPolicyType => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...initialPolicy,
        ...parsed,
        usableProducts: {
          ...initialPolicy.usableProducts,
          ...(parsed.usableProducts || {}),
        },
        membershipRefundMode: parseStoredMembershipRefundMode(parsed.membershipRefundMode),
        reclaimAutoGrantOnMembershipCancel:
          typeof parsed.reclaimAutoGrantOnMembershipCancel === 'boolean'
            ? parsed.reclaimAutoGrantOnMembershipCancel
            : true,
      };
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
    
    const policyToSave: PointPolicyType = {
      ...policy,
      expirationMonths: numValue,
      membershipRefundMode: parseStoredMembershipRefundMode(policy.membershipRefundMode),
      reclaimAutoGrantOnMembershipCancel:
        typeof policy.reclaimAutoGrantOnMembershipCancel === 'boolean'
          ? policy.reclaimAutoGrantOnMembershipCancel
          : true,
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

  const setMembershipRefundMode = (mode: MembershipRefundMode) => {
    setPolicy({ ...policy, membershipRefundMode: mode });
  };

  return (
    <div className="point-policy">
      <div className="page-header">
        <h1 className="page-title">정책 설정</h1>
        <p className="page-description">
          포인트 유효기간, 사용 제한, 회원권 환불 시 포인트 정책을 설정합니다.
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

        {/* 회원권 환불·취소 시 포인트 정책 (사용 포인트 + 자동 지급 통합) */}
        <div className="policy-card full-width policy-card-refund-unified">
          <div className="card-header refund-unified-header">
            <div className="card-icon purple-muted">
              <RefreshCw size={24} />
            </div>
            <div className="refund-unified-header-text">
              <h3 className="card-title">회원권 환불·취소 시 포인트 정책</h3>
              <p className="card-subtitle">
                회원권을 배정할 때 <strong>포인트를 사용</strong>했거나 <strong>신규·재등록 자동 지급</strong>을 받은 경우,
                나중에 그 회원권을 환불하거나 상품을 삭제(결제취소)할 때 포인트를 어떻게 처리할지 한곳에서 설정합니다.
              </p>
            </div>
          </div>
          <div className="card-body refund-unified-body">
            <div className="refund-unified-lead">
              아래 두 항목은 동일한 환불·취소 건에 차례로 적용됩니다. (① 회원이 결제에 사용한 포인트 → ② 배정 시 자동으로 받은 포인트)
            </div>

            <div className="refund-unified-section">
              <div className="refund-unified-section-head">
                <span className="refund-unified-badge">① 사용 포인트</span>
                <span className="refund-unified-section-title">배정 시 상품 결제에 사용한 포인트</span>
              </div>
              <p className="refund-unified-section-desc">
                환불 시 그 포인트를 회원에게 되돌려줄지, 아니면 실제 카드·현금으로 낸 금액만 환불할지 선택합니다.
              </p>
              <div className="refund-mode-options">
                <label className="radio-item">
                  <input
                    type="radio"
                    name="membershipRefundMode"
                    checked={policy.membershipRefundMode === 'points_first'}
                    onChange={() => setMembershipRefundMode('points_first')}
                  />
                  <span className="radio-custom" />
                  <div className="radio-content">
                    <span className="radio-label">포인트 우선 환급 (부분 환불 금액과 연동)</span>
                    <span className="radio-desc">
                      사용 포인트를 우선 되돌리며, 입력한 환불 금액에 맞춰 부분 환불 시 되돌리는 포인트도 조정됩니다.
                    </span>
                  </div>
                </label>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="membershipRefundMode"
                    checked={policy.membershipRefundMode === 'cash_only'}
                    onChange={() => setMembershipRefundMode('cash_only')}
                  />
                  <span className="radio-custom" />
                  <div className="radio-content">
                    <span className="radio-label">실제 결제 금액만 환불 (사용 포인트는 환급 안 함)</span>
                    <span className="radio-desc">
                      사용 포인트는 되돌리지 않고, 판매금액에서 포인트를 뺀 실제 결제 금액 범위에서만 환불합니다.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="refund-unified-divider" aria-hidden />

            <div className="refund-unified-section">
              <div className="refund-unified-section-head">
                <span className="refund-unified-badge badge-amber">② 자동 지급 포인트</span>
                <span className="refund-unified-section-title">신규 등록·재등록 등 배정 시 자동 지급분</span>
              </div>
              <p className="refund-unified-section-desc">
                자동 지급 기능이 켜져 있어 배정과 함께 포인트가 들어온 경우, 환불·취소 때 그 지급분을 회수할지 정합니다.
              </p>
              <div className="policy-toggle-card">
                <div className="policy-toggle-labels">
                  <span className="policy-toggle-title">환불·결제취소 시 자동 지급 포인트 회수</span>
                  <span className="policy-toggle-summary">
                    {policy.reclaimAutoGrantOnMembershipCancel
                      ? '켜짐 — 해당 배정으로 받은 신규·재등록 자동 지급 포인트를 되찾습니다. (보유 한도까지만 차감, 마이너스 없음)'
                      : '꺼짐 — 자동 지급 포인트는 회수하지 않고 회원에게 유지합니다.'}
                  </span>
                </div>
                <button
                  type="button"
                  className={`policy-toggle-switch ${policy.reclaimAutoGrantOnMembershipCancel ? 'on' : ''}`}
                  role="switch"
                  aria-checked={policy.reclaimAutoGrantOnMembershipCancel}
                  onClick={() =>
                    setPolicy(prev => ({
                      ...prev,
                      reclaimAutoGrantOnMembershipCancel: !prev.reclaimAutoGrantOnMembershipCancel,
                    }))
                  }
                >
                  <span className="policy-toggle-knob" />
                </button>
              </div>
              <p className="refund-unified-reclaim-cap-hint">
                회수액이 당시 보유 포인트보다 크면 잔액이 음수가 되지 않으며, <strong>보유 범위에서만</strong> 차감됩니다.
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

