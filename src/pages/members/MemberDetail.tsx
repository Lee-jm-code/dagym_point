import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Mail, Edit2, Trash2, Plus, MoreHorizontal, ChevronRight, ChevronLeft, ArrowLeft, X, List, CalendarDays } from 'lucide-react';
import './MemberDetail.css';

interface PointHistory {
  id: string;
  type: 'earn' | 'use';
  amount: number;
  balance: number;
  reason: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  type: string;
  color: 'yellow' | 'blue' | 'green' | 'purple';
  remainingDays: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usedPoints?: number;
  salePrice?: number;
  receivedAmount?: number;
}

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
  products: Product[];
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
  pointHistory: PointHistory[];
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
    point: 2000,
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
    pointHistory: [
      { id: 'ph2', type: 'use', amount: -3000, balance: 2000, reason: '포인트 사용', createdAt: '2026-01-20 14:30' },
      { id: 'ph1', type: 'earn', amount: 5000, balance: 5000, reason: '새해 이벤트 포인트', createdAt: '2026-01-01 10:00' },
    ],
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
    pointHistory: [
      { id: 'ph_t5', type: 'use', amount: -3000, balance: 5500, reason: '헬스 3개월 결제 사용', createdAt: '2026-04-01' },
      { id: 'ph_t4', type: 'earn', amount: 5000, balance: 8500, reason: '재등록 보너스 포인트 지급', createdAt: '2026-03-20' },
      { id: 'ph_t3', type: 'use', amount: -1500, balance: 3500, reason: 'PT 10회 결제 사용', createdAt: '2026-03-05' },
      { id: 'ph_t2', type: 'earn', amount: 2000, balance: 5000, reason: '출석 이벤트 포인트 지급', createdAt: '2026-02-15' },
      { id: 'ph_t1', type: 'earn', amount: 3000, balance: 3000, reason: '신규 가입 포인트 지급', createdAt: '2026-01-10' },
      { id: 'ph_t6', type: 'use', amount: -500, balance: 5000, reason: '운동복 대여 결제 사용', createdAt: '2026-04-10' },
    ],
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
    pointHistory: [],
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
    pointHistory: [],
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
    pointHistory: [],
  },
};

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeProductTab, setActiveProductTab] = useState<'active' | 'past'>('active');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPointHistory, setShowPointHistory] = useState(false);
  const [showInlineGrant, setShowInlineGrant] = useState(false);
  const [inlineGrantAmount, setInlineGrantAmount] = useState<number>(1000);
  const [inlineGrantReason, setInlineGrantReason] = useState('');
  const [productMenuOpen, setProductMenuOpen] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundProductId, setRefundProductId] = useState<string | null>(null);
  const [refundDate, setRefundDate] = useState(new Date().toISOString().split('T')[0]);
  const [refundMethod, setRefundMethod] = useState('카드');
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('');
  const [refundChecked, setRefundChecked] = useState<Record<string, boolean>>({});
  const [showAttendanceCalendar, setShowAttendanceCalendar] = useState(false);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState<string | null>(null);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [attendanceViewMode, setAttendanceViewMode] = useState<'list' | 'calendar'>('list');
  const [viewCalendarYear, setViewCalendarYear] = useState(new Date().getFullYear());
  const [viewCalendarMonth, setViewCalendarMonth] = useState(new Date().getMonth());
  
  // 상품 배정 폼 상태
  const [productForm, setProductForm] = useState({
    product: '',
    membershipPeriod: '',
    salesManager: '',
    exerciseStartDate: '',
    exerciseEndDate: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: '카드',
    productPrice: 0,
    salePrice: 0,
    receivedAmount: 0,
    usePoints: 0,
  });

  const memberId = id || '2';
  const initialMember = mockMemberData[memberId] || mockMemberData['2'];
  
  // localStorage에서 데이터 불러오기 (컴포넌트 외부에서 즉시 실행)
  const loadStoredProducts = (): Product[] => {
    const stored = localStorage.getItem(`member_${memberId}_products`);
    if (stored) {
      try {
        return JSON.parse(stored) as Product[];
      } catch {
        return initialMember.products;
      }
    }
    return initialMember.products;
  };
  
  const loadStoredPoints = (): number => {
    const stored = localStorage.getItem(`member_${memberId}_points`);
    if (stored) {
      try {
        return JSON.parse(stored) as number;
      } catch {
        return initialMember.point;
      }
    }
    return initialMember.point;
  };
  
  const loadStoredPointHistory = (): PointHistory[] => {
    const stored = localStorage.getItem(`member_${memberId}_pointHistory`);
    if (stored) {
      try {
        return JSON.parse(stored) as PointHistory[];
      } catch {
        return initialMember.pointHistory;
      }
    }
    return initialMember.pointHistory;
  };

  const loadStoredAttendance = (): { date: string; time: string }[] => {
    const stored = localStorage.getItem(`member_${memberId}_attendance`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialMember.attendanceRecords;
      }
    }
    return initialMember.attendanceRecords;
  };
  
  const [memberProducts, setMemberProducts] = useState<Product[]>(loadStoredProducts);
  const [memberPoints, setMemberPoints] = useState<number>(loadStoredPoints);
  const [memberPointHistory, setMemberPointHistory] = useState<PointHistory[]>(loadStoredPointHistory);
  const [memberAttendance, setMemberAttendance] = useState<{ date: string; time: string }[]>(loadStoredAttendance);
  
  // memberId 변경 시 데이터 다시 로드
  useEffect(() => {
    setMemberProducts(loadStoredProducts());
    setMemberPoints(loadStoredPoints());
    setMemberPointHistory(loadStoredPointHistory());
    setMemberAttendance(loadStoredAttendance());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

  // 기존 상품이 있는 회원은 hadProduct 마킹
  useEffect(() => {
    if (memberProducts.length > 0 || (initialMember.products && initialMember.products.length > 0)) {
      localStorage.setItem(`member_${memberId}_hadProduct`, 'true');
    }
  }, [memberId, memberProducts.length, initialMember.products]);

  // 포인트 음수 보정 및 잘못된 이력 정리
  useEffect(() => {
    const storedHistory = localStorage.getItem(`member_${memberId}_pointHistory`);
    if (storedHistory) {
      try {
        const history = JSON.parse(storedHistory);
        const cleaned = history.filter((h: PointHistory) => !h.reason.includes('결제 수정 사용'));
        if (cleaned.length !== history.length) {
          localStorage.setItem(`member_${memberId}_pointHistory`, JSON.stringify(cleaned));
          setMemberPointHistory(cleaned);
          
          // 포인트 잔액 재계산
          let balance = 0;
          const sorted = [...cleaned].sort((a: PointHistory, b: PointHistory) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
          sorted.forEach((h: PointHistory) => {
            balance += h.amount;
          });
          const finalBalance = Math.max(0, balance);
          localStorage.setItem(`member_${memberId}_points`, JSON.stringify(finalBalance));
          setMemberPoints(finalBalance);
        }
      } catch { /* ignore */ }
    }
    
    if (memberPoints < 0) {
      setMemberPoints(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // 데이터 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(`member_${memberId}_products`, JSON.stringify(memberProducts));
  }, [memberProducts, memberId]);
  
  useEffect(() => {
    localStorage.setItem(`member_${memberId}_points`, JSON.stringify(memberPoints));
  }, [memberPoints, memberId]);
  
  useEffect(() => {
    localStorage.setItem(`member_${memberId}_pointHistory`, JSON.stringify(memberPointHistory));
  }, [memberPointHistory, memberId]);

  useEffect(() => {
    localStorage.setItem(`member_${memberId}_attendance`, JSON.stringify(memberAttendance));
  }, [memberAttendance, memberId]);
  
  const member = { ...initialMember, products: memberProducts, point: memberPoints, pointHistory: memberPointHistory, attendanceRecords: memberAttendance };

  const productPriceMap: Record<string, number> = {
    '헬스 1개월': 100000,
    '헬스 3개월': 200000,
    '헬스 6개월': 350000,
    '헬스 12개월': 500000,
    'PT 10회': 800000,
    'PT 20회': 1300000,
    '운동복 대여': 0,
    '락커 이용권': 0,
  };

  const productOptions = Object.keys(productPriceMap);

  const handleProductFormChange = (field: string, value: string | number) => {
    setProductForm(prev => {
      const updated = { ...prev, [field]: value };

      if (field === 'product') {
        const price = productPriceMap[value as string] || 0;
        updated.productPrice = price;
        updated.salePrice = price;
        updated.receivedAmount = price;

        const periodMap: Record<string, string> = {
          '헬스 1개월': '1개월',
          '헬스 3개월': '3개월',
          '헬스 6개월': '6개월',
          '헬스 12개월': '12개월',
        };
        if (periodMap[value as string]) {
          updated.membershipPeriod = periodMap[value as string];
          const today = new Date();
          updated.exerciseStartDate = today.toISOString().split('T')[0];
          const endDate = new Date(today);
          const months = parseInt(periodMap[value as string]);
          endDate.setMonth(endDate.getMonth() + months);
          updated.exerciseEndDate = endDate.toISOString().split('T')[0];
        }
      }
      
      // 회원권 기간 선택 시 운동 시작일/종료일 자동 설정
      if (field === 'membershipPeriod') {
        const today = new Date();
        const startDateStr = today.toISOString().split('T')[0];
        updated.exerciseStartDate = startDateStr;
        
        // 종료일 계산
        const endDate = new Date(today);
        if (value === '1개월') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (value === '3개월') {
          endDate.setMonth(endDate.getMonth() + 3);
        } else if (value === '6개월') {
          endDate.setMonth(endDate.getMonth() + 6);
        } else if (value === '12개월') {
          endDate.setMonth(endDate.getMonth() + 12);
        }
        updated.exerciseEndDate = endDate.toISOString().split('T')[0];
      }
      
      // 운동 시작일 변경 시 종료일도 자동 조정
      if (field === 'exerciseStartDate' && prev.membershipPeriod) {
        const startDate = new Date(value as string);
        const endDate = new Date(startDate);
        if (prev.membershipPeriod === '1개월') {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (prev.membershipPeriod === '3개월') {
          endDate.setMonth(endDate.getMonth() + 3);
        } else if (prev.membershipPeriod === '6개월') {
          endDate.setMonth(endDate.getMonth() + 6);
        } else if (prev.membershipPeriod === '12개월') {
          endDate.setMonth(endDate.getMonth() + 12);
        }
        updated.exerciseEndDate = endDate.toISOString().split('T')[0];
      }
      
      return updated;
    });
  };

  const handlePointsChange = (value: number) => {
    const validValue = Math.min(Math.max(0, value), memberPoints);
    setProductForm(prev => ({ ...prev, usePoints: validValue }));
  };

  const handleAddAttendance = () => {
    if (!selectedAttendanceDate) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newRecord = { date: selectedAttendanceDate, time: timeStr };

    setMemberAttendance(prev => [newRecord, ...prev]);

    const autoEnabled = localStorage.getItem('auto_point_enabled');
    if (autoEnabled !== 'false') {
      const storedSettings = localStorage.getItem('auto_point_settings');
      if (storedSettings) {
        try {
          const autoEvents = JSON.parse(storedSettings);
          const attendanceEvent = autoEvents.find(
            (e: { eventType: string; isActive: boolean }) => e.eventType === 'ATTENDANCE' && e.isActive
          );

          if (attendanceEvent) {
            let grantAmount = 0;
            let reason = '';

            if (attendanceEvent.pointType === 'random' && attendanceEvent.randomMin != null && attendanceEvent.randomMax != null) {
              const min = attendanceEvent.randomMin;
              const max = attendanceEvent.randomMax;
              grantAmount = Math.floor(Math.random() * (max - min + 1)) + min;
              reason = `출석 포인트 (랜덤 ${min.toLocaleString()}~${max.toLocaleString()}P)`;
            } else {
              grantAmount = attendanceEvent.pointAmount || 0;
              reason = '출석 포인트 지급';
            }

            if (grantAmount > 0) {
              const newBalance = memberPoints + grantAmount;
              setMemberPoints(newBalance);
              setMemberPointHistory(prev => [{
                id: `ph_att_${Date.now()}`,
                type: 'earn',
                amount: grantAmount,
                balance: newBalance,
                reason,
                createdAt: `${selectedAttendanceDate} ${timeStr}`,
              }, ...prev]);
            }
          }
        } catch { /* ignore */ }
      }
    }

    setSelectedAttendanceDate(null);
    setShowAttendanceCalendar(false);
  };

  const getCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const days: { day: number; currentMonth: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, currentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false });
    }
    return days;
  };

  const formatDateStr = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isAttendanceDate = (dateStr: string) => {
    return memberAttendance.some(r => r.date === dateStr);
  };

  const getDayOfWeek = (dateStr: string) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  const handleRemoveAttendance = (idx: number) => {
    setMemberAttendance(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAssignProduct = () => {
    if (!productForm.product) return;
    
    // 상품 색상 랜덤 배정
    const colors: ('yellow' | 'blue' | 'green' | 'purple')[] = ['yellow', 'blue', 'green', 'purple'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // 운동 시작일/종료일 사용
    const startDateObj = productForm.exerciseStartDate ? new Date(productForm.exerciseStartDate) : new Date();
    const endDateObj = productForm.exerciseEndDate ? new Date(productForm.exerciseEndDate) : new Date();
    
    const startDate = `${startDateObj.getFullYear()}.${String(startDateObj.getMonth() + 1).padStart(2, '0')}.${String(startDateObj.getDate()).padStart(2, '0')}`;
    const endDate = `${endDateObj.getFullYear()}.${String(endDateObj.getMonth() + 1).padStart(2, '0')}.${String(endDateObj.getDate()).padStart(2, '0')}`;
    
    // 잔여일수 계산
    const remainingDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    const actualSalePrice = Math.max(0, productForm.salePrice - productForm.usePoints);
    const actualReceivedAmount = Math.max(0, productForm.receivedAmount - productForm.usePoints);

    // 새 상품 생성
    const newProduct = {
      id: `p${Date.now()}`,
      name: productForm.product,
      type: productForm.membershipPeriod || '일반회원권',
      color: randomColor,
      remainingDays: remainingDays,
      startDate: startDate,
      endDate: endDate,
      isActive: true,
      usedPoints: productForm.usePoints,
      salePrice: actualSalePrice,
      receivedAmount: actualReceivedAmount,
    };
    
    // 상품 목록에 추가
    setMemberProducts(prev => [...prev, newProduct]);

    const now = new Date();
    const dateTimeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    let currentBalance = memberPoints;
    const newHistoryEntries: PointHistory[] = [];
    
    // 포인트 사용 시 차감 및 이력 추가
    if (productForm.usePoints > 0) {
      currentBalance = Math.max(0, currentBalance - productForm.usePoints);
      
      newHistoryEntries.push({
        id: `ph${Date.now()}`,
        type: 'use',
        amount: -productForm.usePoints,
        balance: currentBalance,
        reason: `${productForm.product} 결제 사용`,
        createdAt: dateTimeStr,
      });
    }

    // 자동 지급 설정 확인 (신규등록/재등록)
    const autoEnabled = localStorage.getItem('auto_point_enabled');
    if (autoEnabled !== 'false') {
      const storedSettings = localStorage.getItem('auto_point_settings');
      if (storedSettings) {
        try {
          const autoEvents = JSON.parse(storedSettings);
          const hadFirstProduct = localStorage.getItem(`member_${memberId}_hadProduct`) === 'true';
          const eventType = hadFirstProduct ? 'RE_REGISTRATION' : 'NEW_REGISTRATION';
          const matchingEvent = autoEvents.find(
            (e: { eventType: string; isActive: boolean }) => e.eventType === eventType && e.isActive
          );

          if (matchingEvent) {
            let grantAmount = 0;
            let reason = '';

            if (matchingEvent.pointType === 'random' && matchingEvent.randomMin != null && matchingEvent.randomMax != null) {
              const min = matchingEvent.randomMin;
              const max = matchingEvent.randomMax;
              grantAmount = Math.floor(Math.random() * (max - min + 1)) + min;
              reason = hadFirstProduct
                ? `재등록 포인트 (랜덤 ${min.toLocaleString()}~${max.toLocaleString()}P)`
                : `신규 등록 포인트 (랜덤 ${min.toLocaleString()}~${max.toLocaleString()}P)`;
            } else if (matchingEvent.pointType === 'percentage' && matchingEvent.percentageRate > 0) {
              grantAmount = Math.floor(actualReceivedAmount * matchingEvent.percentageRate / 100);
              reason = hadFirstProduct
                ? `재등록 포인트 (받은 금액의 ${matchingEvent.percentageRate}%)`
                : `신규 등록 포인트 (받은 금액의 ${matchingEvent.percentageRate}%)`;
            } else {
              grantAmount = matchingEvent.pointAmount || 0;
              reason = hadFirstProduct ? '재등록 포인트 지급' : '신규 등록 포인트 지급';
            }

            if (grantAmount > 0) {
              currentBalance = currentBalance + grantAmount;
              newHistoryEntries.push({
                id: `ph${Date.now() + 1}`,
                type: 'earn',
                amount: grantAmount,
                balance: currentBalance,
                reason,
                createdAt: dateTimeStr,
              });
            }
          }
        } catch { /* ignore parse errors */ }
      }
      localStorage.setItem(`member_${memberId}_hadProduct`, 'true');
    }

    // 포인트 및 이력 반영
    if (newHistoryEntries.length > 0) {
      setMemberPoints(currentBalance);
      setMemberPointHistory(prev => [...newHistoryEntries.reverse(), ...prev]);
    }
    
    setShowProductModal(false);
    setProductForm({
      product: '',
      membershipPeriod: '',
      salesManager: '',
      exerciseStartDate: '',
      exerciseEndDate: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: '카드',
      productPrice: 0,
      salePrice: 0,
      receivedAmount: 0,
      usePoints: 0,
    });
  };

  const handleEditProduct = (productId: string) => {
    const product = memberProducts.find(p => p.id === productId);
    if (!product) return;
    
    const price = productPriceMap[product.name] || 0;
    const startDate = product.startDate.replace(/\./g, '-');
    const endDate = product.endDate.replace(/\./g, '-');

    let usedPoints = product.usedPoints || 0;

    if (usedPoints === 0) {
      const matchingHistory = memberPointHistory.find(
        h => h.type === 'use' && h.reason.includes(product.name) && h.reason.includes('결제 사용')
      );
      if (matchingHistory) {
        usedPoints = Math.abs(matchingHistory.amount);
      }
    }

    const savedSalePrice = product.salePrice !== undefined ? product.salePrice : Math.max(0, price - usedPoints);
    const savedReceivedAmount = product.receivedAmount !== undefined ? product.receivedAmount : Math.max(0, price - usedPoints);
    
    setProductForm({
      product: product.name,
      membershipPeriod: product.type,
      salesManager: '',
      exerciseStartDate: startDate,
      exerciseEndDate: endDate === '-' ? '' : endDate,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: '카드',
      productPrice: price,
      salePrice: savedSalePrice,
      receivedAmount: savedReceivedAmount,
      usePoints: usedPoints,
    });
    
    setEditingProductId(productId);
    setShowProductModal(true);
    setProductMenuOpen(null);
  };

  const handleUpdateProduct = () => {
    if (!editingProductId) return;
    
    const startDateObj = productForm.exerciseStartDate ? new Date(productForm.exerciseStartDate) : new Date();
    const endDateObj = productForm.exerciseEndDate ? new Date(productForm.exerciseEndDate) : new Date();
    
    const startDate = `${startDateObj.getFullYear()}.${String(startDateObj.getMonth() + 1).padStart(2, '0')}.${String(startDateObj.getDate()).padStart(2, '0')}`;
    const endDate = `${endDateObj.getFullYear()}.${String(endDateObj.getMonth() + 1).padStart(2, '0')}.${String(endDateObj.getDate()).padStart(2, '0')}`;
    const remainingDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    setMemberProducts(prev => prev.map(p => {
      if (p.id === editingProductId) {
        return {
          ...p,
          type: productForm.membershipPeriod || p.type,
          remainingDays,
          startDate,
          endDate,
          salePrice: productForm.salePrice,
          receivedAmount: productForm.receivedAmount,
        };
      }
      return p;
    }));
    
    if (productForm.usePoints > 0) {
      const newBalance = memberPoints - productForm.usePoints;
      setMemberPoints(newBalance);
      
      const now = new Date();
      const dateTimeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newPointHistory: PointHistory = {
        id: `ph${Date.now()}`,
        type: 'use',
        amount: -productForm.usePoints,
        balance: newBalance,
        reason: `${productForm.product} 결제 수정 사용`,
        createdAt: dateTimeStr,
      };
      
      setMemberPointHistory(prev => [newPointHistory, ...prev]);
    }
    
    setShowProductModal(false);
    setEditingProductId(null);
    setProductForm({
      product: '',
      membershipPeriod: '',
      salesManager: '',
      exerciseStartDate: '',
      exerciseEndDate: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: '카드',
      productPrice: 0,
      salePrice: 0,
      receivedAmount: 0,
      usePoints: 0,
    });
  };

  const handleInlinePointGrant = () => {
    if (!inlineGrantAmount || inlineGrantAmount <= 0 || !inlineGrantReason) return;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newBalance = memberPoints + inlineGrantAmount;

    setMemberPoints(newBalance);
    setMemberPointHistory(prev => [{
      id: `ph${Date.now()}`,
      type: 'earn' as const,
      amount: inlineGrantAmount,
      balance: newBalance,
      reason: inlineGrantReason,
      createdAt: dateStr,
    }, ...prev]);

    setShowInlineGrant(false);
    setInlineGrantAmount(1000);
    setInlineGrantReason('');
  };

  const handleOpenRefundModal = (productId: string) => {
    const product = memberProducts.find(p => p.id === productId);
    if (!product) return;
    
    const price = product.salePrice !== undefined ? product.salePrice : (productPriceMap[product.name] || 0);
    
    setRefundProductId(productId);
    setRefundDate(new Date().toISOString().split('T')[0]);
    setRefundMethod('카드');
    setRefundAmount(price);
    setRefundReason('');
    setRefundChecked({ [productId]: true });
    setShowRefundModal(true);
    setProductMenuOpen(null);
  };

  const findAutoGrantForProduct = (product: Product) => {
    const productDate = product.startDate?.replace(/\./g, '-');
    return memberPointHistory.find(
      h => h.type === 'earn'
        && (h.reason.includes('신규 등록 포인트') || h.reason.includes('재등록 포인트'))
        && productDate && h.createdAt.startsWith(productDate)
    );
  };

  const reclaimAutoGrantPoints = (product: Product, currentBalance: number, dateStr: string, reasonPrefix: string) => {
    const autoGrant = findAutoGrantForProduct(product);
    if (!autoGrant) return { balance: currentBalance, entries: [] as PointHistory[] };

    const reclaimAmount = autoGrant.amount;
    const newBalance = Math.max(0, currentBalance - reclaimAmount);
    const entry: PointHistory = {
      id: `ph${Date.now() + 2}`,
      type: 'use',
      amount: -reclaimAmount,
      balance: newBalance,
      reason: `${reasonPrefix} 자동 지급 포인트 회수`,
      createdAt: dateStr,
    };
    return { balance: newBalance, entries: [entry] };
  };

  const handleConfirmRefund = () => {
    if (!refundProductId) return;
    
    const product = memberProducts.find(p => p.id === refundProductId);
    if (!product) return;

    let usedPoints = product.usedPoints || 0;
    if (usedPoints === 0) {
      const matchingHistory = memberPointHistory.find(
        h => h.type === 'use' && h.reason.includes(product.name) && h.reason.includes('결제 사용')
      );
      if (matchingHistory) {
        usedPoints = Math.abs(matchingHistory.amount);
      }
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    let currentBalance = memberPoints;
    const newEntries: PointHistory[] = [];

    if (usedPoints > 0) {
      currentBalance = currentBalance + usedPoints;
      newEntries.push({
        id: `ph${Date.now()}`,
        type: 'earn' as const,
        amount: usedPoints,
        balance: currentBalance,
        reason: '회원권 환불',
        createdAt: dateStr,
      });
    }

    const reclaim = reclaimAutoGrantPoints(product, currentBalance, dateStr, '회원권 환불');
    currentBalance = reclaim.balance;
    newEntries.push(...reclaim.entries);

    setMemberPoints(currentBalance);
    if (newEntries.length > 0) {
      setMemberPointHistory(prev => [...newEntries.reverse(), ...prev]);
    }

    setMemberProducts(prev => prev.filter(p => p.id !== refundProductId));
    setShowRefundModal(false);
    setRefundProductId(null);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = memberProducts.find(p => p.id === productId);
    if (!product) return;

    let usedPoints = product.usedPoints || 0;
    if (usedPoints === 0) {
      const matchingHistory = memberPointHistory.find(
        h => h.type === 'use' && h.reason.includes(product.name) && h.reason.includes('결제 사용')
      );
      if (matchingHistory) {
        usedPoints = Math.abs(matchingHistory.amount);
      }
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    let currentBalance = memberPoints;
    const newEntries: PointHistory[] = [];

    if (usedPoints > 0) {
      currentBalance = currentBalance + usedPoints;
      newEntries.push({
        id: `ph${Date.now()}`,
        type: 'earn' as const,
        amount: usedPoints,
        balance: currentBalance,
        reason: `${product.name} 결제취소 포인트 반환`,
        createdAt: dateStr,
      });
    }

    const reclaim = reclaimAutoGrantPoints(product, currentBalance, dateStr, `${product.name} 결제취소`);
    currentBalance = reclaim.balance;
    newEntries.push(...reclaim.entries);

    setMemberPoints(currentBalance);
    if (newEntries.length > 0) {
      setMemberPointHistory(prev => [...newEntries.reverse(), ...prev]);
    }

    setMemberProducts(prev => prev.filter(p => p.id !== productId));
    setProductMenuOpen(null);
  };

  // 포인트 차감 후 금액 계산
  const finalSalePrice = Math.max(0, productForm.salePrice - productForm.usePoints);
  const finalReceivedAmount = Math.max(0, productForm.receivedAmount - productForm.usePoints);

  const formatDateWithDay = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dayName = days[date.getDay()];
    return `${year}.${month}.${day} (${dayName})`;
  };

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
          {memberId === '2' ? (
            <img src="/test-profile.png" alt="" className="member-avatar-large" />
          ) : (
            <div className="member-avatar-large" />
          )}
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
            <div className="info-item clickable" onClick={() => setShowPointHistory(true)}>
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
            <button className="add-btn" onClick={() => { setEditingProductId(null); setShowProductModal(true); }}><Plus size={20} /></button>
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
                  <div className="product-menu-wrapper">
                    <button 
                      className="more-btn"
                      onClick={() => setProductMenuOpen(productMenuOpen === product.id ? null : product.id)}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {productMenuOpen === product.id && (
                      <div className="product-dropdown-menu">
                        <button className="dropdown-item" onClick={() => setProductMenuOpen(null)}>재등록</button>
                        <button className="dropdown-item" onClick={() => setProductMenuOpen(null)}>재등록 결제링크 전송</button>
                        <button className="dropdown-item" onClick={() => setProductMenuOpen(null)}>홀딩</button>
                        <button className="dropdown-item" onClick={() => setProductMenuOpen(null)}>기간 연장</button>
                        <button className="dropdown-item" onClick={() => setProductMenuOpen(null)}>양도</button>
                        <button className="dropdown-item" onClick={() => handleEditProduct(product.id)}>결제 수정</button>
                        <button className="dropdown-item refund" onClick={() => handleOpenRefundModal(product.id)}>환불</button>
                        <button className="dropdown-item delete" onClick={() => handleDeleteProduct(product.id)}>상품 삭제(결제취소)</button>
                      </div>
                    )}
                  </div>
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
            <div className="attendance-header-actions">
              <div className="view-toggle-group">
                <button
                  className={`view-toggle-btn${attendanceViewMode === 'list' ? ' active' : ''}`}
                  onClick={() => setAttendanceViewMode('list')}
                >
                  <List size={16} />
                </button>
                <button
                  className={`view-toggle-btn${attendanceViewMode === 'calendar' ? ' active' : ''}`}
                  onClick={() => setAttendanceViewMode('calendar')}
                >
                  <CalendarDays size={16} />
                </button>
              </div>
              <button className="add-btn" onClick={() => {
                setShowAttendanceCalendar(!showAttendanceCalendar);
                setSelectedAttendanceDate(null);
              }}><Plus size={20} /></button>
            </div>
          </div>

          {showAttendanceCalendar && (
            <div className="attendance-calendar add-calendar">
              <div className="calendar-nav">
                <button onClick={() => {
                  if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
                  else setCalendarMonth(m => m - 1);
                }}><ChevronLeft size={16} /></button>
                <span className="calendar-title">{calendarYear}년 {calendarMonth + 1}월</span>
                <button onClick={() => {
                  if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
                  else setCalendarMonth(m => m + 1);
                }}><ChevronRight size={16} /></button>
              </div>
              <div className="calendar-grid">
                <div className="calendar-header-row">
                  {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                    <div key={d} className="calendar-header-cell">{d}</div>
                  ))}
                </div>
                {Array.from({ length: 6 }, (_, weekIdx) => (
                  <div key={weekIdx} className="calendar-week-row">
                    {getCalendarDays(calendarYear, calendarMonth).slice(weekIdx * 7, weekIdx * 7 + 7).map((cell, cellIdx) => {
                      const dateStr = cell.currentMonth ? formatDateStr(calendarYear, calendarMonth, cell.day) : '';
                      const isSelected = selectedAttendanceDate === dateStr;
                      const isToday = dateStr === new Date().toISOString().split('T')[0];
                      const hasAttendance = cell.currentMonth && isAttendanceDate(dateStr);
                      return (
                        <div
                          key={cellIdx}
                          className={`calendar-day-cell${!cell.currentMonth ? ' other-month' : ''}${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}${hasAttendance ? ' attended' : ''}`}
                          onClick={() => cell.currentMonth && setSelectedAttendanceDate(dateStr)}
                        >
                          {cell.day}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="calendar-actions">
                <button className="btn-calendar-cancel" onClick={() => { setShowAttendanceCalendar(false); setSelectedAttendanceDate(null); }}>취소</button>
                <button
                  className={`btn-calendar-add${selectedAttendanceDate ? ' active' : ''}`}
                  disabled={!selectedAttendanceDate}
                  onClick={handleAddAttendance}
                >출석 추가</button>
              </div>
            </div>
          )}

          <div className="attendance-content">
            {attendanceViewMode === 'list' ? (
              member.attendanceRecords.length > 0 ? (
                <div className="attendance-list-view">
                  {member.attendanceRecords.map((record, idx) => (
                    <div key={idx} className="attendance-list-item">
                      <div className="attendance-list-dot" />
                      <span className="attendance-list-date">
                        {record.date.replace(/-/g, '.')} ({getDayOfWeek(record.date)})
                      </span>
                      <span className="attendance-list-time">{record.time}</span>
                      <button className="attendance-remove-btn" onClick={() => handleRemoveAttendance(idx)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">출석 기록이 없어요.</div>
              )
            ) : (
              <div className="attendance-calendar-view">
                <div className="calendar-nav">
                  <button onClick={() => {
                    if (viewCalendarMonth === 0) { setViewCalendarMonth(11); setViewCalendarYear(y => y - 1); }
                    else setViewCalendarMonth(m => m - 1);
                  }}><ChevronLeft size={16} /></button>
                  <span className="calendar-title">{viewCalendarYear}년 {String(viewCalendarMonth + 1).padStart(2, '0')}월</span>
                  <button onClick={() => {
                    if (viewCalendarMonth === 11) { setViewCalendarMonth(0); setViewCalendarYear(y => y + 1); }
                    else setViewCalendarMonth(m => m + 1);
                  }}><ChevronRight size={16} /></button>
                </div>
                <div className="calendar-grid">
                  <div className="calendar-header-row">
                    {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                      <div key={d} className="calendar-header-cell">{d}</div>
                    ))}
                  </div>
                  {Array.from({ length: 6 }, (_, weekIdx) => (
                    <div key={weekIdx} className="calendar-week-row">
                      {getCalendarDays(viewCalendarYear, viewCalendarMonth).slice(weekIdx * 7, weekIdx * 7 + 7).map((cell, cellIdx) => {
                        const dateStr = cell.currentMonth ? formatDateStr(viewCalendarYear, viewCalendarMonth, cell.day) : '';
                        const isToday = dateStr === new Date().toISOString().split('T')[0];
                        const hasAttendance = cell.currentMonth && isAttendanceDate(dateStr);
                        return (
                          <div
                            key={cellIdx}
                            className={`calendar-day-cell${!cell.currentMonth ? ' other-month' : ''}${isToday ? ' today' : ''}${hasAttendance ? ' attended' : ''}`}
                          >
                            {cell.day}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
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

      {/* 상품 배정/수정 모달 */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => { setShowProductModal(false); setEditingProductId(null); }}>
          <div className="product-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-body">
              {/* 상품 선택 */}
              <div className="form-group">
                {editingProductId ? (
                  <div className="form-select full-width disabled-select">
                    {productForm.product}
                  </div>
                ) : (
                  <select
                    className="form-select full-width"
                    value={productForm.product}
                    onChange={e => handleProductFormChange('product', e.target.value)}
                  >
                    <option value="">상품을 선택해주세요</option>
                    {productOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* 회원권 기간 선택, 결제와 세일즈 담당자 */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">회원권 기간 선택</label>
                  <select
                    className="form-select"
                    value={productForm.membershipPeriod}
                    onChange={e => handleProductFormChange('membershipPeriod', e.target.value)}
                  >
                    <option value="">선택해 주세요.</option>
                    <option value="1개월">1개월</option>
                    <option value="3개월">3개월</option>
                    <option value="6개월">6개월</option>
                    <option value="12개월">12개월</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">결제와 세일즈 담당자(선택)</label>
                  <select
                    className="form-select"
                    value={productForm.salesManager}
                    onChange={e => handleProductFormChange('salesManager', e.target.value)}
                  >
                    <option value="">선택해 주세요.</option>
                    <option value="담당자1">담당자1</option>
                    <option value="담당자2">담당자2</option>
                  </select>
                </div>
              </div>

              {/* 운동 기간 */}
              <div className="form-group">
                <label className="form-label">운동 기간</label>
                <div className="date-range-row">
                  <input
                    type="date"
                    className="form-date-input"
                    value={productForm.exerciseStartDate}
                    onChange={e => handleProductFormChange('exerciseStartDate', e.target.value)}
                    placeholder="운동 시작일"
                  />
                  <span className="date-separator">~</span>
                  <input
                    type="date"
                    className="form-date-input dark"
                    value={productForm.exerciseEndDate}
                    onChange={e => handleProductFormChange('exerciseEndDate', e.target.value)}
                    placeholder="운동 종료일"
                  />
                </div>
              </div>

              {/* 결제일 */}
              <div className="form-group">
                <label className="form-label">결제일</label>
                <select
                  className="form-select"
                  value={productForm.paymentDate}
                  onChange={e => handleProductFormChange('paymentDate', e.target.value)}
                >
                  <option value={productForm.paymentDate}>{formatDateWithDay(productForm.paymentDate)}</option>
                </select>
              </div>

              {/* 결제수단 */}
              <div className="form-group">
                <div className="payment-method-header">
                  <label className="form-label">결제수단</label>
                  <span className="payment-promo">다짐 결제링크로 최대 7개월 무이자 할부 결제가 가능해요.</span>
                </div>
                <div className="payment-method-row">
                  <select
                    className="form-select payment-select"
                    value={productForm.paymentMethod}
                    onChange={e => handleProductFormChange('paymentMethod', e.target.value)}
                  >
                    <option value="카드">카드</option>
                    <option value="현금">현금</option>
                    <option value="계좌이체">계좌이체</option>
                  </select>
                  <a href="#" className="installment-link">이번달 무이자 할부 보기</a>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className="price-row">
                <div className="price-item">
                  <label className="form-label">상품 가격</label>
                  <div className="price-input-wrapper disabled">
                    <input
                      type="text"
                      className="price-input"
                      value={productForm.productPrice.toLocaleString()}
                      readOnly
                    />
                    <span className="price-suffix">원</span>
                  </div>
                </div>
                <div className="price-item">
                  <label className="form-label">판매금액</label>
                  <div className="price-input-wrapper">
                    <input
                      type="text"
                      className="price-input"
                      value={productForm.salePrice ? productForm.salePrice.toLocaleString() : ''}
                      onChange={e => {
                        const num = parseInt(e.target.value.replace(/,/g, '')) || 0;
                        handleProductFormChange('salePrice', num);
                      }}
                    />
                    <span className="price-suffix">원</span>
                  </div>
                  {!editingProductId && productForm.usePoints > 0 && (
                    <span className="price-discount">포인트 적용: {finalSalePrice.toLocaleString()}원</span>
                  )}
                </div>
                <div className="price-item">
                  <label className="form-label">받은 금액</label>
                  <div className="price-input-wrapper">
                    <input
                      type="text"
                      className="price-input"
                      value={productForm.receivedAmount ? productForm.receivedAmount.toLocaleString() : ''}
                      onChange={e => {
                        const num = parseInt(e.target.value.replace(/,/g, '')) || 0;
                        handleProductFormChange('receivedAmount', num);
                      }}
                    />
                    <span className="price-suffix">원</span>
                  </div>
                  {!editingProductId && productForm.usePoints > 0 && (
                    <span className="price-discount">포인트 적용: {finalReceivedAmount.toLocaleString()}원</span>
                  )}
                </div>
              </div>

              {/* 포인트: 배정 시 입력 가능, 수정 시 조회만 */}
              {editingProductId ? (
                <div className="point-usage-section">
                  <div className="point-usage-header">
                    <label className="form-label">사용된 포인트</label>
                  </div>
                  <div className="price-input-wrapper disabled">
                    <input
                      type="text"
                      className="price-input"
                      value={productForm.usePoints ? productForm.usePoints.toLocaleString() : '0'}
                      readOnly
                    />
                    <span className="price-suffix">P</span>
                  </div>
                </div>
              ) : (
                <div className="point-usage-section">
                  <div className="point-usage-header">
                    <label className="form-label">포인트 사용</label>
                    <span className="available-points">
                      사용 가능: <strong>{member.point.toLocaleString()}P</strong>
                    </span>
                  </div>
                  <div className="point-usage-input-row">
                    <div className="price-input-wrapper point-input-wrapper">
                      <input
                        type="text"
                        className="price-input"
                        value={productForm.usePoints ? productForm.usePoints.toLocaleString() : ''}
                        onChange={e => {
                          const num = parseInt(e.target.value.replace(/,/g, '')) || 0;
                          handlePointsChange(num);
                        }}
                        placeholder="0"
                      />
                      <span className="price-suffix">P</span>
                    </div>
                    <button 
                      type="button" 
                      className="use-all-points-btn"
                      onClick={() => handlePointsChange(member.point)}
                    >
                      전액 사용
                    </button>
                  </div>
                  {productForm.usePoints > member.point && (
                    <span className="point-error">보유 포인트를 초과할 수 없습니다.</span>
                  )}
                </div>
              )}

              {/* 결제수단 추가 버튼 */}
              <button className="add-payment-btn">결제수단 추가</button>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => { setShowProductModal(false); setEditingProductId(null); }}>취소</button>
              <button 
                className="btn-assign"
                onClick={editingProductId ? handleUpdateProduct : handleAssignProduct}
                disabled={!productForm.product}
              >
                {editingProductId ? '수정하기' : '배정하기'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 포인트 이력 팝업 */}
      {showPointHistory && (
        <div className="point-history-overlay" onClick={() => setShowPointHistory(false)}>
          <div className="point-history-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3 className="popup-title">포인트 이력</h3>
              <div className="popup-header-actions">
                <button
                  className="inline-grant-toggle"
                  onClick={() => setShowInlineGrant(!showInlineGrant)}
                >
                  {showInlineGrant ? '취소' : '포인트 지급'}
                </button>
                <button className="popup-close" onClick={() => setShowPointHistory(false)}>
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="popup-content">
              <div className="current-point-info">
                <span className="current-point-label">현재 보유 포인트</span>
                <span className="current-point-value">{member.point.toLocaleString()}P</span>
              </div>
              {showInlineGrant && (
                <div className="inline-grant-form">
                  <div className="inline-grant-row">
                    <label className="inline-grant-label">지급 포인트</label>
                    <div className="inline-grant-input-wrapper">
                      <input
                        type="number"
                        className="inline-grant-input"
                        value={inlineGrantAmount}
                        onChange={e => setInlineGrantAmount(parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                      <span className="inline-grant-suffix">P</span>
                    </div>
                  </div>
                  <div className="inline-grant-row">
                    <label className="inline-grant-label">지급 사유</label>
                    <input
                      type="text"
                      className="inline-grant-reason"
                      value={inlineGrantReason}
                      onChange={e => setInlineGrantReason(e.target.value)}
                      placeholder="예: 이벤트 포인트 지급"
                    />
                  </div>
                  <button
                    className="inline-grant-btn"
                    onClick={handleInlinePointGrant}
                    disabled={!inlineGrantAmount || inlineGrantAmount <= 0 || !inlineGrantReason}
                  >
                    지급하기
                  </button>
                </div>
              )}
              <div className="point-history-list">
                {member.pointHistory.map(history => (
                    <div key={history.id} className="point-history-item">
                      <div className="history-left">
                        <span className={`history-type ${history.type}`}>
                          {history.type === 'earn' ? '지급' : '사용'}
                        </span>
                        <div className="history-info">
                          <span className="history-reason">{history.reason}</span>
                          <span className="history-date">{history.createdAt.split(' ')[0]}</span>
                        </div>
                      </div>
                      <div className="history-right">
                        <span className={`history-amount ${history.type}`}>
                          {history.type === 'earn' ? '+' : ''}{history.amount.toLocaleString()}P
                        </span>
                        <span className="history-balance">잔액 {history.balance.toLocaleString()}P</span>
                      </div>
                    </div>
                  ))}
                {member.pointHistory.length === 0 && (
                  <div className="empty-history">포인트 이력이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 환불 모달 */}
      {showRefundModal && refundProductId && (() => {
        const refundProduct = memberProducts.find(p => p.id === refundProductId);
        if (!refundProduct) return null;
        
        const productPrice = refundProduct.salePrice !== undefined 
          ? refundProduct.salePrice 
          : (productPriceMap[refundProduct.name] || 0);
        const usedPoints = refundProduct.usedPoints || 0;
        const totalPaid = productPrice + usedPoints;
        
        const allRefundProducts = memberProducts.filter(p => 
          p.startDate === refundProduct.startDate && p.isActive
        );
        
        const totalRefundable = allRefundProducts.reduce((sum, p) => {
          const price = p.salePrice !== undefined ? p.salePrice : (productPriceMap[p.name] || 0);
          return sum + price;
        }, 0);

        const _checkedProducts = allRefundProducts.filter(p => refundChecked[p.id]);
        void _checkedProducts;

        return (
          <div className="modal-overlay" onClick={() => setShowRefundModal(false)}>
            <div className="refund-modal" onClick={e => e.stopPropagation()}>
              <h2 className="refund-modal-title">환불하기</h2>

              <div className="refund-layout">
                <div className="refund-left">
                  <h4 className="refund-section-title">환불할 상품</h4>

                  {allRefundProducts.map(p => {
                    const pPrice = p.salePrice !== undefined ? p.salePrice : (productPriceMap[p.name] || 0);
                    const isChecked = !!refundChecked[p.id];
                    return (
                      <div key={p.id} className="refund-product-item">
                        <div className="refund-product-header">
                          <label className="refund-checkbox-label">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={e => {
                                const newChecked = { ...refundChecked, [p.id]: e.target.checked };
                                setRefundChecked(newChecked);
                                const newTotal = allRefundProducts
                                  .filter(pr => newChecked[pr.id])
                                  .reduce((s, pr) => {
                                    const pp = pr.salePrice !== undefined ? pr.salePrice : (productPriceMap[pr.name] || 0);
                                    return s + pp;
                                  }, 0);
                                setRefundAmount(newTotal);
                              }}
                            />
                            <span className="refund-checkbox-custom" />
                          </label>
                          <div className="refund-product-info">
                            <div className="refund-product-avatar" />
                            <span className="refund-product-name">
                              {member.name}
                            </span>
                            <span className="refund-product-detail">
                              {p.name}({p.type}) {pPrice.toLocaleString()}원 {p.startDate} 결제
                            </span>
                            <span className="refund-payment-badge">카드</span>
                          </div>
                        </div>

                        {isChecked && (
                          <div className="refund-detail-row">
                            <div className="refund-detail-item">
                              <label className="refund-detail-label">환불날짜</label>
                              <input
                                type="date"
                                className="refund-detail-input"
                                value={refundDate}
                                onChange={e => setRefundDate(e.target.value)}
                              />
                            </div>
                            <div className="refund-detail-item">
                              <label className="refund-detail-label">환불수단</label>
                              <select
                                className="refund-detail-select"
                                value={refundMethod}
                                onChange={e => setRefundMethod(e.target.value)}
                              >
                                <option value="카드">카드</option>
                                <option value="계좌이체">계좌이체</option>
                                <option value="현금">현금</option>
                              </select>
                            </div>
                            <div className="refund-detail-item">
                              <label className="refund-detail-label highlight">환불가능금액</label>
                              <div className="refund-amount-display">
                                {pPrice.toLocaleString()} 원
                              </div>
                            </div>
                            <div className="refund-detail-item">
                              <label className="refund-detail-label">환불금액</label>
                              <div className="refund-amount-input-wrapper">
                                <input
                                  type="text"
                                  className="refund-amount-input"
                                  value={refundAmount.toLocaleString()}
                                  onChange={e => {
                                    const num = parseInt(e.target.value.replace(/,/g, '')) || 0;
                                    setRefundAmount(num);
                                  }}
                                />
                                <span className="refund-amount-suffix">원</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="refund-reason-section">
                    <label className="refund-reason-label">환불사유(선택)</label>
                    <input
                      type="text"
                      className="refund-reason-input"
                      placeholder="텍스트를 입력해 주세요."
                      value={refundReason}
                      onChange={e => setRefundReason(e.target.value)}
                    />
                  </div>
                </div>

                <div className="refund-right">
                  <div className="refund-summary-card">
                    <div className="refund-summary-row">
                      <span className="refund-summary-label">총 결제금액</span>
                      <span className="refund-summary-value">{totalPaid.toLocaleString()}원</span>
                    </div>
                  </div>
                  {usedPoints > 0 && (
                    <div className="refund-summary-card">
                      <div className="refund-summary-row">
                        <span className="refund-summary-label">사용 포인트</span>
                        <span className="refund-summary-value">{usedPoints.toLocaleString()}P</span>
                      </div>
                    </div>
                  )}
                  <div className="refund-summary-card highlight">
                    <div className="refund-summary-row">
                      <span className="refund-summary-label">총 환불가능금액</span>
                      <span className="refund-summary-value highlight">{totalRefundable.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="refund-modal-footer">
                <button className="btn-cancel" onClick={() => setShowRefundModal(false)}>취소</button>
                <button className="btn-refund-confirm" onClick={handleConfirmRefund}>
                  {refundAmount.toLocaleString()}원 환불하기
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default MemberDetail;
