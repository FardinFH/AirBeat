import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import './MedicalReport.css';

function MedicalReport({
  patient,
  reportDate,
  duration,
  elapsedSeconds,
  avgHeartRate,
  avgBreathRate,
  minHeartRate,
  maxHeartRate,
  minBreathRate,
  maxBreathRate,
  totalHeartBeats,
  totalBreaths,
  heartAnalysis,
  lungAnalysis,
  chartData
}) {
  return (
    <div className="print-only-report">
      <div className="report-header">
        <div className="report-brand">
          <h1>AirBeat Medical Diagnostics</h1>
          <p>IoT Cardio-Respiratory Monitoring System</p>
        </div>
        <div className="report-meta-right">
          <div>
            <strong>Report ID:</strong> {patient.id}
          </div>
          <div>
            <strong>Date:</strong> {reportDate || new Date().toLocaleString()}
          </div>
          <div>
            <strong>Session Duration:</strong> {duration} ({elapsedSeconds}s)
          </div>
        </div>
      </div>

      <div className="report-section-title">Patient Information</div>
      <div className="report-patient-grid">
        <div>
          <strong>Name:</strong> {patient.name}
        </div>
        <div>
          <strong>Age:</strong> {patient.age} Years
        </div>
        <div>
          <strong>Phone:</strong> {patient.phone}
        </div>
        <div>
          <strong>Address:</strong> {patient.address}
        </div>
      </div>

      <div className="report-section-title">Vital Signs Summary</div>
      <table className="report-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Total Count</th>
            <th>Average (Min–Max)</th>
            <th>Reference Range</th>
            <th>Condition</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Heart Rate (ECG)</td>
            <td>{totalHeartBeats} beats</td>
            <td>
              <strong>{avgHeartRate} BPM</strong> ({minHeartRate}–{maxHeartRate})
            </td>
            <td>60 – 100 BPM</td>
            <td>{heartAnalysis.status}</td>
          </tr>
          <tr>
            <td>Respiratory Rate (Lungs)</td>
            <td>{totalBreaths} breaths</td>
            <td>
              <strong>{avgBreathRate} /min</strong> ({minBreathRate}–{maxBreathRate})
            </td>
            <td>12 – 20 /min</td>
            <td>{lungAnalysis.status}</td>
          </tr>
        </tbody>
      </table>

      <div className="report-section-title">Clinical Observations</div>
      <div className="report-observations">
        <div className="report-obs-box">
          <h4>Heart Condition — {heartAnalysis.status}</h4>
          <p>{heartAnalysis.note}</p>
        </div>
        <div className="report-obs-box">
          <h4>Lung Condition — {lungAnalysis.status}</h4>
          <p>{lungAnalysis.note}</p>
        </div>
      </div>

      <div className="report-section-title">Recorded Waveform Graphs</div>
      <div className="report-chart-block">
        <h4>Heart Rate Trend (BPM)</h4>
        <AreaChart width={680} height={145} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis domain={[50, 120]} tick={{ fontSize: 10 }} />
          <Area
            type="monotone"
            dataKey="hr"
            stroke="#ef4444"
            strokeWidth={2}
            fill="#fee2e2"
            isAnimationActive={false}
          />
        </AreaChart>
      </div>

      <div className="report-chart-block">
        <h4>Respiratory Rate Trend (Breaths/min)</h4>
        <AreaChart width={680} height={145} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis domain={[5, 35]} tick={{ fontSize: 10 }} />
          <Area
            type="monotone"
            dataKey="br"
            stroke="#0284c7"
            strokeWidth={2}
            fill="#e0f2fe"
            isAnimationActive={false}
          />
        </AreaChart>
      </div>

      <div className="report-footer">
        <div>Generated automatically by AirBeat Monitoring System.</div>
        <div className="signature-box">
          <div className="signature-line">Authorized Signature</div>
          <span>Attending Physician / Technician</span>
        </div>
      </div>
    </div>
  );
}

export default MedicalReport;