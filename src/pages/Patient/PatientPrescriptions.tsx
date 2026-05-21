import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Eye, FileText } from 'lucide-react';
import type { Prescription } from '@/utils/clinicData';
import { useClinic } from '../../context/ClinicContext';
import { PrescriptionSheet } from '../../components/prescriptions/PrescriptionSheet';
import { PrescriptionPreviewModal } from '../../components/prescriptions/PrescriptionPreviewModal';

export default function PatientPrescriptions() {
  const { currentPatient, prescriptions } = useClinic();

  // Filter prescriptions for the logged-in patient
  const items = useMemo(
    () => prescriptions.filter((p) => p.patientId === currentPatient.id),
    [prescriptions, currentPatient.id],
  );

  // Currently selected prescription
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(
    items[0] || null,
  );

  // Controls preview modal visibility
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    // If no prescriptions exist, clear selection
    if (items.length === 0) {
      setSelectedPrescription(null);
      return;
    }

    // Keep current selection if still valid, otherwise fallback to first item
    setSelectedPrescription((current) =>
      current && items.some((item) => item.id === current.id) ? current : items[0],
    );
  }, [items]);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-gray-900 mb-1" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
          Prescription History
        </h1>
        <p className="text-gray-500" style={{ fontSize: '0.9rem' }}>
          View your prescription copies, print them, or download them.
        </p>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No prescriptions uploaded yet.
        </div>
      ) : (
        <div className="grid xl:grid-cols-[0.88fr,1.12fr] gap-6">

          {/* Left panel: list of prescriptions */}
          <div className="space-y-4">
            {items.map((prescription) => (
              <button
                key={prescription.id}
                onClick={() => setSelectedPrescription(prescription)}
                className={`w-full text-left rounded-2xl border p-5 shadow-sm transition ${
                  selectedPrescription?.id === prescription.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex items-start gap-4">

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-blue-100">
                    <FileText size={22} className="text-blue-600" />
                  </div>

                  {/* Basic details */}
                  <div className="flex-1">
                    <p className="text-gray-900" style={{ fontWeight: 700 }}>
                      {prescription.title}
                    </p>

                    <p className="text-gray-500" style={{ fontSize: '0.82rem' }}>
                      {prescription.doctorName} •{' '}
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </p>

                    <p className="text-gray-400 mt-2" style={{ fontSize: '0.82rem' }}>
                      {prescription.diagnosis}
                    </p>

                    {/* Follow-up date */}
                    <div className="mt-3 inline-flex items-center gap-2 text-gray-500" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                      <CalendarDays size={14} />
                      Follow up:{' '}
                      {prescription.followUpDate
                        ? new Date(prescription.followUpDate).toLocaleDateString()
                        : 'Not specified'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right panel: selected prescription details */}
          {selectedPrescription ? (
            <div className="space-y-4">

              {/* Header + actions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-3">
                <div>
                  <p className="text-gray-900" style={{ fontWeight: 700 }}>
                    {selectedPrescription.title}
                  </p>

                  <p className="text-gray-500" style={{ fontSize: '0.82rem' }}>
                    Saved on{' '}
                    {new Date(selectedPrescription.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Preview button */}
                <button
                  onClick={() => setPreviewOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2"
                  style={{ fontWeight: 600 }}
                >
                  <Eye size={15} /> Preview
                </button>
              </div>

              {/* Prescription content */}
              <div className="rounded-3xl bg-gray-100 p-4 overflow-auto">
                <PrescriptionSheet prescription={selectedPrescription} />
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Preview modal */}
      <PrescriptionPreviewModal
        prescription={previewOpen ? selectedPrescription : null}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}