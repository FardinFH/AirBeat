import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LiveMonitor from './pages/LiveMonitor';
import AllPatients from './pages/AllPatients';
import CompareReports from './pages/CompareReports';
import './App.css';

function Layout() {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/patients') return 'All Patients';
    if (location.pathname === '/compare') return 'Compare Reports';
    return 'Cardio-Respiratory Monitor';
  };

  return (
    <div className="saas-layout">
      <Sidebar />

      <div className="main-content">
        <header className="topbar no-print">
          <div className="topbar-title">
            <h1>{getPageTitle()}</h1>
          </div>
          <div className="device-status">
            <span className="status-dot"></span>
            <span>Sensor Ready</span>
          </div>
        </header>

        <main className="page-body">
          <Routes>
            <Route path="/" element={<LiveMonitor />} />
            <Route path="/patients" element={<AllPatients />} />
            <Route path="/compare" element={<CompareReports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;