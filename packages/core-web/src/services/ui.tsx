import { localeOption } from 'primereact/api';
import { confirmDialog } from 'primereact/confirmdialog';

const uiManager = {
  alertDialog(message: string, header?: string, icon = 'pi pi-info-circle') {
    confirmDialog({
      message,
      header: header || localeOption('notification', ''),
      icon,
      rejectClassName: 'hidden',
      breakpoints: { '960px': '50vw', '640px': '90vw' },
      style: { width: '500px' },
    });
  },
  errorDialog(error: { type: string; message: string }, header?: string) {
    this.alertDialog(
      [error.message, error.type].join(' - '),
      header || localeOption('error', ''),
      'pi pi-exclamation-circle'
    );
  },
};

export { uiManager };
