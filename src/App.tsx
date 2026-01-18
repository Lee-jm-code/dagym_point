import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PointDashboard from './pages/point/PointDashboard';
import AutoPointSettings from './pages/point/AutoPointSettings';
import BatchPointGrant from './pages/point/BatchPointGrant';
import PointPolicy from './pages/point/PointPolicy';
import Members from './pages/members/Members';
import MemberDetail from './pages/members/MemberDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          {/* 회원 관리 */}
          <Route path="members">
            <Route index element={<Members />} />
            <Route path=":id" element={<MemberDetail />} />
            <Route path="pre" element={<Members />} />
            <Route path="contracts" element={<Members />} />
            <Route path="contract-settings" element={<Members />} />
            <Route path="other-branch" element={<Members />} />
            <Route path="chat" element={<Members />} />
          </Route>
          
          {/* 포인트 관리 */}
          <Route path="point">
            <Route index element={<Navigate to="/point/dashboard" replace />} />
            <Route path="dashboard" element={<PointDashboard />} />
            <Route path="auto-settings" element={<AutoPointSettings />} />
            <Route path="batch-grant" element={<BatchPointGrant />} />
            <Route path="policy" element={<PointPolicy />} />
          </Route>
          
          {/* 추후 다른 페이지들 추가 */}
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
