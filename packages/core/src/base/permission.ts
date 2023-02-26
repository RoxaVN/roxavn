export interface Scope {
  name: string;
  idParam?: string;
  dynamicName?: (request: Record<string, any>) => string;
}

export interface Resource extends Scope {
  idParam: string;
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
