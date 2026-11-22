import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Activity,
  GitCompare,
  FileText,
  Phone,
  MapPin,
  Calendar,
  Printer,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import MedicalReport from '../components/MedicalReport';
import './AllPatients.css';

const DEMO_PATIENTS = [
  {
    id: 'AB-482910',
    name: 'Rahim Uddin',
    age: '26',
    phone: '01712-458921',
    address: 'Moghbazar, Dhaka',
    reports: [
      {
        reportNumber: 1,
        date: '11/18/2026, 10:15 AM',
        duration: '00:30',
        elapsedSeconds: 30,
        avgHeartRate: 76,
        minHeartRate: 72,
        maxHeartRate: 81,
        totalHeartBeats: 38,
        avgBreathRate: 16,
        minBreathRate: 14,
        maxBreathRate: 18,
        totalBreaths: 8,
        heartAnalysis: {
          status: 'Normal',
          note: 'During this 30-second session, approximately 38 heartbeats were recorded with an average of 76 BPM. Cardiovascular rhythm is within the normal resting range.'
        },
        lungAnalysis: {
          status: 'Normal',
          note: 'During this 30-second session, approximately 8 breaths were counted (average 16 Breaths/min). Respiratory pattern is steady and within the normal range.'
        },
        chartData: [
          { time: '5s', hr: 74, br: 15 },
          { time: '10s', hr: 76, br: 16 },
          { time: '15s', hr: 78, br: 17 },
          { time: '20s', hr: 75, br: 16 },
          { time: '25s', hr: 81, br: 18 },
          { time: '30s', hr: 72, br: 14 }
        ]
      },
      {
        reportNumber: 2,
        date: '11/21/2026, 06:40 PM',
        duration: '01:00',
        elapsedSeconds: 60,
        avgHeartRate: 94,
        minHeartRate: 88,
        maxHeartRate: 102,
        totalHeartBeats: 94,
        avgBreathRate: 21,
        minBreathRate: 19,
        maxBreathRate: 23,
        totalBreaths: 21,
        heartAnalysis: {
          status: 'Normal',
          note: 'During this 60-second session, approximately 94 heartbeats were recorded with an average of 94 BPM. Cardiovascular rhythm is within the upper normal range.'
        },
        lungAnalysis: {
          status: 'Elevated (Tachypnea)',
          note: 'During this 60-second session, approximately 21 breaths were counted (average 21 Breaths/min). Breathing rate is slightly faster than the normal adult range.'
        },
        chartData: [
          { time: '10s', hr: 88, br: 19 },
          { time: '20s', hr: 92, br: 20 },
          { time: '30s', hr: 96, br: 22 },
          { time: '40s', hr: 102, br: 23 },
          { time: '50s', hr: 95, br: 21 },
          { time: '60s', hr: 91, br: 21 }
        ]
      }
    ]
  },
  {
    id: 'AB-593104',
    name: 'Nusrat Jahan',
    age: '22',
    phone: '01819-773412',
    address: 'Dhanmondi, Dhaka',
    reports: [
      {
        reportNumber: 1,
        date: '11/19/2026, 02:20 PM',
        duration: '00:30',
        elapsedSeconds: 30,
        avgHeartRate: 71,
        minHeartRate: 68,
        maxHeartRate: 75,
        totalHeartBeats: 36,
        avgBreathRate: 15,
        minBreathRate: 14,
        maxBreathRate: 16,
        totalBreaths: 8,
        heartAnalysis: {
          status: 'Normal',
          note: 'During this 30-second session, approximately 36 heartbeats were recorded with an average of 71 BPM. Cardiovascular rhythm is within the normal resting range.'
        },
        lungAnalysis: {
          status: 'Normal',
          note: 'During this 30-second session, approximately 8 breaths were counted (average 15 Breaths/min). Respiratory pattern is steady and within the normal range.'
        },
        chartData: [
          { time: '5s', hr: 70, br: 15 },
          { time: '10s', hr: 72, br: 15 },
          { time: '15s', hr: 68, br: 14 },
          { time: '20s', hr: 74, br: 16 },
          { time: '25s', hr: 75, br: 15 },
          { time: '30s', hr: 69, br: 15 }
        ]
      },
      {
        reportNumber: 2,
        date: '11/20/2026, 09:05 AM',
        duration: '00:30',
        elapsedSeconds: 30,
        avgHeartRate: 69,
        minHeartRate: 66,
        maxHeartRate: 73,
        totalHeartBeats: 35,
        avgBreathRate: 14,
        minBreathRate: 13,
        maxBreathRate: 15,
        totalBreaths: 7,
        heartAnalysis: {
          status: 'Normal',
          note: 'During this 30-second session, approximately 35 heartbeats were recorded with an average of 69 BPM. Cardiovascular rhythm is within the normal resting range.'
        },
        lungAnalysis: {
          status: 'Normal',
          note: 'During this 30-second session, approximately 7 breaths were counted (average 14 Breaths/min). Respiratory pattern is steady and within the normal range.'
        },
        chartData: [
          { time: '5s', hr: 68, br: 14 },
          { time: '10s', hr: 66, br: 13 },
          { time: '15s', hr: 70, br: 14 },
          { time: '20s', hr: 73, br: 15 },
          { time: '25s', hr: 69, br: 14 },
          { time: '30s', hr: 68, br: 14 }
        ]
      }
    ]
  },
  {
    id: 'AB-710455',
    name: 'Kamrul Hasan',
    age: '41',
    phone: '01911-304822',
    address: 'Uttara Sector 7, Dhaka',
    reports: [
      {
        reportNumber: 1,
        date: '11/22/2026, 11:10 AM',
        duration: '00:30',
        elapsedSeconds: 30,
        avgHeartRate: 106,
        minHeartRate: 101,
        maxHeartRate: 112,
        totalHeartBeats: 53,
        avgBreathRate: 19,
        minBreathRate: 18,
        maxBreathRate: 21,
        totalBreaths: 10,
        heartAnalysis: {
          status: 'Elevated (Tachycardia)',
          note: 'During this 30-second session, approximately 53 heartbeats were recorded with an average of 106 BPM. Heart rate is above the standard resting range (60–100 BPM).'
        },
        lungAnalysis: {
          status: 'Normal',
          note: 'During this 30-second session, approximately 10 breaths were counted (average 19 Breaths/min). Respiratory pattern is within the normal range.'
        },
        chartData: [
          { time: '5s', hr: 101, br: 18 },
          { time: '10s', hr: 104, br: 19 },
          { time: '15s', hr: 108, br: 20 },
          { time: '20s', hr: 112, br: 21 },
          { time: '25s', hr: 107, br: 19 },
          { time: '30s', hr: 104, br: 18 }
        ]
      }
    ]
  }
];

function AllPatients() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [selectedReportData, setSelectedReportData] = useState(null);

  const filteredPatients = DEMO_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = (id) => {
    setExpandedPatientId((prev) => (prev === id ? null : id));
  };

  const handleMonitorAgain = (patient) => {
    navigate('/', {
      state: {
        patient: {
          id: patient.id,
          name: patient.name,
          age: patient.age,
          phone: patient.phone,
          address: patient.address
        }
      }
    });
  };

  const handleCompare = (patient) => {
    navigate('/compare', { state: { patientId: patient.id } });
  };

  return (
    <>
      <div className="no-print">
        <div className="patients-toolbar">
          <div className="patients-heading">
            <h2>Registered Patients ({filteredPatients.length})</h2>
            <p>View past session reports, start a new session, or compare records.</p>
          </div>

          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="patient-list">
          {filteredPatients.map((patient) => {
            const isExpanded = expandedPatientId === patient.id;

            return (
              <div
                key={patient.id}
                className={`patient-card ${isExpanded ? 'expanded' : ''}`}
              >
                <div className="patient-row">
                  <div className="patient-info-block">
                    <div className="patient-title-line">
                      <span className="patient-name">{patient.name}</span>
                      <span className="patient-id-tag">{patient.id}</span>
                      <span className="report-count-tag">
                        {patient.reports.length}{' '}
                        {patient.reports.length === 1 ? 'Report' : 'Reports'}
                      </span>
                    </div>

                    <div className="patient-sub-info">
                      <span className="patient-sub-item">Age: {patient.age} yrs</span>
                      <span className="patient-sub-item">
                        <Phone size={13} />
                        {patient.phone}
                      </span>
                      <span className="patient-sub-item">
                        <MapPin size={13} />
                        {patient.address}
                      </span>
                    </div>
                  </div>

                  <div className="patient-actions">
                    <button
                      className="btn-pt btn-see-reports"
                      onClick={() => toggleDropdown(patient.id)}
                    >
                      <FileText size={15} />
                      <span>See Reports</span>
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>

                    <button
                      className="btn-pt btn-monitor-again"
                      onClick={() => handleMonitorAgain(patient)}
                    >
                      <Activity size={15} />
                      <span>Monitor Again</span>
                    </button>

                    <button
                      className="btn-pt btn-compare"
                      onClick={() => handleCompare(patient)}
                    >
                      <GitCompare size={15} />
                      <span>Compare</span>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="reports-dropdown">
                    <div className="dropdown-label">
                      Session History (1st to Latest)
                    </div>
                    <div className="reports-list">
                      {patient.reports.map((rep) => (
                        <button
                          key={rep.reportNumber}
                          className="report-item-btn"
                          onClick={() => setSelectedReportData({ patient, report: rep })}
                        >
                          <div className="report-item-left">
                            <span className="report-num-badge">
                              Report #{rep.reportNumber}
                            </span>
                            <div>
                              <div className="report-date-text">{rep.date}</div>
                              <div className="report-duration-text">
                                <Calendar size={11} style={{ marginRight: 4 }} />
                                Duration: {rep.duration}
                              </div>
                            </div>
                          </div>

                          <div className="report-item-metrics">
                            <span className="metric-hr">HR: {rep.avgHeartRate} BPM</span>
                            <span className="metric-br">
                              Breath: {rep.avgBreathRate} /min
                            </span>
                            <span className="view-link">View Report →</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedReportData && (
          <div className="modal-overlay" onClick={() => setSelectedReportData(null)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  {selectedReportData.patient.name} — Report #
                  {selectedReportData.report.reportNumber}
                </h3>
                <div className="modal-header-actions">
                  <button
                    className="btn-pt btn-see-reports"
                    onClick={() => window.print()}
                  >
                    <Printer size={15} />
                    <span>Print / PDF</span>
                  </button>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedReportData(null)}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="modal-summary-grid">
                <div className="modal-metric-box">
                  <h4>Heart Rate — {selectedReportData.report.heartAnalysis.status}</h4>
                  <div className="modal-big-val">
                    {selectedReportData.report.avgHeartRate} BPM
                  </div>
                  <p className="modal-note">
                    {selectedReportData.report.heartAnalysis.note}
                  </p>
                </div>

                <div className="modal-metric-box">
                  <h4>Lung Rate — {selectedReportData.report.lungAnalysis.status}</h4>
                  <div className="modal-big-val">
                    {selectedReportData.report.avgBreathRate} Breaths/min
                  </div>
                  <p className="modal-note">
                    {selectedReportData.report.lungAnalysis.note}
                  </p>
                </div>
              </div>

              <div className="modal-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedReportData.report.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis domain={[50, 120]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="hr"
                      stroke="#ef4444"
                      fill="#fee2e2"
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="modal-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedReportData.report.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis domain={[5, 35]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="br"
                      stroke="#0284c7"
                      fill="#e0f2fe"
                      strokeWidth={2}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedReportData && (
        <MedicalReport
          patient={selectedReportData.patient}
          reportDate={selectedReportData.report.date}
          duration={selectedReportData.report.duration}
          elapsedSeconds={selectedReportData.report.elapsedSeconds}
          avgHeartRate={selectedReportData.report.avgHeartRate}
          avgBreathRate={selectedReportData.report.avgBreathRate}
          minHeartRate={selectedReportData.report.minHeartRate}
          maxHeartRate={selectedReportData.report.maxHeartRate}
          minBreathRate={selectedReportData.report.minBreathRate}
          maxBreathRate={selectedReportData.report.maxBreathRate}
          totalHeartBeats={selectedReportData.report.totalHeartBeats}
          totalBreaths={selectedReportData.report.totalBreaths}
          heartAnalysis={selectedReportData.report.heartAnalysis}
          lungAnalysis={selectedReportData.report.lungAnalysis}
          chartData={selectedReportData.report.chartData}
        />
      )}
    </>
  );
}

export default AllPatients;