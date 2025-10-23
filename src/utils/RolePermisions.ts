export class RolePermissions {
  private static readonly permissions = {
    OWNER: ["read", "update", "delete", "add_member", "remove_member", "create_task", "delete_task"],
    ADMIN: ["read", "update", "add_member", "remove_member", "create_task", "delete_task"],
    MEMBER: ["read", "create_task"],
    VIEWER: ["read"],
  };

  static can(role: string, action: string): boolean {
    const allowed = this.permissions[role as keyof typeof this.permissions];
    return allowed ? allowed.includes(action) : false;
  }
}
