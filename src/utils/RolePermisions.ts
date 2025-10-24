import { ObjectId } from "mongoose";
import { IWorkSpaceDocument } from "../model/WorkSpaceModel";

export class RolePermissions {
  private static readonly permissions = {
    OWNER: ["read", "update", "delete", "add_member", "remove_member", "update_member",  "create_task", "update_task", "delete_task"],
    ADMIN: ["read", "update", "add_member", "remove_member", "create_task", "update_task", "delete_task"],
    MEMBER: ["read", "create_task"],
    VIEWER: ["read"],
  };

  static can(role: string, action: string): boolean {
    const allowed = this.permissions[role as keyof typeof this.permissions];
    return allowed ? allowed.includes(action) : false;
  }

    static getUserRole(workspace: IWorkSpaceDocument, userId: string | ObjectId): string {
        // Si es el dueño, retornar OWNER
        if (workspace.owner.toString() === userId) {
            return "OWNER";
        }

        // Buscar si es miembro y retornar su rol
        const member = workspace.members.find(
            m => m.user.toString() === userId
        );

        // Si es miembro, retornar su rol, si no, es VIEWER
        return member ? member.role : "VIEWER";
    }

}
