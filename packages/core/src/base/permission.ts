export interface Scope {
  name: string;
  idParam?: string;
}

export interface Permission {
  value: string;
  allowedScopes: Scope[];
}

export interface Role {
  name: string;
  scope: Scope;
  permissions: Permission[];
}

const scopeEquals = (scopeA: Scope, scopeB: Scope): boolean => {
  return (
    scopeA === scopeB ||
    (scopeA.name === scopeB.name && scopeA.idParam === scopeB.idParam)
  );
};

class ScopeManager {
  private scopes: Scope[] = [];

  public register(...scopes: Scope[]): void {
    const newScopes = [...this.scopes, ...scopes];
    this.validateInputScopes(newScopes);
    this.scopes = newScopes;
  }

  public hasScope(scope: Scope): boolean {
    return this.scopes.some((iterScope) => {
      return scopeEquals(iterScope, scope);
    });
  }

  public getScopes() {
    return [...this.scopes];
  }

  public getScopeNames(): string[] {
    return this.scopes.map((scope) => {
      return scope.name;
    });
  }

  private validateInputScopes(scopes: Scope[]): void {
    const types = new Set(scopes.map((scope) => scope.name));
    const isValidTypes = types.size === scopes.length;

    if (!isValidTypes) {
      throw new Error('Duplicate scope type');
    }
  }
}

class PermissionManager {
  private readonly permissions: Permission[] = [];

  constructor(private readonly scopeManager: ScopeManager) {}

  public register(...permissions: Permission[]): void {
    this.validateInputPermissions(permissions);
    this.permissions.push(...permissions);
  }

  public hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }

  public getPermissionsByScopeName(scopeName: string): Permission[] {
    return this.permissions.filter((permission) => {
      return permission.allowedScopes.some((scope) => scope.name === scopeName);
    });
  }

  public getPermissionValuesByScopeName(scopeName: string): string[] {
    return this.getPermissionsByScopeName(scopeName).map((permission) => {
      return permission.value;
    });
  }

  private validateInputPermissions(permissions: Permission[]): void {
    permissions.forEach((permission) => {
      const isValidScopes = permission.allowedScopes.every((scope) => {
        return this.scopeManager.hasScope(scope);
      });

      if (!isValidScopes) {
        throw new Error('Unregistered scope');
      }
    });
  }
}

class RoleManager {
  private readonly roles: Role[] = [];

  constructor(
    private readonly scopeManager: ScopeManager,
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

  public getRolesByScopeName(scopeName: string): Role[] {
    return this.roles.filter((role) => {
      return role.scope.name === scopeName;
    });
  }

  private validateInputRoles(roles: Role[]): void {
    roles.forEach((role) => {
      const isValidScope = this.scopeManager.hasScope(role.scope);
      if (!isValidScope) {
        throw new Error('Unregistered scope');
      }

      const isValidPermissions = role.permissions.every((permission) => {
        return this.permissionManager.hasPermission(permission);
      });
      if (!isValidPermissions) {
        throw new Error('Unregistered permission');
      }

      const isValidPermissionScopes = role.permissions.every((permission) => {
        return permission.allowedScopes.some((scope) => {
          return scopeEquals(scope, role.scope);
        });
      });
      if (!isValidPermissionScopes) {
        throw new Error('Conflict role permission scope');
      }
    });
  }
}

export const scopeManager = new ScopeManager();
export const permissionManager = new PermissionManager(scopeManager);
export const predefinedRoleManager = new RoleManager(
  scopeManager,
  permissionManager
);
