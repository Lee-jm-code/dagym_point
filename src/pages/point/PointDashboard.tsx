import { useState } from 'react';
import { TrendingUp, TrendingDown, Coins, Gift, ShoppingCart, Clock, Calendar, RotateCcw } from 'lucide-react';
import type { PointStats, PointTransaction } from '../../types/point';
import './PointDashboard.css';

type DateFilterType = 'thisMonth' | 'lastMonth' | 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisYear' | 'lastYear' | 'custom';

const getDateRange = (filterType: DateFilterType): { start: Date; end: Date } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // 월요일 기준 요일 계산 (월=0, 화=1, ..., 일=6)
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 일요일이면 -6, 아니면 1-요일
  
  switch (filterType) {
    case 'today':
      return { start: today, end: today };
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { start: yesterday, end: yesterday };
    case 'thisWeek':
      // 이번 주 월요일 ~ 일요일
      const thisWeekMonday = new Date(today);
      thisWeekMonday.setDate(today.getDate() + mondayOffset);
      const thisWeekSunday = new Date(thisWeekMonday);
      thisWeekSunday.setDate(thisWeekMonday.getDate() + 6);
      return { start: thisWeekMonday, end: thisWeekSunday };
    case 'lastWeek':
      // 지난 주 월요일 ~ 일요일
      const lastWeekMonday = new Date(today);
      lastWeekMonday.setDate(today.getDate() + mondayOffset - 7);
      const lastWeekSunday = new Date(lastWeekMonday);
      lastWeekSunday.setDate(lastWeekMonday.getDate() + 6);
      return { start: lastWeekMonday, end: lastWeekSunday };
    case 'thisMonth':
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
    case 'lastMonth':
      return { start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: new Date(now.getFullYear(), now.getMonth(), 0) };
    case 'thisYear':
      return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31) };
    case 'lastYear':
      return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear() - 1, 11, 31) };
    default:
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
  }
};

const formatDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 샘플 데이터
const mockStats: PointStats = {
  totalIssued: 1250000,
  totalUsed: 850000,
  totalExpired: 50000,
  availableBalance: 350000,
  monthlyIssued: 125000,
  monthlyUsed: 98000,
};

const mockTransactions: PointTransaction[] = [
  { id: '1', memberId: 'm1', memberName: '김철수', type: 'EARN', amount: 500, balance: 3500, reason: 'ATTENDANCE', reasonLabel: '출석', createdAt: '2026-01-08 14:30' },
  { id: '2', memberId: 'm2', memberName: '이영희', type: 'USE', amount: -1000, balance: 2000, reason: 'PAYMENT_USE', reasonLabel: '결제 사용', createdAt: '2026-01-08 13:15' },
  { id: '3', memberId: 'm3', memberName: '박민수', type: 'EARN', amount: 2000, balance: 5000, reason: 'RE_REGISTRATION', reasonLabel: '재등록', createdAt: '2026-01-08 11:20' },
  { id: '4', memberId: 'm4', memberName: '최지은', type: 'EARN', amount: 1000, balance: 1000, reason: 'NEW_REGISTRATION', reasonLabel: '신규 등록', createdAt: '2026-01-08 10:05' },
  { id: '5', memberId: 'm5', memberName: '정하늘', type: 'USE', amount: -3000, balance: 500, reason: 'PAYMENT_USE', reasonLabel: '결제 사용', createdAt: '2026-01-07 16:40' },
  { id: '6', memberId: 'm6', memberName: '강서연', type: 'EARN', amount: 500, balance: 4500, reason: 'ATTENDANCE', reasonLabel: '출석', createdAt: '2026-01-07 15:30' },
  { id: '7', memberId: 'm7', memberName: '윤도현', type: 'EXPIRE', amount: -200, balance: 800, reason: 'EXPIRATION', reasonLabel: '만료 소멸', createdAt: '2026-01-07 00:00' },
];

const formatNumber = (num: number) => {
  return num.toLocaleString('ko-KR');
};

const PointDashboard = () => {
  const [stats] = useState<PointStats>(mockStats);
  const [transactions] = useState<PointTransaction[]>(mockTransactions);
  const [dateFilter, setDateFilter] = useState<DateFilterType>('thisMonth');
  const [dateRange, setDateRange] = useState(getDateRange('thisMonth'));
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleFilterChange = (filterType: DateFilterType) => {
    setDateFilter(filterType);
    setDateRange(getDateRange(filterType));
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value);
    setDateFilter('custom');
    setDateRange(prev => ({
      ...prev,
      [type]: newDate
    }));
  };

  const handleReset = () => {
    setDateFilter('thisMonth');
    setDateRange(getDateRange('thisMonth'));
  };

  // 시간순 정렬 (최신순)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // 행 수 변경 시 첫 페이지로 이동
  };

  return (
    <div className="point-dashboard">
      <div className="page-header">
        <h1 className="page-title">포인트 대시보드</h1>
        <p className="page-description">시설 포인트 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <Coins size={24} />
            </div>
            <span className="stat-trend up">
              <TrendingUp size={14} />
              12%
            </span>
          </div>
          <div className="stat-card-body">
            <span className="stat-label">총 발행 포인트</span>
            <span className="stat-value">{formatNumber(stats.totalIssued)}P</span>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <ShoppingCart size={24} />
            </div>
            <span className="stat-trend up">
              <TrendingUp size={14} />
              8%
            </span>
          </div>
          <div className="stat-card-body">
            <span className="stat-label">총 사용 포인트</span>
            <span className="stat-value">{formatNumber(stats.totalUsed)}P</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <Gift size={24} />
            </div>
          </div>
          <div className="stat-card-body">
            <span className="stat-label">미사용 잔액</span>
            <span className="stat-value">{formatNumber(stats.availableBalance)}P</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-card-header">
            <div className="stat-icon-wrapper">
              <Clock size={24} />
            </div>
            <span className="stat-trend down">
              <TrendingDown size={14} />
              5%
            </span>
          </div>
          <div className="stat-card-body">
            <span className="stat-label">만료 포인트</span>
            <span className="stat-value">{formatNumber(stats.totalExpired)}P</span>
          </div>
        </div>
      </div>

      {/* 날짜 필터 + 포인트 현황 */}
      <div className="filter-summary-card">
        {/* 첫 번째 줄: 날짜 선택 */}
        <div className="filter-row-1">
          <div className="date-range-picker">
            <Calendar size={18} className="calendar-icon" />
            <input
              type="date"
              className="date-input"
              value={formatDateInput(dateRange.start)}
              onChange={(e) => handleDateChange('start', e.target.value)}
            />
            <span className="date-separator">~</span>
            <input
              type="date"
              className="date-input"
              value={formatDateInput(dateRange.end)}
              onChange={(e) => handleDateChange('end', e.target.value)}
            />
          </div>
        </div>

        {/* 두 번째 줄: 필터 버튼들 */}
        <div className="filter-row-2">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${dateFilter === 'thisMonth' ? 'active' : ''}`}
              onClick={() => handleFilterChange('thisMonth')}
            >
              이번 달
            </button>
            <button 
              className={`filter-btn ${dateFilter === 'lastMonth' ? 'active' : ''}`}
              onClick={() => handleFilterChange('lastMonth')}
            >
              지난 달
            </button>
            <button 
              className={`filter-btn ${dateFilter === 'today' ? 'active' : ''}`}
              onClick={() => handleFilterChange('today')}
            >
              오늘
            </button>
            <button 
              className={`filter-btn ${dateFilter === 'yesterday' ? 'active' : ''}`}
              onClick={() => handleFilterChange('yesterday')}
            >
              어제
            </button>
            <button 
              className={`filter-btn ${dateFilter === 'thisWeek' ? 'active' : ''}`}
              onClick={() => handleFilterChange('thisWeek')}
            >
              이번 주
            </button>
            <button 
              className={`filter-btn ${dateFilter === 'lastWeek' ? 'active' : ''}`}
              onClick={() => handleFilterChange('lastWeek')}
            >
              지난 주
            </button>
            <button 
              className={`filter-btn ${dateFilter === 'thisYear' ? 'active' : ''}`}
              onClick={() => handleFilterChange('thisYear')}
            >
              올해
            </button>
            <button 
              className={`filter-btn ${dateFilter === 'lastYear' ? 'active' : ''}`}
              onClick={() => handleFilterChange('lastYear')}
            >
              작년
            </button>
          </div>
          <button 
            className="filter-btn reset"
            onClick={handleReset}
          >
            <RotateCcw size={14} />
            필터 초기화
          </button>
        </div>

        {/* 세 번째 줄: 포인트 현황 */}
        <div className="filter-row-3">
          <div className="point-stat-item">
            <span className="point-stat-label">발행 포인트</span>
            <span className="point-stat-value earn">{formatNumber(stats.monthlyIssued)}P</span>
          </div>
          <div className="point-stat-divider" />
          <div className="point-stat-item">
            <span className="point-stat-label">사용 포인트</span>
            <span className="point-stat-value use">{formatNumber(stats.monthlyUsed)}P</span>
          </div>
          <div className="point-stat-divider" />
          <div className="point-stat-item">
            <span className="point-stat-label">미사용 포인트</span>
            <span className="point-stat-value balance">{formatNumber(stats.monthlyIssued - stats.monthlyUsed)}P</span>
          </div>
        </div>
      </div>

      {/* 포인트 활동 */}
      <div className="point-activity">
        <div className="activity-header">
          <h2 className="section-title">포인트 활동</h2>
        </div>
        
        <div className="activity-table-wrapper">
          <table className="activity-table">
            <thead>
              <tr>
                <th>회원명</th>
                <th>유형</th>
                <th>포인트</th>
                <th>잔액</th>
                <th>사유</th>
                <th>일시</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map(tx => (
                <tr key={tx.id}>
                  <td className="member-name">{tx.memberName}</td>
                  <td>
                    <span className={`type-badge ${tx.type.toLowerCase()}`}>
                      {tx.type === 'EARN' ? '적립' : tx.type === 'USE' ? '사용' : tx.type === 'EXPIRE' ? '만료' : '취소'}
                    </span>
                  </td>
                  <td className={`amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatNumber(tx.amount)}P
                  </td>
                  <td className="balance">{formatNumber(tx.balance)}P</td>
                  <td className="reason">{tx.reasonLabel}</td>
                  <td className="datetime">{tx.createdAt}</td>
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
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="page-btn nav"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointDashboard;

