import { webModule as userWebModule } from '@roxavn/module-user/web';

userWebModule.adminPluginRegisters.push(() => import('./register'));
