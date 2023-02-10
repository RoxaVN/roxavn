export interface Resource {
  type: string;
  hasId: boolean;
}

export interface Permission {
  value: string;
  allowedResources: Resource[];
}

export interface Role {
  name: string;
  resource: Resource;
  permissions: Permission[];
}

const resourceEquals = (resourceA: Resource, resourceB: Resource): boolean => {
  return (
    resourceA === resourceB ||
    (resourceA.type === resourceB.type && resourceA.hasId === resourceB.hasId)
  );
};

class ResourceManager {
  private resources: Resource[] = [];

  public register(...resources: Resource[]): void {
    const newResources = [...this.resources, ...resources];
    this.validateInputResources(newResources);
    this.resources = newResources;
  }

  public hasResource(resource: Resource): boolean {
    return this.resources.some((iterResource) => {
      return resourceEquals(iterResource, resource);
    });
  }

  public getResources() {
    return [...this.resources];
  }

  public getResourceTypes(): string[] {
    return this.resources.map((resource) => {
      return resource.type;
    });
  }

  private validateInputResources(resources: Resource[]): void {
    const types = new Set(resources.map((resource) => resource.type));
    const isValidTypes = types.size === resources.length;

    if (!isValidTypes) {
      throw new Error('Duplicate resource type');
    }
  }
}

class PermissionManager {
  private readonly permissions: Permission[] = [];

  constructor(private readonly resourceManager: ResourceManager) {}

  public register(...permissions: Permission[]): void {
    this.validateInputPermissions(permissions);
    this.permissions.push(...permissions);
  }

  public hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }

  public getPermissionsByResourceType(resourceType: string): Permission[] {
    return this.permissions.filter((permission) => {
      return permission.allowedResources.some(
        (resource) => resource.type === resourceType
      );
    });
  }

  public getPermissionValuesByResourceType(resourceType: string): string[] {
    return this.getPermissionsByResourceType(resourceType).map((permission) => {
      return permission.value;
    });
  }

  private validateInputPermissions(permissions: Permission[]): void {
    permissions.forEach((permission) => {
      const isValidResources = permission.allowedResources.every((resource) => {
        return this.resourceManager.hasResource(resource);
      });

      if (!isValidResources) {
        throw new Error('Unregistered resource');
      }
    });
  }
}

class RoleManager {
  private readonly roles: Role[] = [];

  constructor(
    private readonly resourceManager: ResourceManager,
    private readonly permissionManager: PermissionManager
  ) {}

  public register(...roles: Role[]): void {
    this.validateInputRoles(roles);
    this.roles.push(...roles);
  }

  public getRolesByPermission(permission: Permission): Role[] {
    return this.roles.filter((role) => {
      return role.permissions.includes(permission);
    });
  }

  public getRolesByResourceType(resourceType: string): Role[] {
    return this.roles.filter((role) => {
      return role.resource.type === resourceType;
    });
  }

  private validateInputRoles(roles: Role[]): void {
    roles.forEach((role) => {
      const isValidResource = this.resourceManager.hasResource(role.resource);
      if (!isValidResource) {
        throw new Error('Unregistered resource');
      }

      const isValidPermissions = role.permissions.every((permission) => {
        return this.permissionManager.hasPermission(permission);
      });
      if (!isValidPermissions) {
        throw new Error('Unregistered permission');
      }

      const isValidPermissionResources = role.permissions.every(
        (permission) => {
          return permission.allowedResources.some((resource) => {
            return resourceEquals(resource, role.resource);
          });
        }
      );
      if (!isValidPermissionResources) {
        throw new Error('Conflict role permission resource');
      }
    });
  }
}

export const resourceManager = new ResourceManager();
export const permissionManager = new PermissionManager(resourceManager);
export const predefinedRoleManager = new RoleManager(
  resourceManager,
  permissionManager
);
