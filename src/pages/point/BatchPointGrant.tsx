import { useState } from 'react';
import { Search, ChevronDown, Send, CheckCircle, X, RotateCcw } from 'lucide-react';
import './BatchPointGrant.css';

interface TargetMember {
  id: string;
  name: string;
  phone: string;
  gender: '남' | '여';
  birthDate: string;
  status: '유효' | '만료' | '미입력';
  membership: string;
  expiryDate: string;
  remainingDays: string;
  remainingCount: string;
  currentPoints: number;
}

const mockMembers: TargetMember[] = [
  { id: '1', name: '상단확인용', phone: '010-****-5829', gender: '남', birthDate: '-', status: '미입력', membership: '-', expiryDate: '-', remainingDays: '-', remainingCount: '-', currentPoints: 0 },
  { id: '2', name: 'test', phone: '010-****-7749', gender: '남', birthDate: '-', status: '유효', membership: '(((((횟수제)))) 헬스 1개월', expiryDate: '2026.02.15', remainingDays: '29일', remainingCount: '-', currentPoints: 5000 },
  { id: '3', name: '제갈민주', phone: '010-****-9409', gender: '남', birthDate: '-', status: '유효', membership: '테스트100테스트 1회', expiryDate: '-', remainingDays: '-', remainingCount: '1회', currentPoints: 1500 },
  { id: '4', name: 'ㅅㄷㄴㅅ', phone: '010-****-7749', gender: '남', birthDate: '-', status: '유효', membership: '(((((기간제)))) 헬스 1개월', expiryDate: '2026.02.06', remainingDays: '20일', remainingCount: '-', currentPoints: 3000 },
  { id: '5', name: 'leejm', phone: '010-****-4191', gender: '남', birthDate: '-', status: '유효', membership: 'TEST1111123 1회', expiryDate: '2026.02.06', remainingDays: '20일', remainingCount: '1회', currentPoints: 10000 },
  { id: '6', name: '김철수', phone: '010-****-1234', gender: '남', birthDate: '1990.05.15', status: '유효', membership: '6개월 회원권', expiryDate: '2026.06.15', remainingDays: '150일', remainingCount: '-', currentPoints: 3500 },
  { id: '7', name: '이영희', phone: '010-****-2345', gender: '여', birthDate: '1995.08.20', status: '만료', membership: '3개월 회원권', expiryDate: '2025.12.20', remainingDays: '-', remainingCount: '-', currentPoints: 2000 },
];

const filterOptions = [
  '상태', '성별', '생일', '회원권', '등록 기간', '만료일', '락커', '운동복', '재등록 여부', '담당자', '홀딩'
];

const filterOptions2 = [
  '최초등록일', '잔여 일수', '잔여 횟수', '출석일', '미출석 기간', '출입정보'
];

const BatchPointGrant = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [pointAmount, setPointAmount] = useState<number>(1000);
  const [reason, setReason] = useState<string>('');
  const [isGranted, setIsGranted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showGrantForm, setShowGrantForm] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const handleFilterClick = (filter: string) => {
    setSelectedFilters(prev => {
      if (prev[filter]) {
        const newFilters = { ...prev };
        delete newFilters[filter];
        return newFilters;
      }
      return { ...prev, [filter]: 'selected' };
    });
  };

  const resetFilters = () => {
    setSelectedFilters({});
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  // 검색 필터링
  const filteredMembers = mockMembers.filter(member => {
    if (searchQuery) {
      return member.name.includes(searchQuery) || member.phone.includes(searchQuery);
    }
    return true;
  });

  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(filteredMembers.map(m => m.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers([...selectedMembers, id]);
    } else {
      setSelectedMembers(selectedMembers.filter(m => m !== id));
    }
  };

  const handleGrant = () => {
    if (selectedMembers.length === 0) {
      alert('포인트를 지급할 회원을 선택해주세요.');
      return;
    }
    if (!pointAmount || pointAmount <= 0) {
      alert('지급할 포인트를 입력해주세요.');
      return;
    }
    if (!reason) {
      alert('지급 사유를 입력해주세요.');
      return;
    }
    setIsGranted(true);
    setTimeout(() => {
      setIsGranted(false);
      setSelectedMembers([]);
    }, 3000);
  };

  const totalPoints = pointAmount * selectedMembers.length;

  return (
    <div className="batch-point-grant">
      {/* 검색 영역 */}
      <div className="search-section">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="회원 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* 필터 영역 */}
      <div className="filter-section">
        <div className="filter-content">
          <div className="filter-rows">
            <div className="filter-row">
              {filterOptions.map(option => (
                <button 
                  key={option} 
                  className={`filter-dropdown ${selectedFilters[option] ? 'active' : ''}`}
                  onClick={() => handleFilterClick(option)}
                >
                  {option}
                  <ChevronDown size={14} />
                </button>
              ))}
            </div>
            <div className="filter-row">
              {filterOptions2.map(option => (
                <button 
                  key={option} 
                  className={`filter-dropdown ${selectedFilters[option] ? 'active' : ''}`}
                  onClick={() => handleFilterClick(option)}
                >
                  {option}
                  <ChevronDown size={14} />
                </button>
              ))}
            </div>
          </div>
          <button 
            className={`filter-reset-btn ${hasActiveFilters ? 'active' : ''}`}
            onClick={resetFilters}
            disabled={!hasActiveFilters}
          >
            <RotateCcw size={14} />
            필터초기화
          </button>
        </div>
      </div>

      {/* 포인트 지급 버튼 (회원 선택 시 활성화) */}
      {!showGrantForm && (
        <div className="grant-button-section">
          <div className="grant-summary-inline">
            <span className="summary-text">
              선택: <strong>{selectedMembers.length}명</strong>
            </span>
          </div>
          <button 
            className="btn-grant"
            onClick={() => setShowGrantForm(true)}
            disabled={selectedMembers.length === 0}
          >
            <Send size={18} />
            포인트 지급
          </button>
        </div>
      )}

      {/* 포인트 지급 설정 폼 (버튼 클릭 시 표시) */}
      {showGrantForm && (
        <div className="grant-settings">
          <div className="grant-form-header">
            <h3 className="grant-form-title">포인트 지급</h3>
            <button className="grant-form-close" onClick={() => setShowGrantForm(false)}>
              <X size={18} />
            </button>
          </div>
          <div className="grant-form-content">
            <div className="grant-input-group">
              <label className="grant-label">지급 포인트</label>
              <div className="input-with-suffix">
                <input
                  type="number"
                  className="grant-input"
                  value={pointAmount}
                  onChange={e => setPointAmount(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <span className="input-suffix">P</span>
              </div>
            </div>
            <div className="grant-input-group reason-group">
              <label className="grant-label">지급 사유</label>
              <input
                type="text"
                className="grant-input reason-input"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="예: 신년 이벤트 포인트 지급"
              />
            </div>
          </div>
          <div className="grant-form-footer">
            <div className="grant-summary">
              <span className="summary-text">
                선택: <strong>{selectedMembers.length}명</strong>
              </span>
              <span className="summary-text">
                총 지급: <strong className="total-points">{totalPoints.toLocaleString()}P</strong>
              </span>
            </div>
            <button 
              className="btn-grant"
              onClick={handleGrant}
              disabled={!pointAmount || !reason}
            >
              <Send size={18} />
              지급하기
            </button>
          </div>
        </div>
      )}

      {/* 회원 테이블 */}
      <div className="members-table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedMembers.length === filteredMembers.length && filteredMembers.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>회원</th>
              <th>성별</th>
              <th>생년월일</th>
              <th>상태</th>
              <th>회원권</th>
              <th>만료일</th>
              <th>잔여 일수</th>
              <th>잔여 횟수</th>
              <th>보유 포인트</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map(member => (
              <tr 
                key={member.id} 
                className={selectedMembers.includes(member.id) ? 'selected' : ''}
              >
                <td className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => handleSelectMember(member.id, e.target.checked)}
                  />
                </td>
                <td className="member-info-cell">
                  <div className="member-avatar" />
                  <div className="member-details">
                    <span className="member-name">{member.name}</span>
                    <span className="member-phone">{member.phone}</span>
                  </div>
                </td>
                <td>{member.gender}</td>
                <td>{member.birthDate}</td>
                <td>
                  <span className={`status-badge ${member.status === '유효' ? 'valid' : member.status === '만료' ? 'expired' : 'no-input'}`}>
                    {member.status}
                  </span>
                </td>
                <td className="membership-cell">{member.membership}</td>
                <td>{member.expiryDate}</td>
                <td>{member.remainingDays}</td>
                <td>{member.remainingCount}</td>
                <td className="points-cell">{member.currentPoints.toLocaleString()}P</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="pagination-wrapper">
        <div className="rows-per-page">
          <span className="rows-label">행 표시:</span>
          <select
            className="rows-select"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="pagination-center">
          <button
            className="page-btn nav"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="page-btn nav"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* 성공 토스트 */}
      {isGranted && (
        <div className="toast success">
          <CheckCircle size={20} />
          <span>{selectedMembers.length}명에게 {pointAmount.toLocaleString()}P가 지급되었습니다.</span>
          <button className="toast-close" onClick={() => setIsGranted(false)}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BatchPointGrant;
