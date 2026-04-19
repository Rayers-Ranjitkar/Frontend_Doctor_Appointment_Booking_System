import type { Prescription } from '@/utils/clinicData';

function formatDisplayDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function getPatientLabel(prescription: Prescription) {
  const age = prescription.patientAge ? `${prescription.patientAge} Y` : '';
  const gender = prescription.patientGender ? prescription.patientGender.charAt(0).toUpperCase() : '';
  return [age, gender].filter(Boolean).join(' / ');
}

export function PrescriptionSheet({ prescription }: { prescription: Prescription }) {
  return (
    <div
      className="bg-white text-black mx-auto shadow-sm"
      style={{
        width: '100%',
        maxWidth: '820px',
        minHeight: '1120px',
        padding: '28px 32px',
        fontFamily: '"Times New Roman", Georgia, serif',
        lineHeight: 1.3,
      }}
    >
      <div className="flex justify-between items-start pb-5 border-b-2 border-gray-500">
        <div style={{ width: '32%' }}>
          <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>{prescription.doctorName}</p>
          <p style={{ fontSize: '0.92rem', marginTop: '0.2rem' }}>M.S.</p>
          <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>Reg. No: {prescription.registrationNumber || '-'}</p>
        </div>

        <div className="text-center" style={{ width: '16%' }}>
          <div style={{ fontSize: '4rem', lineHeight: 1, color: '#1e40af', fontWeight: 700 }}>⚕</div>
        </div>

        <div style={{ width: '42%' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e40af' }}>{prescription.hospitalName}</p>
          <p style={{ fontSize: '0.92rem', whiteSpace: 'pre-line' }}>{prescription.hospitalAddress}</p>
          <p style={{ fontSize: '0.92rem', fontWeight: 600 }}>Ph: {prescription.hospitalPhone}</p>
          <p style={{ fontSize: '0.92rem' }}>Timing: {prescription.hospitalTiming}</p>
        </div>
      </div>

      <div className="pt-4 pb-3 border-b-2 border-gray-500" style={{ fontSize: '0.96rem' }}>
        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <p>
              <span style={{ fontWeight: 700 }}>ID:</span> {prescription.appointmentId}
              <span style={{ fontWeight: 700 }}>  Patient:</span> {prescription.patientName}
              {getPatientLabel(prescription) ? ` (${getPatientLabel(prescription)})` : ''}
            </p>
            <p>
              <span style={{ fontWeight: 700 }}>Mob. No:</span> {prescription.patientPhone || '-'}
            </p>
            <p>
              <span style={{ fontWeight: 700 }}>Address:</span> {prescription.patientAddress || '-'}
            </p>
            <p>
              <span style={{ fontWeight: 700 }}>Weight (Kg):</span> {prescription.weightKg || '-'}
              <span style={{ fontWeight: 700 }}>  Height (Cm):</span> {prescription.heightCm || '-'}
              <span style={{ fontWeight: 700 }}>  B.M.I.:</span> {prescription.bmi || '-'}
              <span style={{ fontWeight: 700 }}>  BP:</span> {prescription.bloodPressure || '-'}
            </p>
          </div>
          <div style={{ fontWeight: 700 }}>Date: {formatDisplayDate(prescription.createdAt)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 border-b-2 border-gray-500">
        <div className="border-r border-gray-500 py-3 pr-4">
          <p style={{ fontWeight: 700, textDecoration: 'underline', marginBottom: '0.3rem' }}>Chief Complaints</p>
          <ul className="space-y-1" style={{ paddingLeft: '1rem', fontSize: '0.95rem' }}>
            {prescription.chiefComplaints.map((item, index) => <li key={`complaint-${index}`}>{item}</li>)}
          </ul>
        </div>
        <div className="py-3 pl-4">
          <p style={{ fontWeight: 700, textDecoration: 'underline', marginBottom: '0.3rem' }}>Clinical Findings</p>
          <ul className="space-y-1" style={{ paddingLeft: '1rem', fontSize: '0.95rem' }}>
            {prescription.clinicalFindings.map((item, index) => <li key={`finding-${index}`}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="py-3 border-b-2 border-gray-500">
        <p style={{ fontWeight: 700 }}>Diagnosis:</p>
        <p style={{ fontSize: '0.98rem', marginTop: '0.25rem' }}>{prescription.diagnosis}</p>
      </div>

      <div className="pt-2">
        <table className="w-full" style={{ borderCollapse: 'collapse', fontSize: '0.96rem' }}>
          <thead>
            <tr style={{ borderTop: '2px solid #6b7280', borderBottom: '2px solid #6b7280' }}>
              <th className="text-left py-1 pr-2" style={{ width: '44%', fontWeight: 700 }}>Medicine Name</th>
              <th className="text-left py-1 pr-2" style={{ width: '28%', fontWeight: 700 }}>Dosage</th>
              <th className="text-left py-1" style={{ width: '28%', fontWeight: 700 }}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medicines.map((medicine, index) => (
              <tr key={medicine.id || `${medicine.name}-${index}`} style={{ borderBottom: '1px solid #9ca3af' }}>
                <td className="align-top py-3 pr-3">
                  <div style={{ fontWeight: 700 }}>{index + 1}) {medicine.name}</div>
                  {medicine.instructions ? <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>{medicine.instructions}</div> : null}
                </td>
                <td className="align-top py-3 pr-3">{medicine.dosage}</td>
                <td className="align-top py-3">{medicine.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4">
        <p style={{ fontWeight: 700 }}>Advice:</p>
        <ul className="space-y-1" style={{ paddingLeft: '1rem', fontSize: '0.95rem', marginTop: '0.35rem' }}>
          {prescription.advice.map((item, index) => <li key={`advice-${index}`}>{item}</li>)}
        </ul>
      </div>

      <div className="pt-5" style={{ fontSize: '0.98rem', fontWeight: 700 }}>
        Follow Up: {formatDisplayDate(prescription.followUpDate)}
      </div>

      <div className="pt-10 text-center text-gray-500" style={{ fontSize: '0.78rem' }}>
        Substitute with equivalent generics as required.
      </div>
    </div>
  );
}
