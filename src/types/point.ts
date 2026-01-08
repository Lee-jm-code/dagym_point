// 포인트 이벤트 타입
export type PointEventType = 
  | 'NEW_REGISTRATION'      // 신규 등록
  | 'RE_REGISTRATION'       // 재등록
  | 'ATTENDANCE'            // 출석
  | 'PROMOTION';            // 프로모션

// 포인트 사유
export type PointReason = 
  | 'NEW_REGISTRATION'
  | 'RE_REGISTRATION' 
  | 'ATTENDANCE'
  | 'PROMOTION'
  | 'MANUAL_GRANT'          // 수동 지급
  | 'BATCH_GRANT'           // 일괄 지급
  | 'PAYMENT_USE'           // 결제 사용
  | 'PAYMENT_CANCEL'        // 결제 취소 환급
  | 'EXPIRATION';           // 만료 소멸

// 자동 지급 이벤트 설정
export interface AutoPointEvent {
  id: string;
  eventType: PointEventType;
  eventName: string;
  description: string;
  isActive: boolean;
  pointAmount: number;
  allowDuplicate: boolean;
  duplicateCondition?: string;
  startDate?: string;
  endDate?: string;
}

// 포인트 트랜잭션 (적립/사용 내역)
export interface PointTransaction {
  id: string;
  memberId: string;
  memberName: string;
  type: 'EARN' | 'USE' | 'EXPIRE' | 'CANCEL';
  amount: number;
  balance: number;
  reason: PointReason;
  reasonLabel: string;
  createdAt: string;
}

// 포인트 정책 설정
export interface PointPolicy {
  expirationMonths: number;
  minUsageAmount: number;
  maxUsagePerTransaction: number;
  usableProducts: {
    membership: boolean;
    lesson: boolean;
    locker: boolean;
    etc: boolean;
  };
}

// 회원 필터
export interface MemberFilter {
  gender?: 'all' | 'male' | 'female';
  memberType?: 'all' | 'new' | 'existing';
  membershipStatus?: 'all' | 'active' | 'expired';
  membershipIds?: string[];
}

// 일괄 지급 요청
export interface BatchGrantRequest {
  pointAmount: number;
  reason: string;
  filter: MemberFilter;
}

// 대시보드 통계
export interface PointStats {
  totalIssued: number;
  totalUsed: number;
  totalExpired: number;
  availableBalance: number;
  monthlyIssued: number;
  monthlyUsed: number;
}

