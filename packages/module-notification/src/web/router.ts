import { NotificationResponse } from '../base/index.js';

type To = (notification: NotificationResponse) => string;

class NotificationRouter {
  private routes: Record<string, Record<string, To>> = {};

  add(resource: string, action: string, to: To) {
    let resourceRoute = this.routes[resource];
    if (!resourceRoute) {
      resourceRoute = {};
      this.routes[resource] = resourceRoute;
    }
    resourceRoute[action] = to;
  }

  getPath(notification: NotificationResponse) {
    const resourceRoute = this.routes[notification.resource];
    if (resourceRoute) {
      const to = resourceRoute[notification.action] || resourceRoute['*'];
      return to(notification);
    }
    return null;
  }
}

export const notificationRouter = new NotificationRouter();
