import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GitCompare, Printer, BookmarkCheck, Bookmark, X } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import './CompareReports.css';

const DEMO_PATIENTS = [
  {
    id: 'AB-482910',
    name: 'Rahim Uddin',
    age: '26',
    phone: '01712-458921',
    address: 'Moghbazar, Dhaka',
    reports: [
      {
        reportId: 'AB-482910-R1',
        date: '11/18/2026, 10:15 AM',
        duration: '00:30',
        avgHeartRate: 76,
        avgBreathRate: 16,
        heartStatus: 'Normal',
        lungStatus: 'Normal',
        chartData: [
          { step: 'T1', hr: 74, br: 15 },
          { step: 'T2', hr: 76, br: 16 },
          { step: 'T3', hr: 78, br: 17 },
          { step: 'T4', hr: 75, br: 16 },
          { step: 'T5', hr: 81, br: 18 },
          { step: 'T6', hr: 72, br: 14 }
        ]
      },
      {
        reportId: 'AB-482910-R2',
        date: '11/21/2026, 06:40 PM',
        duration: '01:00',
        avgHeartRate: 94,
        avgBreathRate: 21,
        heartStatus: 'Normal',
        lungStatus: 'Elevated (Tachypnea)',
        chartData: [
          { step: 'T1', hr: 88, br: 19 },
          { step: 'T2', hr: 92, br: 20 },
          { step: 'T3', hr: 96, br: 22 },
          { step: 'T4', hr: 102, br: 23 },
          { step: 'T5', hr: 95, br: 21 },
          { step: 'T6', hr: 91, br: 21 }
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
        reportId: 'AB-593104-R1',
        date: '11/19/2026, 02:20 PM',
        duration: '00:30',
        avgHeartRate: 71,
        avgBreathRate: 15,
        heartStatus: 'Normal',
        lungStatus: 'Normal',
        chartData: [
          { step: 'T1', hr: 70, br: 15 },
          { step: 'T2', hr: 72, br: 15 },
          { step: 'T3', hr: 68, br: 14 },
          { step: 'T4', hr: 74, br: 16 },
          { step: 'T5', hr: 75, br: 15 },
          { step: 'T6', hr: 69, br: 15 }
        ]
      },
      {
        reportId: 'AB-593104-R2',
        date: '11/20/2026, 09:05 AM',
        duration: '00:30',
        avgHeartRate: 69,
        avgBreathRate: 14,
        heartStatus: 'Normal',
        lungStatus: 'Normal',
        chartData: [
          { step: 'T1', hr: 68, br: 14 },
          { step: 'T2', hr: 66, br: 13 },
          { step: 'T3', hr: 70, br: 14 },
          { step: 'T4', hr: 73, br: 15 },
          { step: 'T5', hr: 69, br: 14 },
          { step: 'T6', hr: 68, br: 14 }
        ]
      },
      {
        reportId: 'AB-593104-R3',
        date: '11/22/2026, 08:30 PM',
        duration: '01:00',
        avgHeartRate: 78,
        avgBreathRate: 17,
        heartStatus: 'Normal',
        lungStatus: 'Normal',
        chartData: [
          { step: 'T1', hr: 75, br: 16 },
          { step: 'T2', hr: 77, br: 17 },
          { step: 'T3', hr: 82, br: 18 },
          { step: 'T4', hr: 79, br: 17 },
          { step: 'T5', hr: 76, br: 16 },
          { step: 'T6', hr: 79, br: 18 }
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
        reportId: 'AB-710455-R1',
        date: '11/22/2026, 11:10 AM',
        duration: '00:30',
        avgHeartRate: 106,
        avgBreathRate: 19,
        heartStatus: 'Elevated (Tachycardia)',
        lungStatus: 'Normal',
        chartData: [
          { step: 'T1', hr: 101, br: 18 },
          { step: 'T2', hr: 104, br: 19 },
          { step: 'T3', hr: 108, br: 20 },
          { step: 'T4', hr: 112, br: 21 },
          { step: 'T5', hr: 107, br: 19 },
          { step: 'T6', hr: 104, br: 18 }
        ]
      }
    ]
  }
];

const HR_COLORS = ['#ef4444', '#f97316', '#8b5cf6'];
const BR_COLORS = ['#0284c7', '#10b981', '#6366f1'];

function CompareReports() {
  const location = useLocation();
  const initialPatientId = location.state?.patientId || DEMO_PATIENTS[0].id;

  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [selectedReportIds, setSelectedReportIds] = useState([]);
  const [activeComparison, setActiveComparison] = useState(null);
  const [savedComparisons, setSavedComparisons] = useState([]);

  useEffect(() => {
    if (location.state?.patientId) {
      setSelectedPatientId(location.state.patientId);
      setSelectedReportIds([]);
      setActiveComparison(null);
    }
  }, [location.state]);

  const currentPatient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId);
  const latestFirstReports = currentPatient ? [...currentPatient.reports].reverse() : [];

  const isActiveSaved = activeComparison
    ? savedComparisons.some((item) => item.compId === activeComparison.compId)
    : false;

  const handleSelectPatient = (id) => {
    setSelectedPatientId(id);
    setSelectedReportIds([]);
    setActiveComparison(null);
  };

  const toggleReportSelection = (reportId) => {
    setSelectedReportIds((prev) => {
      if (prev.includes(reportId)) {
        return prev.filter((id) => id !== reportId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, reportId];
    });
  };

  const buildComparisonPayload = (patient, reportList) => {
    const steps = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
    const mergedHrData = steps.map((step, idx) => {
      const row = { step };
      reportList.forEach((rep, rIdx) => {
        row[`r${rIdx}`] = rep.chartData[idx]?.hr || 0;
      });
      return row;
    });

    const mergedBrData = steps.map((step, idx) => {
      const row = { step };
      reportList.forEach((rep, rIdx) => {
        row[`r${rIdx}`] = rep.chartData[idx]?.br || 0;
      });
      return row;
    });

    const newest = reportList[0];
    const oldest = reportList[reportList.length - 1];
    const hrDiff = newest.avgHeartRate - oldest.avgHeartRate;
    const brDiff = newest.avgBreathRate - oldest.avgBreathRate;

    const hrTrendText =
      hrDiff > 0
        ? `increased by ${hrDiff} BPM`
        : hrDiff < 0
        ? `decreased by ${Math.abs(hrDiff)} BPM`
        : 'remained unchanged';

    const brTrendText =
      brDiff > 0
        ? `increased by ${brDiff} Breaths/min`
        : brDiff < 0
        ? `decreased by ${Math.abs(brDiff)} Breaths/min`
        : 'remained unchanged';

    return {
      compId: `CMP-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toLocaleString(),
      patient,
      reports: reportList,
      mergedHrData,
      mergedBrData,
      insight: `Comparing the latest session (${newest.date}) against the earlier session (${oldest.date}): Average Heart Rate ${hrTrendText} (${oldest.avgHeartRate} → ${newest.avgHeartRate} BPM), and Average Respiratory Rate ${brTrendText} (${oldest.avgBreathRate} → ${newest.avgBreathRate} Breaths/min).`
    };
  };

  const handleRunComparison = () => {
    const chosen = latestFirstReports.filter((r) => selectedReportIds.includes(r.reportId));
    if (chosen.length < 2) return;
    setActiveComparison(buildComparisonPayload(currentPatient, chosen));
  };

  const handleSaveComparison = () => {
    if (!activeComparison || isActiveSaved) return;
    setSavedComparisons((prev) => [activeComparison, ...prev]);
  };

  const handleCloseComparison = () => {
    setActiveComparison(null);
  };

  return (
    <>
      <div className="no-print">
        <div className="compare-layout">
          <section className="compare-panel">
            <h2 className="panel-title">Select Patient</h2>
            <p className="panel-subtitle">Choose a patient to load their reports.</p>

            <div className="patient-select-list">
              {DEMO_PATIENTS.map((p) => (
                <button
                  key={p.id}
                  className={`patient-select-item ${
                    selectedPatientId === p.id ? 'active' : ''
                  }`}
                  onClick={() => handleSelectPatient(p.id)}
                >
                  <div className="psi-top">
                    <span className="psi-name">{p.name}</span>
                    <span className="psi-badge">{p.reports.length} Reports</span>
                  </div>
                  <span className="psi-meta">
                    {p.id} • Age {p.age} • {p.phone}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="compare-panel">
            <div className="reports-selection-header">
              <div>
                <h2 className="panel-title">
                  {currentPatient.name}&apos;s Reports (Latest First)
                </h2>
                <p className="panel-subtitle">
                  Select 2 or 3 reports to overlap and compare.
                </p>
              </div>

              <button
                className="btn-compare-run"
                disabled={selectedReportIds.length < 2}
                onClick={handleRunComparison}
              >
                <GitCompare size={16} />
                <span>Compare Selected ({selectedReportIds.length})</span>
              </button>
            </div>

            {latestFirstReports.length < 2 ? (
              <p className="panel-subtitle">
                This patient has only 1 report. At least 2 reports are required to compare.
              </p>
            ) : (
              <div className="selectable-reports">
                {latestFirstReports.map((rep, index) => {
                  const isChecked = selectedReportIds.includes(rep.reportId);
                  return (
                    <label
                      key={rep.reportId}
                      className={`report-check-card ${isChecked ? 'selected' : ''}`}
                    >
                      <div className="rcc-left">
                        <input
                          type="checkbox"
                          className="rcc-checkbox"
                          checked={isChecked}
                          onChange={() => toggleReportSelection(rep.reportId)}
                        />
                        <span className="rcc-rank">#{index + 1}</span>
                        <div>
                          <div className="rcc-date">
                            {rep.date}
                            {index === 0 && <span className="rcc-latest-tag">Latest</span>}
                          </div>
                          <div className="rcc-sub">
                            ID: {rep.reportId} • Duration: {rep.duration}
                          </div>
                        </div>
                      </div>

                      <div className="rcc-metrics">
                        <span style={{ color: '#dc2626' }}>HR: {rep.avgHeartRate} BPM</span>
                        <span style={{ color: '#0284c7' }}>
                          Breath: {rep.avgBreathRate} /min
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {activeComparison && (
          <section className="comparison-result-box">
            <div className="cr-header">
              <div>
                <h3>
                  Comparative Report — {activeComparison.patient.name} (
                  {activeComparison.reports.length} Sessions)
                </h3>
                <p className="panel-subtitle" style={{ marginBottom: 0 }}>
                  Comparison ID: {activeComparison.compId} • Generated:{' '}
                  {activeComparison.createdAt}
                </p>
              </div>

              <div className="cr-actions">
                <button
                  className="btn-save-comp"
                  onClick={handleSaveComparison}
                  disabled={isActiveSaved}
                >
                  {isActiveSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  <span>{isActiveSaved ? 'Saved to History' : 'Save Comparison'}</span>
                </button>

                <button className="btn-print-comp" onClick={() => window.print()}>
                  <Printer size={16} />
                  <span>Print / Download PDF</span>
                </button>

                <button className="btn-close-comp" onClick={handleCloseComparison}>
                  <X size={16} />
                  <span>Close</span>
                </button>
              </div>
            </div>

            <div className="comp-table-wrap">
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Session</th>
                    <th>Date & Time</th>
                    <th>Avg Heart Rate</th>
                    <th>Heart Condition</th>
                    <th>Avg Breath Rate</th>
                    <th>Lung Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {activeComparison.reports.map((rep, idx) => (
                    <tr key={rep.reportId}>
                      <td>
                        <strong>Session {idx + 1}</strong>
                      </td>
                      <td>{rep.date}</td>
                      <td>
                        <strong>{rep.avgHeartRate} BPM</strong>
                      </td>
                      <td>{rep.heartStatus}</td>
                      <td>
                        <strong>{rep.avgBreathRate} /min</strong>
                      </td>
                      <td>{rep.lungStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="comp-insight-box">
              <strong>Comparative Analysis:</strong> {activeComparison.insight}
            </div>

            <div className="overlap-charts-grid">
              <div className="overlap-chart-card">
                <h4>Overlapped Heart Rate Graph (BPM)</h4>
                <div className="overlap-chart-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeComparison.mergedHrData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="step" tick={{ fontSize: 11 }} />
                      <YAxis domain={[55, 115]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      {activeComparison.reports.map((rep, idx) => (
                        <Line
                          key={rep.reportId}
                          type="monotone"
                          dataKey={`r${idx}`}
                          name={`Session ${idx + 1} (${rep.date.split(',')[0]})`}
                          stroke={HR_COLORS[idx % HR_COLORS.length]}
                          strokeWidth={2.5}
                          dot={{ r: 3 }}
                          isAnimationActive={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="overlap-chart-card">
                <h4>Overlapped Lung / Breath Graph (Breaths/min)</h4>
                <div className="overlap-chart-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activeComparison.mergedBrData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="step" tick={{ fontSize: 11 }} />
                      <YAxis domain={[8, 28]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      {activeComparison.reports.map((rep, idx) => (
                        <Line
                          key={rep.reportId}
                          type="monotone"
                          dataKey={`r${idx}`}
                          name={`Session ${idx + 1} (${rep.date.split(',')[0]})`}
                          stroke={BR_COLORS[idx % BR_COLORS.length]}
                          strokeWidth={2.5}
                          dot={{ r: 3 }}
                          isAnimationActive={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>
        )}

        {savedComparisons.length > 0 && (
          <section className="saved-comparisons-section">
            <h3 className="panel-title" style={{ marginBottom: 12 }}>
              Saved Comparisons ({savedComparisons.length})
            </h3>
            <div className="saved-list">
              {savedComparisons.map((item) => {
                const isCurrentlyOpen = activeComparison?.compId === item.compId;
                return (
                  <div key={item.compId} className="saved-item">
                    <div className="saved-item-info">
                      <span className="saved-item-title">
                        {item.patient.name} — {item.reports.length} Sessions Compared (
                        {item.compId})
                      </span>
                      <span className="saved-item-meta">Saved on: {item.createdAt}</span>
                    </div>
                    {isCurrentlyOpen ? (
                      <button
                        className="btn-close-comp"
                        onClick={handleCloseComparison}
                      >
                        <X size={14} />
                        <span>Close Report</span>
                      </button>
                    ) : (
                      <button
                        className="btn-open-saved"
                        onClick={() => setActiveComparison(item)}
                      >
                        Open Report
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {activeComparison && (
        <div className="print-only-comparison">
          <div className="pcomp-header">
            <div>
              <h1>AirBeat Medical Diagnostics</h1>
              <p>Comparative Cardio-Respiratory Analysis Report</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12 }}>
              <div>
                <strong>Comparison ID:</strong> {activeComparison.compId}
              </div>
              <div>
                <strong>Date:</strong> {activeComparison.createdAt}
              </div>
            </div>
          </div>

          <div className="pcomp-section-title">Patient Information</div>
          <div style={{ fontSize: 12.5, marginBottom: 10 }}>
            <strong>Name:</strong> {activeComparison.patient.name} &nbsp;|&nbsp;
            <strong>Age:</strong> {activeComparison.patient.age} Years &nbsp;|&nbsp;
            <strong>Phone:</strong> {activeComparison.patient.phone} &nbsp;|&nbsp;
            <strong>Address:</strong> {activeComparison.patient.address}
          </div>

          <div className="pcomp-section-title">Compared Sessions Summary</div>
          <table className="comp-table" style={{ fontSize: 12, marginBottom: 12 }}>
            <thead>
              <tr>
                <th>Session</th>
                <th>Date</th>
                <th>Avg Heart Rate</th>
                <th>Heart Condition</th>
                <th>Avg Breath Rate</th>
                <th>Lung Condition</th>
              </tr>
            </thead>
            <tbody>
              {activeComparison.reports.map((rep, idx) => (
                <tr key={rep.reportId}>
                  <td>Session {idx + 1}</td>
                  <td>{rep.date}</td>
                  <td>{rep.avgHeartRate} BPM</td>
                  <td>{rep.heartStatus}</td>
                  <td>{rep.avgBreathRate} /min</td>
                  <td>{rep.lungStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="comp-insight-box" style={{ fontSize: 12, marginBottom: 14 }}>
            <strong>Clinical Comparison Note:</strong> {activeComparison.insight}
          </div>

          <div className="pcomp-chart-box">
            <h4>Overlapped Heart Rate Graph (BPM)</h4>
            <LineChart width={680} height={160} data={activeComparison.mergedHrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="step" tick={{ fontSize: 10 }} />
              <YAxis domain={[55, 115]} tick={{ fontSize: 10 }} />
              <Legend />
              {activeComparison.reports.map((rep, idx) => (
                <Line
                  key={rep.reportId}
                  type="monotone"
                  dataKey={`r${idx}`}
                  name={`Session ${idx + 1}`}
                  stroke={HR_COLORS[idx % HR_COLORS.length]}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </div>

          <div className="pcomp-chart-box">
            <h4>Overlapped Lung / Breath Graph (Breaths/min)</h4>
            <LineChart width={680} height={160} data={activeComparison.mergedBrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="step" tick={{ fontSize: 10 }} />
              <YAxis domain={[8, 28]} tick={{ fontSize: 10 }} />
              <Legend />
              {activeComparison.reports.map((rep, idx) => (
                <Line
                  key={rep.reportId}
                  type="monotone"
                  dataKey={`r${idx}`}
                  name={`Session ${idx + 1}`}
                  stroke={BR_COLORS[idx % BR_COLORS.length]}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </div>
        </div>
      )}
    </>
  );
}

export default CompareReports;