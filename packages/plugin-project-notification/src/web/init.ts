import { notificationRouter } from '@roxavn/module-notification/web';
import { scopes, webRoutes } from '@roxavn/module-project/base';

export default function () {
  notificationRouter.add(scopes.Task.name, '*', (item) =>
    webRoutes.Task.generate({ taskId: item.resourceId })
  );
  notificationRouter.add(scopes.Project.name, '*', (item) =>
    webRoutes.Project.generate({ projectId: item.resourceId })
  );
}
