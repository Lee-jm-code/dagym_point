import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Mail, Edit2, Trash2, Plus, MoreHorizontal, ChevronRight, ArrowLeft } from 'lucide-react';
import './MemberDetail.css';

interface MemberInfo {
  id: string;
  name: string;
  phone: string;
  gender: '남' | '여';
  birthDate: string;
  address: string;
  manager: string;
  lockerNumber: string;
  lockerMemo: string;
  appJoined: boolean;
  accessInfo: boolean;
  point: number;
  registeredAt: string;
  products: {
    id: string;
    name: string;
    type: string;
    color: 'yellow' | 'blue' | 'green' | 'purple';
    remainingDays: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }[];
  attendanceRecords: {
    date: string;
    time: string;
  }[];
  reservationRecords: {
    date: string;
    className: string;
    status: string;
  }[];
  stats: {
    lastAttendance: string;
    totalAttendance: number;
    expiryDays: number;
    expiryDate: string;
    totalPayment: number;
    paymentCount: number;
  };
}

// 샘플 데이터
const mockMemberData: Record<string, MemberInfo> = {
  '1': {
    id: '1',
    name: '상단확인용',
    phone: '010-6745-5829',
    gender: '남',
    birthDate: '-',
    address: '-',
    manager: '-',
    lockerNumber: '-',
    lockerMemo: '-',
    appJoined: false,
    accessInfo: false,
    point: 0,
    registeredAt: '2026.01.09',
    products: [],
    attendanceRecords: [],
    reservationRecords: [],
    stats: {
      lastAttendance: '-',
      totalAttendance: 0,
      expiryDays: 0,
      expiryDate: '-',
      totalPayment: 0,
      paymentCount: 0,
    },
  },
  '2': {
    id: '2',
    name: 'test',
    phone: '010-6745-7749',
    gender: '남',
    birthDate: '-',
    address: '-',
    manager: '-',
    lockerNumber: '-',
    lockerMemo: '-',
    appJoined: true,
    accessInfo: false,
    point: 5000,
    registeredAt: '2026.01.09',
    products: [
      {
        id: 'p1',
        name: '운동복',
        type: '대여 - 운동복',
        color: 'yellow',
        remainingDays: 29,
        startDate: '2026.01.16',
        endDate: '2026.02.15',
        isActive: true,
      },
      {
        id: 'p2',
        name: '(((((횟수제)))) 헬스',
        type: '일반회원권',
        color: 'blue',
        remainingDays: 29,
        startDate: '2026.01.16',
        endDate: '2026.02.15',
        isActive: true,
      },
    ],
    attendanceRecords: [],
    reservationRecords: [],
    stats: {
      lastAttendance: '-',
      totalAttendance: 0,
      expiryDays: 29,
      expiryDate: '2026.02.15',
      totalPayment: 106000,
      paymentCount: 2,
    },
  },
  '3': {
    id: '3',
    name: '제갈민주',
    phone: '010-6745-9409',
    gender: '남',
    birthDate: '-',
    address: '-',
    manager: '-',
    lockerNumber: '-',
    lockerMemo: '-',
    appJoined: false,
    accessInfo: false,
    point: 1500,
    registeredAt: '2026.01.05',
    products: [
      {
        id: 'p3',
        name: '테스트100테스트',
        type: '1회',
        color: 'green',
        remainingDays: 0,
        startDate: '2026.01.05',
        endDate: '-',
        isActive: true,
      },
    ],
    attendanceRecords: [],
    reservationRecords: [],
    stats: {
      lastAttendance: '-',
      totalAttendance: 0,
      expiryDays: 0,
      expiryDate: '-',
      totalPayment: 50000,
      paymentCount: 1,
    },
  },
  '4': {
    id: '4',
    name: 'ㅅㄷㄴㅅ',
    phone: '010-6745-7749',
    gender: '남',
    birthDate: '-',
    address: '-',
    manager: '-',
    lockerNumber: '-',
    lockerMemo: '-',
    appJoined: true,
    accessInfo: true,
    point: 3000,
    registeredAt: '2026.01.10',
    products: [
      {
        id: 'p4',
        name: '(((((기간제)))) 헬스',
        type: '1개월',
        color: 'blue',
        remainingDays: 20,
        startDate: '2026.01.17',
        endDate: '2026.02.06',
        isActive: true,
      },
    ],
    attendanceRecords: [],
    reservationRecords: [],
    stats: {
      lastAttendance: '-',
      totalAttendance: 0,
      expiryDays: 20,
      expiryDate: '2026.02.06',
      totalPayment: 80000,
      paymentCount: 1,
    },
  },
  '5': {
    id: '5',
    name: 'leejm',
    phone: '010-6745-4191',
    gender: '남',
    birthDate: '-',
    address: '-',
    manager: '-',
    lockerNumber: '-',
    lockerMemo: '-',
    appJoined: true,
    accessInfo: false,
    point: 10000,
    registeredAt: '2026.01.08',
    products: [
      {
        id: 'p5',
        name: 'TEST1111123',
        type: '1회',
        color: 'purple',
        remainingDays: 0,
        startDate: '2026.01.08',
        endDate: '-',
        isActive: true,
      },
      {
        id: 'p6',
        name: '(((((횟수제)))) 헬스',
        type: '1개월',
        color: 'blue',
        remainingDays: 20,
        startDate: '2026.01.17',
        endDate: '2026.02.06',
        isActive: true,
      },
    ],
    attendanceRecords: [],
    reservationRecords: [],
    stats: {
      lastAttendance: '-',
      totalAttendance: 0,
      expiryDays: 20,
      expiryDate: '2026.02.06',
      totalPayment: 120000,
      paymentCount: 2,
    },
  },
};

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeProductTab, setActiveProductTab] = useState<'active' | 'past'>('active');

  const member = mockMemberData[id || '2'] || mockMemberData['2'];

  const activeProducts = member.products.filter(p => p.isActive);
  const pastProducts = member.products.filter(p => !p.isActive);

  const getProductColorClass = (color: string) => {
    switch (color) {
      case 'yellow': return 'product-dot-yellow';
      case 'blue': return 'product-dot-blue';
      case 'green': return 'product-dot-green';
      case 'purple': return 'product-dot-purple';
      default: return 'product-dot-blue';
    }
  };

  return (
    <div className="member-detail-page">
      {/* 뒤로가기 버튼 */}
      <button className="back-button" onClick={() => navigate('/members')}>
        <ArrowLeft size={20} />
        <span>회원 목록</span>
      </button>

      {/* 상단 회원 정보 */}
      <div className="member-header-card">
        <div className="member-header-left">
          <div className="member-avatar-large" />
          <div className="member-basic-info">
            <div className="member-name-row">
              <h1 className="member-name">{member.name}</h1>
              <span className="gender-badge">{member.gender}</span>
            </div>
            <p className="member-phone">{member.phone}</p>
            <div className="member-action-buttons">
              <button className="action-btn-outline">계약서 관리</button>
              <button className="action-btn-outline">출입 관리</button>
            </div>
            <button className="payment-link-btn">결제링크 전송</button>
            <div className="promo-banner">
              <span>최대 7개월 무이자 할부 혜택!</span>
              <button className="promo-close">×</button>
            </div>
            <p className="consent-info">2025.07.10 19:38 수수료 결제 동의</p>
          </div>
        </div>

        <div className="member-header-right">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">생년월일</span>
              <span className="info-value">{member.birthDate}</span>
            </div>
            <div className="info-item">
              <span className="info-label">주소</span>
              <span className="info-value">{member.address}</span>
            </div>
            <div className="info-item">
              <span className="info-label">담당자</span>
              <span className="info-value">{member.manager}</span>
            </div>
            <div className="info-item">
              <span className="info-label">락커번호</span>
              <span className="info-value">{member.lockerNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">락커메모</span>
              <span className="info-value">{member.lockerMemo}</span>
            </div>
            <div className="info-item">
              <span className="info-label">앱 가입</span>
              <span className="info-value">{member.appJoined ? 'O' : 'X'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">출입정보</span>
              <span className="info-value">{member.accessInfo ? 'O' : 'X'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">포인트(P)</span>
              <span className="info-value point-value">{member.point.toLocaleString()}P</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Mail size={20} /></button>
            <button className="icon-btn"><Edit2 size={20} /></button>
            <button className="icon-btn delete"><Trash2 size={20} /></button>
          </div>
        </div>
      </div>

      {/* 중간 섹션: 상품, 출석기록, 수업예약기록 */}
      <div className="middle-section">
        {/* 이용중인 상품 */}
        <div className="section-card products-card">
          <div className="section-header">
            <div className="tab-buttons">
              <button
                className={`tab-btn ${activeProductTab === 'active' ? 'active' : ''}`}
                onClick={() => setActiveProductTab('active')}
              >
                이용중인 상품
              </button>
              <button
                className={`tab-btn ${activeProductTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveProductTab('past')}
              >
                지난 상품
              </button>
            </div>
            <button className="add-btn"><Plus size={20} /></button>
          </div>
          <div className="product-list">
            {(activeProductTab === 'active' ? activeProducts : pastProducts).length > 0 ? (
              (activeProductTab === 'active' ? activeProducts : pastProducts).map(product => (
                <div key={product.id} className="product-item">
                  <div className="product-info">
                    <div className={`product-dot ${getProductColorClass(product.color)}`} />
                    <div className="product-details">
                      <div className="product-name-row">
                        <span className="product-name">{product.name}</span>
                        <span className="product-type">{product.type}</span>
                      </div>
                      <span className="product-period">
                        잔여 {product.remainingDays}일({product.startDate} ~ {product.endDate})
                      </span>
                    </div>
                  </div>
                  <button className="more-btn"><MoreHorizontal size={18} /></button>
                </div>
              ))
            ) : (
              <div className="empty-state">상품이 없습니다.</div>
            )}
          </div>
        </div>

        {/* 출석 기록 */}
        <div className="section-card attendance-card">
          <div className="section-header">
            <h3 className="section-title">
              출석 기록
              <span className="period-label">최근 30일</span>
              <ChevronRight size={16} />
            </h3>
            <button className="add-btn"><Plus size={20} /></button>
          </div>
          <div className="attendance-content">
            {member.attendanceRecords.length > 0 ? (
              member.attendanceRecords.map((record, idx) => (
                <div key={idx} className="attendance-item">
                  <span>{record.date}</span>
                  <span>{record.time}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">출석 기록이 없어요.</div>
            )}
          </div>
        </div>

        {/* 수업 예약기록 */}
        <div className="section-card reservation-card">
          <div className="section-header">
            <h3 className="section-title">
              수업 예약기록
              <span className="period-label">최근 30일</span>
              <ChevronRight size={16} />
            </h3>
          </div>
          <div className="reservation-content">
            {member.reservationRecords.length > 0 ? (
              member.reservationRecords.map((record, idx) => (
                <div key={idx} className="reservation-item">
                  <span>{record.date}</span>
                  <span>{record.className}</span>
                  <span>{record.status}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">수업 예약기록이 없어요.</div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 통계 카드 */}
      <div className="stats-cards">
        <div className="stat-card-item">
          <div className="stat-icon calendar-icon">📅</div>
          <div className="stat-info">
            <div className="stat-row">
              <span className="stat-label">최근 출석</span>
              <span className="stat-value">{member.stats.lastAttendance}</span>
            </div>
            <span className="stat-sub">마지막 출석: {member.stats.lastAttendance}</span>
          </div>
        </div>

        <div className="stat-card-item">
          <div className="stat-icon heart-icon">❤️</div>
          <div className="stat-info">
            <div className="stat-row">
              <span className="stat-label">누적출석횟수</span>
              <span className="stat-value">{member.stats.totalAttendance}회</span>
            </div>
            <span className="stat-sub">최초 등록일: {member.registeredAt}</span>
          </div>
        </div>

        <div className="stat-card-item">
          <div className="stat-icon hourglass-icon">⏳</div>
          <div className="stat-info">
            <div className="stat-row">
              <span className="stat-label">만료</span>
              <span className="stat-value">{member.stats.expiryDays}일</span>
            </div>
            <span className="stat-sub">만료일: {member.stats.expiryDate}</span>
          </div>
        </div>

        <div className="stat-card-item">
          <div className="stat-icon money-icon">💰</div>
          <div className="stat-info">
            <div className="stat-row">
              <span className="stat-label">누적결제금액</span>
              <span className="stat-value">{member.stats.totalPayment.toLocaleString()}원</span>
            </div>
            <span className="stat-sub">결제 건수: {member.stats.paymentCount}회</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
