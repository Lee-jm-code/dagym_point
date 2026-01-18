import { useState } from 'react';
import { Search, ChevronDown, X, Download } from 'lucide-react';
import './Members.css';

interface Member {
  id: string;
  name: string;
  phone: string;
  gender: '남' | '여';
  birthDate: string;
  status: '유효' | '만료' | '미입력';
  lastAttendance: string;
  membership: string;
  expiryDate: string;
  remainingDays: string;
  remainingCount: string;
  lockerNumber: string;
}

const mockMembers: Member[] = [
  { id: '1', name: '상단확인용', phone: '010-****-5829', gender: '남', birthDate: '-', status: '미입력', lastAttendance: '-', membership: '-', expiryDate: '-', remainingDays: '-', remainingCount: '-', lockerNumber: '-' },
  { id: '2', name: 'test', phone: '010-****-7749', gender: '남', birthDate: '-', status: '유효', lastAttendance: '-', membership: '(((((횟수제)))) 헬스 1개월', expiryDate: '2026.02.15', remainingDays: '29일', remainingCount: '-', lockerNumber: '-' },
  { id: '3', name: '제갈민주', phone: '010-****-9409', gender: '남', birthDate: '-', status: '유효', lastAttendance: '-', membership: '테스트100테스트 1회', expiryDate: '-', remainingDays: '-', remainingCount: '1회', lockerNumber: '-' },
  { id: '4', name: 'ㅅㄷㄴㅅ', phone: '010-****-7749', gender: '남', birthDate: '-', status: '유효', lastAttendance: '-', membership: '(((((기간제)))) 헬스 1개월', expiryDate: '2026.02.06', remainingDays: '20일', remainingCount: '-', lockerNumber: '-' },
  { id: '5', name: 'leejm', phone: '010-****-4191', gender: '남', birthDate: '-', status: '유효', lastAttendance: '-', membership: 'TEST1111123 1회\n(((((횟수제)))) 헬스 1개월', expiryDate: '2026.02.06', remainingDays: '20일', remainingCount: '1회', lockerNumber: '-' },
];

const filterOptions = [
  '상태', '성별', '생일', '회원권', '등록 기간', '만료일', '락커', '운동복', '재등록 여부', '담당자', '홀딩'
];

const filterOptions2 = [
  '최초등록일', '잔여 일수', '잔여 횟수', '출석일', '미출석 기간', '출입정보'
];

const tabs = ['회원', '예비회원', '전자계약서', '전자계약 설정', '타지점회원', '다짐 상담톡'];

const Members = () => {
  const [activeTab, setActiveTab] = useState('회원');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const stats = {
    valid: 1353,
    total: 76600,
    expired: 46401,
    noInput: 28846,
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMembers(mockMembers.map(m => m.id));
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

  const totalPages = Math.ceil(mockMembers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentMembers = mockMembers.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="members-page">
      {/* 상단 탭 */}
      <div className="page-tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 검색 + 신규 회원 등록 */}
      <div className="search-header">
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
        <button className="add-member-btn">
          + 신규 회원 등록
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-left">
            {filterOptions.map(option => (
              <button key={option} className="filter-dropdown">
                {option}
                <ChevronDown size={14} />
              </button>
            ))}
          </div>
          <div className="filter-right">
            <button className="filter-reset-btn">필터 초기화</button>
            <button className="filter-dropdown">
              체육시설 기본
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
        <div className="filter-row">
          <div className="filter-left">
            {filterOptions2.map(option => (
              <button key={option} className="filter-dropdown">
                {option}
                <ChevronDown size={14} />
              </button>
            ))}
          </div>
          <div className="filter-right">
            <button className="action-btn outline" disabled>
              선택한 회원들(에게)
            </button>
            <button className="action-btn outline">
              <Download size={14} />
              엑셀 다운로드
            </button>
          </div>
        </div>
      </div>

      {/* 통계 영역 */}
      <div className="stats-section">
        <div className="stats-left">
          <div className="stat-item primary">
            <span className="stat-label">유효</span>
            <span className="stat-value">{stats.valid.toLocaleString()}명</span>
          </div>
          <div className="stat-divider">|</div>
          <div className="stat-item">
            <span className="stat-label">전체</span>
            <span className="stat-value">{stats.total.toLocaleString()}명</span>
          </div>
          <div className="stat-divider">|</div>
          <div className="stat-item">
            <span className="stat-label">만료</span>
            <span className="stat-value">{stats.expired.toLocaleString()}명</span>
          </div>
          <div className="stat-divider">|</div>
          <div className="stat-item">
            <span className="stat-label">미입력</span>
            <span className="stat-value">{stats.noInput.toLocaleString()}명</span>
          </div>
        </div>
        <div className="stats-right">
          <span className="search-result-label">검색결과</span>
          <span className="search-result-value">{stats.total.toLocaleString()}명</span>
        </div>
      </div>

      {/* 회원 테이블 */}
      <div className="members-table-wrapper">
        <table className="members-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedMembers.length === mockMembers.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>회원 ↓↑</th>
              <th>성별</th>
              <th>생년월일 ↓↑</th>
              <th>상태</th>
              <th>최근 출석일 ↓↑</th>
              <th>회원권</th>
              <th>만료일 ↓↑</th>
              <th>잔여 일수 ↓↑</th>
              <th>잔여 횟수 ↓↑</th>
              <th>락커 번호</th>
              <th>출입정보</th>
            </tr>
          </thead>
          <tbody>
            {currentMembers.map(member => (
              <tr key={member.id}>
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
                <td>{member.lastAttendance}</td>
                <td className="membership-cell">{member.membership}</td>
                <td>{member.expiryDate}</td>
                <td>{member.remainingDays}</td>
                <td>{member.remainingCount}</td>
                <td>{member.lockerNumber}</td>
                <td className="action-cell">
                  <button className="delete-btn">
                    <X size={18} />
                  </button>
                </td>
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
            <option value={200}>200</option>
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
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Members;
