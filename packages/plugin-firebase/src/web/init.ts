import { webModule as utilsWebModule } from '@roxavn/module-utils/web';

utilsWebModule.adminPluginRegisters.push(() => import('./register'));
