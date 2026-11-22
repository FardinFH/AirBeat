import { NavLink } from 'react-router-dom';
import { Activity, Users, GitCompare } from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar no-print">
      <div className="brand">
        <div className="brand-logo">
          <Activity size={20} />
        </div>
        <span className="brand-name">AirBeat</span>
      </div>

      <nav className="nav-menu">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Activity size={18} />
          <span>Live Monitor</span>
        </NavLink>

        <NavLink
          to="/patients"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Users size={18} />
          <span>All Patients</span>
        </NavLink>

        <NavLink
          to="/compare"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <GitCompare size={18} />
          <span>Compare Reports</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;