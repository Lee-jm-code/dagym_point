import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PointDashboard from './pages/point/PointDashboard';
import AutoPointSettings from './pages/point/AutoPointSettings';
import BatchPointGrant from './pages/point/BatchPointGrant';
import PointPolicy from './pages/point/PointPolicy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
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
