import { webModule as utilsWebModule } from '@roxavn/module-utils/web';

export default function () {
  utilsWebModule.adminPluginRegisters.push(() => import('./register'));
}
