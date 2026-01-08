const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">출석/대시보드</h1>
        <p className="page-description">시설 현황을 한눈에 확인하세요.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <span className="stat-label">오늘 출석</span>
            <span className="stat-value">42명</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <span className="stat-label">유효 회원</span>
            <span className="stat-value">156명</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">💰</div>
          <div className="stat-info">
            <span className="stat-label">이번달 매출</span>
            <span className="stat-value">1,250만원</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🎯</div>
          <div className="stat-info">
            <span className="stat-label">신규 등록</span>
            <span className="stat-value">8명</span>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          max-width: 1200px;
        }
        .page-header {
          margin-bottom: 24px;
        }
        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0 0 8px 0;
        }
        .page-description {
          font-size: 14px;
          color: #666;
          margin: 0;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }
        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .stat-icon.blue { background: #e0f2fe; }
        .stat-icon.green { background: #dcfce7; }
        .stat-icon.purple { background: #f3e8ff; }
        .stat-icon.orange { background: #ffedd5; }
        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-label {
          font-size: 13px;
          color: #666;
        }
        .stat-value {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a2e;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

