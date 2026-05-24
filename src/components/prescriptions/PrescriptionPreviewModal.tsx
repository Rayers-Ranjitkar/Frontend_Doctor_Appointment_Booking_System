import { Download, Printer, X } from 'lucide-react';
import type { Prescription } from '@/utils/clinicData';
import { PrescriptionSheet } from './PrescriptionSheet';
import { downloadPrescription, printPrescription } from '@/utils/prescriptionDocument';

export function PrescriptionPreviewModal({
  prescription,
  onClose,
}: {
  prescription: Prescription | null;
  onClose: () => void;
}) {
  if (!prescription) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">

        {/* Header / Actions */}
        <div className="sticky top-4 z-10 bg-white rounded-2xl border border-gray-200 shadow-lg p-4 mb-4 flex items-center justify-between gap-3">

          {/* Title */}
          <div>
            <p className="text-gray-900 font-bold">{prescription.title}</p>
            <p className="text-gray-500 text-[0.82rem]">Preview before printing or downloading</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => downloadPrescription(prescription)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 flex items-center gap-2 font-semibold"
            >
              <Download size={15} /> Download
            </button>

            <button
              onClick={() => printPrescription(prescription)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2 font-semibold"
            >
              <Printer size={15} /> Print
            </button>

            <button
              onClick={onClose}
              className="w-11 h-11 rounded-xl border border-gray-200 text-gray-700 flex items-center justify-center"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-3xl bg-gray-100 p-4 overflow-auto">
          <PrescriptionSheet prescription={prescription} />
        </div>

      </div>
    </div>
  );
}