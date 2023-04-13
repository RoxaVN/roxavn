import { webModule as uploadWebModule } from '@roxavn/module-upload/web';

export default function () {
  uploadWebModule.adminPluginRegisters.push(() => import('./register'));
}
