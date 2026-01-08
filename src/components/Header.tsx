import { Search, Bell, User } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="회원 이름, 연락처 등으로 검색해 주세요." 
            className="search-input"
          />
        </div>
      </div>
      <div className="header-right">
        <button className="header-btn primary">
          📋 매출솔루션 필수정보
        </button>
        <button className="header-btn outline">
          출입문 열기
        </button>
        <button className="header-btn outline">
          회원 등록
        </button>
        <div className="header-icons">
          <button className="icon-btn">
            <Bell size={20} />
          </button>
        </div>
        <div className="user-profile">
          <User size={24} />
          <div className="user-info">
            <span className="user-name">관리자</span>
            <span className="facility-name">짐모드피트니스</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

