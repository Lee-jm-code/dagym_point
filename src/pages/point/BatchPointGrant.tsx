import { useState } from 'react';
import { Users, Filter, Send, CheckCircle } from 'lucide-react';
import type { MemberFilter } from '../../types/point';
import './BatchPointGrant.css';

interface TargetMember {
  id: string;
  name: string;
  phone: string;
  membershipName: string;
  status: 'active' | 'expired';
  currentPoints: number;
}

const mockMembers: TargetMember[] = [
  { id: '1', name: '김철수', phone: '010-1234-5678', membershipName: '6개월 회원권', status: 'active', currentPoints: 3500 },
  { id: '2', name: '이영희', phone: '010-2345-6789', membershipName: '3개월 회원권', status: 'active', currentPoints: 2000 },
  { id: '3', name: '박민수', phone: '010-3456-7890', membershipName: '1년 회원권', status: 'active', currentPoints: 5000 },
  { id: '4', name: '최지은', phone: '010-4567-8901', membershipName: '1개월 회원권', status: 'active', currentPoints: 1000 },
  { id: '5', name: '정하늘', phone: '010-5678-9012', membershipName: '6개월 회원권', status: 'expired', currentPoints: 500 },
  { id: '6', name: '강서연', phone: '010-6789-0123', membershipName: 'PT 10회', status: 'active', currentPoints: 4500 },
  { id: '7', name: '윤도현', phone: '010-7890-1234', membershipName: '3개월 회원권', status: 'expired', currentPoints: 800 },
];

const BatchPointGrant = () => {
  const [pointAmount, setPointAmount] = useState<number>(1000);
  const [reason, setReason] = useState<string>('');
  const [filter, setFilter] = useState<MemberFilter>({
    gender: 'all',
    memberType: 'all',
    membershipStatus: 'all',
  });
  const [showPreview, setShowPreview] = useState(false);
  const [isGranted, setIsGranted] = useState(false);

  const filteredMembers = mockMembers.filter(member => {
    if (filter.membershipStatus !== 'all' && member.status !== filter.membershipStatus) {
      return false;
    }
    return true;
  });

  const handleGrant = () => {
    if (!pointAmount || !reason) {
      alert('지급 포인트와 지급 사유를 입력해주세요.');
      return;
    }
    setIsGranted(true);
    setTimeout(() => setIsGranted(false), 3000);
  };

  return (
    <div className="batch-point-grant">
      <div className="page-header">
        <h1 className="page-title">일괄 지급</h1>
        <p className="page-description">
          조건을 설정하여 여러 회원에게 포인트를 일괄 지급합니다.
        </p>
      </div>

      <div className="grant-container">
        {/* 왼쪽: 설정 영역 */}
        <div className="grant-settings">
          <div className="settings-card">
            <h3 className="card-title">
              <Send size={20} />
              지급 정보
            </h3>

            <div className="form-group">
              <label className="form-label">지급 포인트 *</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  className="form-input"
                  value={pointAmount}
                  onChange={e => setPointAmount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <span className="input-suffix">P</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">지급 사유 *</label>
              <textarea
                className="form-textarea"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="예: 신년 이벤트 포인트 지급"
                rows={3}
              />
            </div>
          </div>

          <div className="settings-card">
            <h3 className="card-title">
              <Filter size={20} />
              회원 필터 (선택)
            </h3>

            <div className="form-group">
              <label className="form-label">성별</label>
              <select 
                className="form-select"
                value={filter.gender}
                onChange={e => setFilter({ ...filter, gender: e.target.value as MemberFilter['gender'] })}
              >
                <option value="all">전체</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">회원 유형</label>
              <select 
                className="form-select"
                value={filter.memberType}
                onChange={e => setFilter({ ...filter, memberType: e.target.value as MemberFilter['memberType'] })}
              >
                <option value="all">전체</option>
                <option value="new">신규 회원</option>
                <option value="existing">기존 회원</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">회원 상태</label>
              <select 
                className="form-select"
                value={filter.membershipStatus}
                onChange={e => setFilter({ ...filter, membershipStatus: e.target.value as MemberFilter['membershipStatus'] })}
              >
                <option value="all">전체</option>
                <option value="active">유효 회원</option>
                <option value="expired">만료 회원</option>
              </select>
            </div>
          </div>

          <div className="target-summary">
            <div className="summary-icon">
              <Users size={24} />
            </div>
            <div className="summary-info">
              <span className="summary-label">대상 회원</span>
              <span className="summary-count">{filteredMembers.length}명</span>
            </div>
            <div className="summary-total">
              <span className="total-label">총 지급 예정</span>
              <span className="total-value">{(pointAmount * filteredMembers.length).toLocaleString()}P</span>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-preview"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? '미리보기 닫기' : '대상 미리보기'}
            </button>
            <button 
              className="btn-grant"
              onClick={handleGrant}
              disabled={!pointAmount || !reason}
            >
              <Send size={18} />
              포인트 지급하기
            </button>
          </div>
        </div>

        {/* 오른쪽: 미리보기 영역 */}
        {showPreview && (
          <div className="preview-panel">
            <div className="preview-header">
              <h3 className="preview-title">대상 회원 미리보기</h3>
              <span className="preview-count">{filteredMembers.length}명</span>
            </div>
            <div className="preview-list">
              {filteredMembers.map(member => (
                <div key={member.id} className="preview-item">
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-phone">{member.phone}</span>
                  </div>
                  <div className="member-meta">
                    <span className={`member-status ${member.status}`}>
                      {member.status === 'active' ? '유효' : '만료'}
                    </span>
                    <span className="member-points">현재 {member.currentPoints.toLocaleString()}P</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 성공 토스트 */}
      {isGranted && (
        <div className="toast success">
          <CheckCircle size={20} />
          <span>{filteredMembers.length}명에게 {pointAmount.toLocaleString()}P가 지급되었습니다.</span>
        </div>
      )}
    </div>
  );
};

export default BatchPointGrant;

