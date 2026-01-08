import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  CreditCard, 
  UserCog, 
  Wallet, 
  DoorOpen, 
  Settings,
  ChevronDown,
  ChevronRight,
  Coins
} from 'lucide-react';
import './Sidebar.css';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: { id: string; label: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: '출석/대시보드', icon: <LayoutDashboard size={20} />, path: '/' },
  { id: 'members', label: '회원', icon: <Users size={20} />, path: '/members' },
  { id: 'products', label: '상품', icon: <Package size={20} />, path: '/products' },
  { id: 'schedule', label: '일정', icon: <Calendar size={20} />, path: '/schedule' },
  { id: 'community', label: '커뮤니티', icon: <MessageSquare size={20} />, path: '/community' },
  { id: 'sales', label: '매출', icon: <BarChart3 size={20} />, path: '/sales' },
  { id: 'expense', label: '비용', icon: <CreditCard size={20} />, path: '/expense' },
  { id: 'staff', label: '구성원', icon: <UserCog size={20} />, path: '/staff' },
  { id: 'payroll', label: '급여정산', icon: <Wallet size={20} />, path: '/payroll' },
  { id: 'locker', label: '락커', icon: <DoorOpen size={20} />, path: '/locker' },
  { id: 'message', label: '메시지', icon: <MessageSquare size={20} />, path: '/message' },
  { id: 'kiosk', label: '키오스크/출입', icon: <DoorOpen size={20} />, path: '/kiosk' },
  { 
    id: 'point', 
    label: '포인트 관리', 
    icon: <Coins size={20} />,
    children: [
      { id: 'dashboard', label: '대시보드', path: '/point/dashboard' },
      { id: 'auto-settings', label: '자동 지급 설정', path: '/point/auto-settings' },
      { id: 'batch-grant', label: '일괄 지급', path: '/point/batch-grant' },
      { id: 'policy', label: '정책 설정', path: '/point/policy' },
    ]
  },
  { 
    id: 'settings', 
    label: '설정', 
    icon: <Settings size={20} />,
    children: [
      { id: 'facility', label: '시설 운영정보', path: '/settings/facility' },
      { id: 'guide', label: '다짐 안내정보', path: '/settings/guide' },
      { id: 'plan', label: '플랜과 결제', path: '/settings/plan' },
      { id: 'account', label: '정산계좌정보', path: '/settings/account' },
      { id: 'menu', label: '메뉴 설정', path: '/settings/menu' },
    ]
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['point']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isMenuActive = (menu: MenuItem) => {
    if (menu.path) return isActive(menu.path);
    if (menu.children) {
      return menu.children.some(child => location.pathname.startsWith(child.path));
    }
    return false;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <span>다</span>
        </div>
        <span className="logo-text">다짐매니저</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <div key={item.id} className="menu-item-wrapper">
            <button
              className={`menu-item ${isMenuActive(item) ? 'active' : ''}`}
              onClick={() => {
                if (item.children) {
                  toggleMenu(item.id);
                } else if (item.path) {
                  navigate(item.path);
                }
              }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {item.children && (
                <span className="menu-arrow">
                  {expandedMenus.includes(item.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
              )}
            </button>

            {item.children && expandedMenus.includes(item.id) && (
              <div className="submenu">
                {item.children.map(child => (
                  <button
                    key={child.id}
                    className={`submenu-item ${isActive(child.path) ? 'active' : ''}`}
                    onClick={() => navigate(child.path)}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="facility-badge">
          <span className="badge-icon">짐모</span>
          <span className="badge-text">짐모드피트니스</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

