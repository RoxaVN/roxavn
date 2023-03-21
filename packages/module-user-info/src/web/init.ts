import { webModule as userWebModule } from '@roxavn/module-user/web';

export default function () {
  userWebModule.mePluginRegisters.push(() => import('./register'));
}
