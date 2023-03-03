import { webModule as userWebModule } from '@roxavn/module-user/web';

userWebModule.mePluginRegisters.push(() => import('./register'));
