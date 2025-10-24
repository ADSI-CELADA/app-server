import { Model, ObjectId } from "mongoose";
import { IWorkSpaceDocument, WorkSpaceModel } from "../model/WorkSpaceModel";
import { IWorkSpace } from "../interface/IWorkSpace";
import { RolePermissions } from "../utils/RolePermisions";

export class WorkSpaceService {

    private workSpaceModel: Model<IWorkSpaceDocument> = WorkSpaceModel;

    public async createWorkSpace(workSpace: IWorkSpace): Promise<IWorkSpace> {
        const newWorkSpace = new this.workSpaceModel(workSpace);
        return await newWorkSpace.save();
    }

    public async getAllWorkSpaces(): Promise<IWorkSpace[]> {
        try {
            const workSpaces = await this.workSpaceModel
                .find()
                .populate("members.user", "name")
                .populate("owner", "name");
            return workSpaces;
        } catch (error: any) {
            throw new Error(`Error al obtener workspaces: ${error.message}`);
        }
    }

    public async getWorkSpaceById(id: string): Promise<IWorkSpace | null> {
        try {
            const workSpace = await this.workSpaceModel
                .findById(id)
                .populate("members.user", "name")
                .populate("owner", "name");

            if (!workSpace) {
                throw new Error("Workspace no encontrado");
            }

            return workSpace;
        } catch (error: any) {
            throw new Error(`Error al obtener workspace: ${error.message}`);
        }
    }

    public async updateWorkSpace(id: string, workSpaceData: Partial<IWorkSpace>, userId: ObjectId): Promise<IWorkSpace> {
        try {
            // Buscar el workspace
            const workspace = await this.workSpaceModel.findById(id);

            if (!workspace) {
                throw new Error("Workspace no encontrado");
            }

            // Verificar qué rol tiene el usuario
            const userRole = RolePermissions.getUserRole(workspace, userId);

            // Verificar si tiene permiso para actualizar
            if (!RolePermissions.can(userRole, "update")) {
                throw new Error("No tienes permiso para actualizar este workspace");
            }

            // Actualizar el workspace
            const updatedWorkSpace = await this.workSpaceModel.findByIdAndUpdate(
                id,
                { $set: workSpaceData },
                { new: true }
            );

            return updatedWorkSpace!;
        } catch (error: any) {
            throw new Error(`Error al actualizar workspace: ${error.message}`);
        }
    }

    public async deleteWorkSpace(id: string, userId: ObjectId): Promise<void> {
        try {
            const workspace = await this.workSpaceModel.findById(id);

            if (!workspace) {
                throw new Error("Workspace no encontrado");
            }

            const userRole = RolePermissions.getUserRole(workspace, userId);

            if (!RolePermissions.can(userRole, "delete")) {
                throw new Error("No tienes permiso para eliminar este workspace");
            }

            await this.workSpaceModel.findByIdAndDelete(id);
        } catch (error: any) {
            throw new Error(`Error al eliminar workspace: ${error.message}`);
        }
    }

    public async addMember(workspaceId: string, userIdToAdd: ObjectId, role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
        requestingUserId: ObjectId): Promise<IWorkSpace> {
        try {
            const workspace = await this.workSpaceModel.findById(workspaceId);

            if (!workspace) {
                throw new Error("Workspace no encontrado");
            }

            const userRole = RolePermissions.getUserRole(workspace, requestingUserId);

            if (!RolePermissions.can(userRole, "addMember")) {
                throw new Error("No tienes permiso para añadir miembros a este workspace");
            }

            const isMember = workspace.members.some(
                (member) => member.user.toString() === userIdToAdd.toString()
            );

            if (isMember) {
                throw new Error("El usuario ya es miembro de este workspace");
            }

            if (userRole === "ADMIN" && role === "OWNER") {
                throw new Error("Solo el OWNER puede asignar el rol de OWNER a otros usuarios");
            }

            const newMember = {
                user: userIdToAdd,
                role: role,
                joinedAt: new Date()
            };

            const updatedWorkspace = await this.workSpaceModel.findByIdAndUpdate(
                workspaceId,
                { $push: { members: newMember } },
                { new: true }
            ).populate("members.user", "name email")
                .populate("owner", "name email");

            return updatedWorkspace!;
        } catch (error: any) {
            throw new Error(`Error al añadir miembro: ${error.message}`);
        }
    }

    public async updateMemberRole(workspaceId: string, memberUserId: ObjectId, newRole: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER",
        requestingUserId: ObjectId): Promise<IWorkSpace> {
        try {
            const workspace = await this.workSpaceModel.findById(workspaceId);

            if (!workspace) {
                throw new Error("Workspace no encontrado");
            }

            const userRole = RolePermissions.getUserRole(workspace, requestingUserId);

            if (!RolePermissions.can(userRole, "updateMemberRole")) {
                throw new Error("No tienes permiso para cambiar roles de miembros");
            }

            if (newRole === "OWNER" && userRole !== "OWNER") {
                throw new Error("Solo el OWNER puede asignar el rol de OWNER");
            }

            const memberExists = workspace.members.some(
                (member) => member.user.toString() === memberUserId.toString()
            );

            if (!memberExists) {
                throw new Error("El usuario no es miembro de este workspace");
            }

            const updatedWorkspace = await this.workSpaceModel.findOneAndUpdate(
                {
                    _id: workspaceId,
                    "members.user": memberUserId
                },
                {
                    $set: { "members.$.role": newRole }
                },
                { new: true }
            ).populate("members.user", "name email")
                .populate("owner", "name email");

            return updatedWorkspace!;
        } catch (error: any) {
            throw new Error(`Error al actualizar rol del miembro: ${error.message}`);
        }
    }

    // Remover un miembro del workspace
    public async removeMember(workspaceId: string, memberUserId: ObjectId, requestingUserId: ObjectId): Promise<IWorkSpace> {
        try {
            const workspace = await this.workSpaceModel.findById(workspaceId);

            if (!workspace) {
                throw new Error("Workspace no encontrado");
            }

            const userRole = RolePermissions.getUserRole(workspace, requestingUserId);

            if (!RolePermissions.can(userRole, "removeMember")) {
                throw new Error("No tienes permiso para remover miembros");
            }

            if (workspace.owner.toString() === memberUserId.toString()) {
                throw new Error("No se puede remover al propietario del workspace");
            }

            const updatedWorkspace = await this.workSpaceModel.findByIdAndUpdate(workspaceId,
                { $pull: { members: { user: memberUserId } } },
                { new: true })
                .populate("members.user", "name email")
                .populate("owner", "name email");

            return updatedWorkspace!;
        } catch (error: any) {
            throw new Error(`Error al remover miembro: ${error.message}`);
        }
    }


}