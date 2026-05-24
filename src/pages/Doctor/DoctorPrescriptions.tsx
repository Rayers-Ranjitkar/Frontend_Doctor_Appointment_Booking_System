import { useEffect, useMemo, useState } from 'react';
import { Download, Eye, FileText, Pencil, Plus, Printer, Save } from 'lucide-react';
import type { Prescription } from '@/utils/clinicData';
import { useClinic } from '../../context/ClinicContext';
import { PrescriptionSheet } from '../../components/prescriptions/PrescriptionSheet';
import { PrescriptionPreviewModal } from '../../components/prescriptions/PrescriptionPreviewModal';
import { createPrescriptionHtml } from '@/utils/prescriptionDocument';

type MedicineDraft = Prescription['medicines'][number];

type PrescriptionForm = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  patientPhone: string;
  patientAddress: string;
  title: string;
  fileName: string;
  notes: string;
  hospitalName: string;
  hospitalAddress: string;
  hospitalPhone: string;
  hospitalTiming: string;
  registrationNumber: string;
  weightKg: string;
  heightCm: string;
  bmi: string;
  bloodPressure: string;
  chiefComplaints: string;
  clinicalFindings: string;
  diagnosis: string;
  advice: string;
  followUpDate: string;
  medicines: MedicineDraft[];
};

const defaultMedicine = (): MedicineDraft => ({
  id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  dosage: '',
  duration: '',
  instructions: '',
});

function splitLines(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function calculateBmi(weightKg: string, heightCm: string) {
  const weight = Number(weightKg);
  const height = Number(heightCm);
  if (!weight || !height) return '';
  const bmi = weight / ((height / 100) * (height / 100));
  if (!Number.isFinite(bmi)) return '';
  return bmi.toFixed(2);
}

function createEmptyForm() {
  return {
    appointmentId: '',
    patientId: '',
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientPhone: '',
    patientAddress: '',
    title: 'Clinical Prescription',
    fileName: 'norvic-prescription',
    notes: '',
    hospitalName: 'Norvic Hospital',
    hospitalAddress: 'Putalisadak Main Road, Kathmandu',
    hospitalPhone: '+977-01-4567890',
    hospitalTiming: '09:00 AM - 06:00 PM',
    registrationNumber: '',
    weightKg: '',
    heightCm: '',
    bmi: '',
    bloodPressure: '',
    chiefComplaints: '',
    clinicalFindings: '',
    diagnosis: '',
    advice: '',
    followUpDate: '',
    medicines: [defaultMedicine()],
  };
}

function buildPrescriptionFromForm(form: PrescriptionForm, currentDoctorName: string): Prescription {
  const createdAt = new Date().toISOString();
  return {
    id: `preview-${form.appointmentId || 'draft'}`,
    appointmentId: form.appointmentId,
    doctorId: '',
    doctorName: currentDoctorName,
    patientId: form.patientId,
    patientName: form.patientName,
    title: form.title,
    fileName: form.fileName,
    fileUrl: '#',
    notes: form.notes,
    hospitalName: form.hospitalName,
    hospitalAddress: form.hospitalAddress,
    hospitalPhone: form.hospitalPhone,
    hospitalTiming: form.hospitalTiming,
    registrationNumber: form.registrationNumber,
    patientAge: form.patientAge ? Number(form.patientAge) : undefined,
    patientGender: form.patientGender,
    patientPhone: form.patientPhone,
    patientAddress: form.patientAddress,
    weightKg: form.weightKg,
    heightCm: form.heightCm,
    bmi: form.bmi || calculateBmi(form.weightKg, form.heightCm),
    bloodPressure: form.bloodPressure,
    chiefComplaints: splitLines(form.chiefComplaints),
    clinicalFindings: splitLines(form.clinicalFindings),
    diagnosis: form.diagnosis,
    medicines: form.medicines.filter((medicine) => medicine.name.trim()),
    advice: splitLines(form.advice),
    followUpDate: form.followUpDate,
    documentHtml: '',
    createdAt,
    updatedAt: createdAt,
  };
}

function mapPrescriptionToForm(prescription: Prescription): PrescriptionForm {
  return {
    appointmentId: prescription.appointmentId,
    patientId: prescription.patientId,
    patientName: prescription.patientName,
    patientAge: prescription.patientAge ? String(prescription.patientAge) : '',
    patientGender: prescription.patientGender || '',
    patientPhone: prescription.patientPhone || '',
    patientAddress: prescription.patientAddress || '',
    title: prescription.title,
    fileName: prescription.fileName,
    notes: prescription.notes,
    hospitalName: prescription.hospitalName,
    hospitalAddress: prescription.hospitalAddress,
    hospitalPhone: prescription.hospitalPhone,
    hospitalTiming: prescription.hospitalTiming,
    registrationNumber: prescription.registrationNumber || '',
    weightKg: prescription.weightKg || '',
    heightCm: prescription.heightCm || '',
    bmi: prescription.bmi || '',
    bloodPressure: prescription.bloodPressure || '',
    chiefComplaints: prescription.chiefComplaints.join('\n'),
    clinicalFindings: prescription.clinicalFindings.join('\n'),
    diagnosis: prescription.diagnosis,
    advice: prescription.advice.join('\n'),
    followUpDate: prescription.followUpDate || '',
    medicines: prescription.medicines.length > 0 ? prescription.medicines : [defaultMedicine()],
  };
}

export default function DoctorPrescriptions() {
  const { appointments, currentDoctor, currentPatient, uploadPrescription, updatePrescription, prescriptions, patients } = useClinic();
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activePreviewPrescription, setActivePreviewPrescription] = useState<Prescription | null>(null);
  const [form, setForm] = useState<PrescriptionForm>(createEmptyForm());
  const [statusMessage, setStatusMessage] = useState('');

  const eligibleAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.doctorId === currentDoctor.id),
    [appointments, currentDoctor.id],
  );

  const myPrescriptions = useMemo(
    () => prescriptions.filter((prescription) => prescription.doctorId === currentDoctor.id),
    [prescriptions, currentDoctor.id],
  );

  useEffect(() => {
    setForm((current) => ({
      ...current,
      registrationNumber: current.registrationNumber || currentDoctor.licenseNumber,
    }));
  }, [currentDoctor.licenseNumber]);

  const previewPrescription = useMemo(() => {
    const built = buildPrescriptionFromForm(form, currentDoctor.name);
    return {
      ...built,
      doctorId: currentDoctor.id,
      documentHtml: createPrescriptionHtml({
        ...built,
        doctorId: currentDoctor.id,
      }),
    };
  }, [form, currentDoctor.id, currentDoctor.name]);

  const onAppointmentChange = (appointmentId: string) => {
    const appointment = eligibleAppointments.find((item) => item.id === appointmentId);
    if (!appointment) return;
    const patient = patients.find((item) => item.id === appointment.patientId) || currentPatient;
    setSelectedPrescriptionId(null);
    setForm((current) => ({
      ...current,
      appointmentId: appointment.id,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: String(patient.age),
      patientGender: patient.gender,
      patientPhone: patient.phone,
      patientAddress: patient.address,
      title: `${appointment.specialty} Prescription`,
      fileName: `${patient.name.toLowerCase().replace(/\s+/g, '-')}-${appointment.date}-prescription`,
      notes: appointment.reason,
      hospitalName: appointment.hospital || 'Norvic Hospital',
      registrationNumber: currentDoctor.licenseNumber,
    }));
    setStatusMessage('');
  };

  const savePrescription = async () => {
    const payload = {
      ...previewPrescription,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
    };

    if (!payload.appointmentId || !payload.patientId || !payload.diagnosis || payload.medicines.length === 0) {
      setStatusMessage('Appointment, diagnosis, and at least one medicine are required.');
      return;
    }

    if (selectedPrescriptionId) {
      await updatePrescription(selectedPrescriptionId, payload);
      setStatusMessage('Prescription updated successfully.');
      return;
    }

    await uploadPrescription(payload);
    setSelectedPrescriptionId(null);
    setForm(createEmptyForm());
    setStatusMessage('Prescription saved successfully.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>Prescription Workspace</h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>Create, edit, print, and store Norvic Hospital prescriptions in the patient record.</p>
      </div>

      <div className="grid xl:grid-cols-[1.15fr,0.85fr] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Prescription Editor</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPrescriptionId(null);
                    setForm(createEmptyForm());
                    setStatusMessage('');
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 flex items-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Plus size={16} /> New
                </button>
                <button
                  onClick={() => {
                    setActivePreviewPrescription(previewPrescription);
                    setPreviewOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 flex items-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Download size={16} /> Preview
                </button>
                <button
                  onClick={() => {
                    setActivePreviewPrescription(previewPrescription);
                    setPreviewOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 flex items-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Printer size={16} /> Preview
                </button>
              </div>
            </div>

            <select
              value={form.appointmentId}
              onChange={(event) => onAppointmentChange(event.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none"
            >
              <option value="">Select appointment</option>
              {eligibleAppointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.patientName} • {appointment.date} • {appointment.time} • {appointment.specialty}
                </option>
              ))}
            </select>

            <div className="grid md:grid-cols-2 gap-4">
              <input value={form.patientName} onChange={(event) => setForm((current) => ({ ...current, patientName: event.target.value }))} placeholder="Patient name" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.patientPhone} onChange={(event) => setForm((current) => ({ ...current, patientPhone: event.target.value }))} placeholder="Patient phone" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.patientAge} onChange={(event) => setForm((current) => ({ ...current, patientAge: event.target.value }))} placeholder="Age" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.patientGender} onChange={(event) => setForm((current) => ({ ...current, patientGender: event.target.value }))} placeholder="Gender" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.weightKg} onChange={(event) => setForm((current) => ({ ...current, weightKg: event.target.value, bmi: calculateBmi(event.target.value, current.heightCm) }))} placeholder="Weight (Kg)" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.heightCm} onChange={(event) => setForm((current) => ({ ...current, heightCm: event.target.value, bmi: calculateBmi(current.weightKg, event.target.value) }))} placeholder="Height (Cm)" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.bmi} onChange={(event) => setForm((current) => ({ ...current, bmi: event.target.value }))} placeholder="BMI" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
              <input value={form.bloodPressure} onChange={(event) => setForm((current) => ({ ...current, bloodPressure: event.target.value }))} placeholder="Blood pressure" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
            </div>

            <textarea value={form.patientAddress} onChange={(event) => setForm((current) => ({ ...current, patientAddress: event.target.value }))} placeholder="Patient address" rows={2} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />

            <div className="grid md:grid-cols-2 gap-4">
              <textarea value={form.chiefComplaints} onChange={(event) => setForm((current) => ({ ...current, chiefComplaints: event.target.value }))} placeholder="Chief complaints, one per line" rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />
              <textarea value={form.clinicalFindings} onChange={(event) => setForm((current) => ({ ...current, clinicalFindings: event.target.value }))} placeholder="Clinical findings, one per line" rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />
            </div>

            <textarea value={form.diagnosis} onChange={(event) => setForm((current) => ({ ...current, diagnosis: event.target.value }))} placeholder="Write diagnosis" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Medicines</h3>
                <button onClick={() => setForm((current) => ({ ...current, medicines: [...current.medicines, defaultMedicine()] }))} className="px-3 py-2 rounded-xl border border-gray-200 text-gray-700 flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Plus size={16} /> Add Medicine
                </button>
              </div>
              {form.medicines.map((medicine, index) => (
                <div key={medicine.id} className="grid md:grid-cols-[1.4fr,1fr,1fr,44px] gap-3 items-start">
                  <input value={medicine.name} onChange={(event) => setForm((current) => ({ ...current, medicines: current.medicines.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) }))} placeholder="Medicine name" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
                  <input value={medicine.dosage} onChange={(event) => setForm((current) => ({ ...current, medicines: current.medicines.map((item, itemIndex) => itemIndex === index ? { ...item, dosage: event.target.value } : item) }))} placeholder="Dosage" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
                  <input value={medicine.duration} onChange={(event) => setForm((current) => ({ ...current, medicines: current.medicines.map((item, itemIndex) => itemIndex === index ? { ...item, duration: event.target.value } : item) }))} placeholder="Duration" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
                  <button
                    onClick={() => setForm((current) => {
                      const medicines = current.medicines.filter((_, itemIndex) => itemIndex !== index);
                      return { ...current, medicines: medicines.length > 0 ? medicines : [defaultMedicine()] };
                    })}
                    className="h-12 rounded-xl border border-red-100 text-red-600"
                  >
                    ×
                  </button>
                  <textarea value={medicine.instructions || ''} onChange={(event) => setForm((current) => ({ ...current, medicines: current.medicines.map((item, itemIndex) => itemIndex === index ? { ...item, instructions: event.target.value } : item) }))} placeholder="Instructions / total tablets / after food" rows={2} className="md:col-span-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <textarea value={form.advice} onChange={(event) => setForm((current) => ({ ...current, advice: event.target.value }))} placeholder="Advice, one per line" rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />
              <div className="space-y-4">
                <input value={form.followUpDate} onChange={(event) => setForm((current) => ({ ...current, followUpDate: event.target.value }))} type="date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none" />
                <textarea value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Internal note / encounter summary" rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => void savePrescription()} className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center gap-2" style={{ fontWeight: 600 }}>
                <Save size={16} /> {selectedPrescriptionId ? 'Update Prescription' : 'Save Prescription'}
              </button>
              {statusMessage ? <p className="text-gray-600 self-center" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{statusMessage}</p> : null}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              <h2 className="text-gray-900" style={{ fontWeight: 700 }}>Saved Prescriptions</h2>
            </div>
            <div className="grid gap-4">
              {myPrescriptions.map((prescription) => (
                <div key={prescription.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-gray-900" style={{ fontWeight: 700 }}>{prescription.title}</p>
                    <p className="text-gray-500" style={{ fontSize: '0.82rem' }}>{prescription.patientName} • {new Date(prescription.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-400 mt-2" style={{ fontSize: '0.82rem' }}>{prescription.diagnosis}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setSelectedPrescriptionId(prescription.id);
                      setForm(mapPrescriptionToForm(prescription));
                      setStatusMessage('Loaded saved prescription for editing.');
                    }} className="px-3 py-2 rounded-xl border border-gray-200 text-gray-700 flex items-center gap-2" style={{ fontWeight: 600 }}>
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setActivePreviewPrescription(prescription);
                        setPreviewOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl border border-gray-200 text-gray-700 flex items-center gap-2"
                      style={{ fontWeight: 600 }}
                    >
                      <Eye size={14} /> Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-blue-600" />
              <p className="text-gray-900" style={{ fontWeight: 700 }}>Live Preview</p>
            </div>
            <button
              onClick={() => {
                setActivePreviewPrescription(previewPrescription);
                setPreviewOpen(true);
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <Printer size={14} /> Open Preview
            </button>
          </div>
          <div className="rounded-3xl bg-gray-100 p-4 overflow-auto">
            <PrescriptionSheet prescription={previewPrescription} />
          </div>
        </div>
      </div>

      <PrescriptionPreviewModal prescription={previewOpen ? activePreviewPrescription : null} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
