import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Mail, Edit2, Trash2, Plus, MoreHorizontal, ChevronRight, ArrowLeft, X } from 'lucide-react';
import './MemberDetail.css';

interface PointHistory {
  id: string;
  type: 'earn' | 'use';
  amount: number;
  balance: number;
  reason: string;
  createdAt: string;
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
  products: {
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
      { id: 'ph1', type: 'earn', amount: 5000, balance: 5000, reason: '새해 이벤트 포인트', createdAt: '2026-01-01 10:00' },
      { id: 'ph2', type: 'use', amount: -3000, balance: 2000, reason: '포인트 사용', createdAt: '2026-01-20 14:30' },
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
      { id: 'ph_t1', type: 'earn', amount: 3000, balance: 3000, reason: '신규 가입 포인트 지급', createdAt: '2026-01-10' },
      { id: 'ph_t2', type: 'earn', amount: 2000, balance: 5000, reason: '출석 이벤트 포인트 지급', createdAt: '2026-02-15' },
      { id: 'ph_t3', type: 'use', amount: -1500, balance: 3500, reason: 'PT 10회 결제 사용', createdAt: '2026-03-05' },
      { id: 'ph_t4', type: 'earn', amount: 5000, balance: 8500, reason: '재등록 보너스 포인트 지급', createdAt: '2026-03-20' },
      { id: 'ph_t5', type: 'use', amount: -3000, balance: 5500, reason: '헬스 3개월 결제 사용', createdAt: '2026-04-01' },
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
  const [productMenuOpen, setProductMenuOpen] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  
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
  const loadStoredProducts = () => {
    const stored = localStorage.getItem(`member_${memberId}_products`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialMember.products;
      }
    }
    return initialMember.products;
  };
  
  const loadStoredPoints = () => {
    const stored = localStorage.getItem(`member_${memberId}_points`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialMember.point;
      }
    }
    return initialMember.point;
  };
  
  const loadStoredPointHistory = () => {
    const stored = localStorage.getItem(`member_${memberId}_pointHistory`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialMember.pointHistory;
      }
    }
    return initialMember.pointHistory;
  };
  
  const [memberProducts, setMemberProducts] = useState(loadStoredProducts);
  const [memberPoints, setMemberPoints] = useState(loadStoredPoints);
  const [memberPointHistory, setMemberPointHistory] = useState(loadStoredPointHistory);
  
  // memberId 변경 시 데이터 다시 로드
  useEffect(() => {
    setMemberProducts(loadStoredProducts());
    setMemberPoints(loadStoredPoints());
    setMemberPointHistory(loadStoredPointHistory());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberId]);

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
  
  const member = { ...initialMember, products: memberProducts, point: memberPoints, pointHistory: memberPointHistory };

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
    // 보유 포인트보다 크면 보유 포인트로 제한
    const validValue = Math.min(Math.max(0, value), memberPoints);
    setProductForm(prev => ({ ...prev, usePoints: validValue }));
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
    
    // 포인트 사용 시 차감 및 이력 추가
    if (productForm.usePoints > 0) {
      const newBalance = Math.max(0, memberPoints - productForm.usePoints);
      setMemberPoints(newBalance);
      
      // 포인트 이력 추가
      const now = new Date();
      const dateTimeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newPointHistory: PointHistory = {
        id: `ph${Date.now()}`,
        type: 'use',
        amount: -productForm.usePoints,
        balance: newBalance,
        reason: `${productForm.product} 결제 사용`,
        createdAt: dateTimeStr,
      };
      
      setMemberPointHistory(prev => [newPointHistory, ...prev]);
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

  const refundProductPoints = (productId: string) => {
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

    if (usedPoints > 0) {
      // 해당 상품의 결제 사용 이력 삭제
      setMemberPointHistory(prev => 
        prev.filter(h => !(h.type === 'use' && h.reason.includes(product.name) && h.reason.includes('결제 사용')))
      );
      // 포인트 반환
      setMemberPoints(prev => prev + usedPoints);
    }
  };

  const handleRefundProduct = (productId: string) => {
    refundProductPoints(productId);
    setMemberProducts(prev => prev.filter(p => p.id !== productId));
    setProductMenuOpen(null);
  };

  const handleDeleteProduct = (productId: string) => {
    refundProductPoints(productId);
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
                        <button className="dropdown-item refund" onClick={() => handleRefundProduct(product.id)}>환불</button>
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
              <button className="popup-close" onClick={() => setShowPointHistory(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="popup-content">
              <div className="current-point-info">
                <span className="current-point-label">현재 보유 포인트</span>
                <span className="current-point-value">{member.point.toLocaleString()}P</span>
              </div>
              <div className="point-history-list">
                {[...member.pointHistory]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(history => (
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
    </div>
  );
};

export default MemberDetail;
