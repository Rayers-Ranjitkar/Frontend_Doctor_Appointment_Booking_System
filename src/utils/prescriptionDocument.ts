import type { Prescription } from '@/utils/clinicData';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatDate(value?: string) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export function createPrescriptionHtml(prescription: Prescription) {
  const patientLabel = [prescription.patientAge ? `${prescription.patientAge} Y` : '', prescription.patientGender ? prescription.patientGender.charAt(0).toUpperCase() : '']
    .filter(Boolean)
    .join(' / ');

  const medicineRows = prescription.medicines.map((medicine, index) => `
    <tr>
      <td class="cell medicine-name">
        <div class="medicine-title">${index + 1}) ${escapeHtml(medicine.name)}</div>
        ${medicine.instructions ? `<div class="medicine-sub">${escapeHtml(medicine.instructions)}</div>` : ''}
      </td>
      <td class="cell">${escapeHtml(medicine.dosage)}</td>
      <td class="cell">${escapeHtml(medicine.duration)}</td>
    </tr>
  `).join('');

  const list = (items: string[]) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(prescription.fileName || `${prescription.patientName}-prescription`)}</title>
      <style>
        body { margin: 0; padding: 0; background: #f3f4f6; font-family: "Times New Roman", Georgia, serif; }
        .page { width: 820px; min-height: 1120px; margin: 20px auto; background: #fff; padding: 28px 32px; box-sizing: border-box; color: #111827; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #6b7280; padding-bottom: 18px; }
        .doctor { width: 32%; }
        .doctor h1 { margin: 0; font-size: 28px; }
        .doctor p { margin: 6px 0 0; font-size: 14px; }
        .emblem { width: 16%; text-align: center; font-size: 64px; line-height: 1; color: #1e40af; font-weight: 700; }
        .hospital { width: 42%; }
        .hospital h2 { margin: 0; color: #1e40af; font-size: 30px; }
        .hospital p { margin: 4px 0 0; font-size: 14px; }
        .patient { border-bottom: 2px solid #6b7280; padding: 14px 0 10px; font-size: 15px; }
        .patient-top { display: flex; justify-content: space-between; gap: 16px; }
        .section-grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 2px solid #6b7280; }
        .section { padding: 12px 16px 12px 0; }
        .section.right { border-left: 1px solid #6b7280; padding-left: 16px; padding-right: 0; }
        .section-title { font-weight: 700; text-decoration: underline; margin-bottom: 6px; }
        ul { margin: 0; padding-left: 18px; }
        .diagnosis { border-bottom: 2px solid #6b7280; padding: 12px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 6px; }
        thead th { text-align: left; font-size: 15px; padding: 6px 0; border-top: 2px solid #6b7280; border-bottom: 2px solid #6b7280; }
        .cell { font-size: 15px; padding: 12px 10px 12px 0; border-bottom: 1px solid #9ca3af; vertical-align: top; }
        .medicine-name { width: 44%; }
        .medicine-title { font-weight: 700; }
        .medicine-sub { font-size: 13px; margin-top: 4px; }
        .advice { padding-top: 16px; }
        .follow-up { padding-top: 18px; font-weight: 700; font-size: 16px; }
        .footer { padding-top: 40px; text-align: center; color: #6b7280; font-size: 12px; }
        @media print {
          body { background: #fff; }
          .page { margin: 0; width: auto; min-height: auto; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="doctor">
            <h1>${escapeHtml(prescription.doctorName)}</h1>
            <p>M.S.</p>
            <p><strong>Reg. No:</strong> ${escapeHtml(prescription.registrationNumber || '-')}</p>
          </div>
          <div class="emblem">⚕</div>
          <div class="hospital">
            <h2>${escapeHtml(prescription.hospitalName)}</h2>
            <p>${escapeHtml(prescription.hospitalAddress)}</p>
            <p><strong>Ph:</strong> ${escapeHtml(prescription.hospitalPhone)}</p>
            <p>Timing: ${escapeHtml(prescription.hospitalTiming)}</p>
          </div>
        </div>
        <div class="patient">
          <div class="patient-top">
            <div>
              <div><strong>ID:</strong> ${escapeHtml(prescription.appointmentId)} <strong>Patient:</strong> ${escapeHtml(prescription.patientName)}${patientLabel ? ` (${escapeHtml(patientLabel)})` : ''}</div>
              <div><strong>Mob. No:</strong> ${escapeHtml(prescription.patientPhone || '-')}</div>
              <div><strong>Address:</strong> ${escapeHtml(prescription.patientAddress || '-')}</div>
              <div><strong>Weight (Kg):</strong> ${escapeHtml(prescription.weightKg || '-')} <strong>Height (Cm):</strong> ${escapeHtml(prescription.heightCm || '-')} <strong>B.M.I.:</strong> ${escapeHtml(prescription.bmi || '-')} <strong>BP:</strong> ${escapeHtml(prescription.bloodPressure || '-')}</div>
            </div>
            <div><strong>Date:</strong> ${escapeHtml(formatDate(prescription.createdAt))}</div>
          </div>
        </div>
        <div class="section-grid">
          <div class="section">
            <div class="section-title">Chief Complaints</div>
            <ul>${list(prescription.chiefComplaints)}</ul>
          </div>
          <div class="section right">
            <div class="section-title">Clinical Findings</div>
            <ul>${list(prescription.clinicalFindings)}</ul>
          </div>
        </div>
        <div class="diagnosis">
          <strong>Diagnosis:</strong>
          <div style="margin-top: 4px;">${escapeHtml(prescription.diagnosis)}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:44%">Medicine Name</th>
              <th style="width:28%">Dosage</th>
              <th style="width:28%">Duration</th>
            </tr>
          </thead>
          <tbody>${medicineRows}</tbody>
        </table>
        <div class="advice">
          <strong>Advice:</strong>
          <ul style="margin-top: 6px;">${list(prescription.advice)}</ul>
        </div>
        <div class="follow-up">Follow Up: ${escapeHtml(formatDate(prescription.followUpDate))}</div>
        <div class="footer">Substitute with equivalent generics as required.</div>
      </div>
    </body>
  </html>
  `;
}

export function printPrescription(prescription: Prescription) {
  const html = createPrescriptionHtml(prescription);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const frameDocument = iframe.contentWindow?.document;
  if (!frameDocument || !iframe.contentWindow) {
    document.body.removeChild(iframe);
    return;
  }

  frameDocument.open();
  frameDocument.write(html);
  frameDocument.close();

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    window.setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
}

export function downloadPrescription(prescription: Prescription) {
  const html = createPrescriptionHtml(prescription);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${prescription.fileName || `${prescription.patientName}-prescription`}.html`;
  anchor.click();
  URL.revokeObjectURL(url);
}
