import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Heart, Play, Square, Printer, RefreshCw, ArrowRight, Clock } from 'lucide-react';
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
import './LiveMonitor.css';

function LungsIcon({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v7" />
      <path d="M12 10c-1.5 0-3 1.2-4 2.5" />
      <path d="M12 10c1.5 0 3 1.2 4 2.5" />
      <path d="M9.5 6.5C7 6.5 4.5 9 3.5 13c-.8 3.2-.3 6.5 2 7.5 1.8.8 4-.5 4.5-2.5.4-1.6.5-4.5.5-7.5 0-2-.2-4-1-4z" />
      <path d="M14.5 6.5C17 6.5 19.5 9 20.5 13c.8 3.2.3 6.5-2 7.5-1.8.8-4-.5-4.5-2.5-.4-1.6-.5-4.5-.5-7.5 0-2 .2-4 1-4z" />
    </svg>
  );
}

function LiveMonitor() {
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patient || null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    address: ''
  });

  const [targetDuration, setTargetDuration] = useState(30);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [breathRate, setBreathRate] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [reportDate, setReportDate] = useState('');

  useEffect(() => {
    if (location.state?.patient) {
      setPatient(location.state.patient);
      setIsSessionActive(false);
      setSessionEnded(false);
      setElapsedSeconds(0);
      setHeartRate(0);
      setBreathRate(0);
      setChartData([]);
    }
  }, [location.state]);

  useEffect(() => {
    if (!isSessionActive) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const nextSec = prev + 1;
        const simulatedHR = Math.floor(72 + Math.random() * 14);
        const simulatedBR = Math.floor(14 + Math.random() * 6);

        setHeartRate(simulatedHR);
        setBreathRate(simulatedBR);

        setChartData((prevData) => [
          ...prevData.slice(-59),
          {
            time: `${nextSec}s`,
            hr: simulatedHR,
            br: simulatedBR
          }
        ]);

        if (targetDuration > 0 && nextSec >= targetDuration) {
          setIsSessionActive(false);
          setSessionEnded(true);
          setReportDate(new Date().toLocaleString());
        }

        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSessionActive, targetDuration]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePatientSubmit = (e) => {
    e.preventDefault();
    const generatedId = `AB-${Math.floor(100000 + Math.random() * 900000)}`;
    setPatient({ ...formData, id: generatedId });
    setIsSessionActive(false);
    setSessionEnded(false);
    setElapsedSeconds(0);
    setHeartRate(0);
    setBreathRate(0);
    setChartData([]);
  };

  const handleStartSession = () => {
    setChartData([]);
    setElapsedSeconds(0);
    setSessionEnded(false);
    setIsSessionActive(true);
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    setSessionEnded(true);
    setReportDate(new Date().toLocaleString());
  };

  const handleSwitchPatient = () => {
    setIsSessionActive(false);
    setSessionEnded(false);
    setPatient(null);
    setFormData({ name: '', age: '', phone: '', address: '' });
    setChartData([]);
    setElapsedSeconds(0);
    setHeartRate(0);
    setBreathRate(0);
  };

  const formatTimer = (totalSec) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const avgHeartRate =
    chartData.length > 0
      ? Math.round(chartData.reduce((sum, d) => sum + d.hr, 0) / chartData.length)
      : 0;

  const avgBreathRate =
    chartData.length > 0
      ? Math.round(chartData.reduce((sum, d) => sum + d.br, 0) / chartData.length)
      : 0;

  const minHeartRate = chartData.length > 0 ? Math.min(...chartData.map((d) => d.hr)) : 0;
  const maxHeartRate = chartData.length > 0 ? Math.max(...chartData.map((d) => d.hr)) : 0;
  const minBreathRate = chartData.length > 0 ? Math.min(...chartData.map((d) => d.br)) : 0;
  const maxBreathRate = chartData.length > 0 ? Math.max(...chartData.map((d) => d.br)) : 0;

  const totalHeartBeats = Math.round((avgHeartRate / 60) * elapsedSeconds);
  const totalBreaths = Math.round((avgBreathRate / 60) * elapsedSeconds);

  const getHeartAnalysis = () => {
    if (avgHeartRate < 60) {
      return {
        status: 'Low (Bradycardia)',
        badgeClass: 'status-warning',
        note: `During this ${elapsedSeconds}-second session, approximately ${totalHeartBeats} heartbeats were recorded with an average of ${avgHeartRate} BPM. Heart rate is below the standard adult resting range (60–100 BPM).`
      };
    }
    if (avgHeartRate > 100) {
      return {
        status: 'Elevated (Tachycardia)',
        badgeClass: 'status-alert',
        note: `During this ${elapsedSeconds}-second session, approximately ${totalHeartBeats} heartbeats were recorded with an average of ${avgHeartRate} BPM. Heart rate is above the standard resting range (60–100 BPM).`
      };
    }
    return {
      status: 'Normal',
      badgeClass: 'status-normal',
      note: `During this ${elapsedSeconds}-second session, approximately ${totalHeartBeats} heartbeats were recorded with an average of ${avgHeartRate} BPM (Range: ${minHeartRate}–${maxHeartRate} BPM). Cardiovascular rhythm is within the normal resting range.`
    };
  };

  const getLungAnalysis = () => {
    if (avgBreathRate < 12) {
      return {
        status: 'Low (Bradypnea)',
        badgeClass: 'status-warning',
        note: `During this ${elapsedSeconds}-second session, approximately ${totalBreaths} breaths were counted (average ${avgBreathRate} Breaths/min). Breathing rate is slower than the normal adult range (12–20 Breaths/min).`
      };
    }
    if (avgBreathRate > 20) {
      return {
        status: 'Elevated (Tachypnea)',
        badgeClass: 'status-alert',
        note: `During this ${elapsedSeconds}-second session, approximately ${totalBreaths} breaths were counted (average ${avgBreathRate} Breaths/min). Breathing rate is faster than the normal adult range (12–20 Breaths/min).`
      };
    }
    return {
      status: 'Normal',
      badgeClass: 'status-normal',
      note: `During this ${elapsedSeconds}-second session, approximately ${totalBreaths} breaths were counted (average ${avgBreathRate} Breaths/min, Range: ${minBreathRate}–${maxBreathRate}). Respiratory pattern is steady and within the normal range.`
    };
  };

  const heartAnalysis = getHeartAnalysis();
  const lungAnalysis = getLungAnalysis();

  if (!patient) {
    return (
      <div className="intake-wrapper no-print">
        <div className="intake-card">
          <div className="intake-header">
            <h2>Patient Registration</h2>
            <p>Enter patient details to launch a dedicated monitoring board.</p>
          </div>

          <form onSubmit={handlePatientSubmit}>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahim Uddin"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age (Years)</label>
                <input
                  type="number"
                  name="age"
                  placeholder="e.g. 24"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. 017XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Moghbazar, Dhaka"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <span>Open Monitoring Board</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="no-print">
        <section className="patient-banner">
          <div className="patient-banner-top">
            <div className="patient-meta-list">
              <div className="patient-meta-item">
                <span className="meta-label">Patient Name</span>
                <span className="meta-value">{patient.name}</span>
              </div>
              <div className="patient-meta-item">
                <span className="meta-label">Age</span>
                <span className="meta-value">{patient.age} yrs</span>
              </div>
              <div className="patient-meta-item">
                <span className="meta-label">Phone</span>
                <span className="meta-value">{patient.phone}</span>
              </div>
              <div className="patient-meta-item">
                <span className="meta-label">Address</span>
                <span className="meta-value">{patient.address}</span>
              </div>
            </div>

            <button className="btn-switch-patient" onClick={handleSwitchPatient}>
              <RefreshCw size={14} />
              <span>Change Patient</span>
            </button>
          </div>

          <div className="session-bar">
            <div className="timer-selector">
              <span className="timer-label">
                <Clock size={15} />
                Session Timer:
              </span>
              <div className="duration-pills">
                <button
                  type="button"
                  className={`duration-pill ${targetDuration === 30 ? 'active' : ''}`}
                  onClick={() => setTargetDuration(30)}
                  disabled={isSessionActive}
                >
                  30s
                </button>
                <button
                  type="button"
                  className={`duration-pill ${targetDuration === 60 ? 'active' : ''}`}
                  onClick={() => setTargetDuration(60)}
                  disabled={isSessionActive}
                >
                  60s
                </button>
                <button
                  type="button"
                  className={`duration-pill ${targetDuration === 0 ? 'active' : ''}`}
                  onClick={() => setTargetDuration(0)}
                  disabled={isSessionActive}
                >
                  Manual
                </button>
              </div>
            </div>

            <div className="session-controls">
              <div className="timer-badge">
                {formatTimer(elapsedSeconds)}
                {targetDuration > 0 ? ` / ${formatTimer(targetDuration)}` : ''}
              </div>

              {!isSessionActive ? (
                <button className="btn-action btn-start" onClick={handleStartSession}>
                  <Play size={16} />
                  <span>Start Session</span>
                </button>
              ) : (
                <button className="btn-action btn-end" onClick={handleEndSession}>
                  <Square size={16} />
                  <span>End Session</span>
                </button>
              )}

              {sessionEnded && chartData.length > 0 && (
                <button className="btn-action btn-report" onClick={() => window.print()}>
                  <Printer size={16} />
                  <span>Print / Download PDF</span>
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="monitor-grid">
          <div className="vital-card">
            <div className="vital-top">
              <div className="vital-info">
                <span className="vital-label">Heart Rate</span>
                <div className="vital-reading">
                  <span className="vital-number">{heartRate || '--'}</span>
                  <span className="vital-unit">BPM</span>
                </div>
                <span className="vital-range">Normal: 60 – 100 BPM</span>
              </div>
              <div
                className={`vital-icon-box heart-icon-box ${
                  isSessionActive ? 'pulse-active' : ''
                }`}
              >
                <Heart size={48} strokeWidth={1.8} />
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="hrFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[50, 120]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="hr"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#hrFill)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="vital-card">
            <div className="vital-top">
              <div className="vital-info">
                <span className="vital-label">Breath Count</span>
                <div className="vital-reading">
                  <span className="vital-number">{breathRate || '--'}</span>
                  <span className="vital-unit">Breaths/min</span>
                </div>
                <span className="vital-range">Normal: 12 – 20 Breaths/min</span>
              </div>
              <div
                className={`vital-icon-box lungs-icon-box ${
                  isSessionActive ? 'breathe-active' : ''
                }`}
              >
                <LungsIcon size={48} />
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="brFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[5, 35]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="br"
                    stroke="#0284c7"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#brFill)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {sessionEnded && chartData.length > 0 && (
          <section className="summary-section">
            <h2 className="summary-heading">Session Clinical Summary</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-card-header">
                  <div className="summary-card-title">
                    <Heart size={18} color="#ef4444" />
                    <span>Heart Analysis</span>
                  </div>
                  <span className={`status-badge ${heartAnalysis.badgeClass}`}>
                    {heartAnalysis.status}
                  </span>
                </div>

                <div className="summary-stats">
                  <div className="stat-box">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">{elapsedSeconds}s</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Total Beats</span>
                    <span className="stat-value">{totalHeartBeats}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Avg / Range</span>
                    <span className="stat-value">
                      {avgHeartRate} ({minHeartRate}–{maxHeartRate})
                    </span>
                  </div>
                </div>

                <p className="summary-note">{heartAnalysis.note}</p>
              </div>

              <div className="summary-card">
                <div className="summary-card-header">
                  <div className="summary-card-title">
                    <LungsIcon size={18} />
                    <span>Lung Analysis</span>
                  </div>
                  <span className={`status-badge ${lungAnalysis.badgeClass}`}>
                    {lungAnalysis.status}
                  </span>
                </div>

                <div className="summary-stats">
                  <div className="stat-box">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">{elapsedSeconds}s</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Total Breaths</span>
                    <span className="stat-value">{totalBreaths}</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-label">Avg / Range</span>
                    <span className="stat-value">
                      {avgBreathRate} ({minBreathRate}–{maxBreathRate})
                    </span>
                  </div>
                </div>

                <p className="summary-note">{lungAnalysis.note}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      <MedicalReport
        patient={patient}
        reportDate={reportDate}
        duration={formatTimer(elapsedSeconds)}
        elapsedSeconds={elapsedSeconds}
        avgHeartRate={avgHeartRate}
        avgBreathRate={avgBreathRate}
        minHeartRate={minHeartRate}
        maxHeartRate={maxHeartRate}
        minBreathRate={minBreathRate}
        maxBreathRate={maxBreathRate}
        totalHeartBeats={totalHeartBeats}
        totalBreaths={totalBreaths}
        heartAnalysis={heartAnalysis}
        lungAnalysis={lungAnalysis}
        chartData={chartData}
      />
    </>
  );
}

export default LiveMonitor;