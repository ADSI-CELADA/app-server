import { Model } from "mongoose";
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

    public async updateWorkSpace(id: string, workSpaceData: Partial<IWorkSpace>, userId: string): Promise<IWorkSpace> {
        try {
            // Buscar el workspace
            const workspace = await this.workSpaceModel.findById(id);

            if (!workspace) {
                throw new Error("Workspace no encontrado");
            }

            // Verificar qué rol tiene el usuario
            const userRole = this.getUserRole(workspace, userId);

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

    public async deleteWorkSpace(id: string, userId: string): Promise<void> {
        try {
            // Buscar el workspace
            const workspace = await this.workSpaceModel.findById(id);

            if (!workspace) {
                throw new Error("Workspace no encontrado");
            }

            // Verificar qué rol tiene el usuario
            const userRole = this.getUserRole(workspace, userId);

            // Verificar si tiene permiso para eliminar
            if (!RolePermissions.can(userRole, "delete")) {
                throw new Error("No tienes permiso para eliminar este workspace");
            }

            // Eliminar el workspace
            await this.workSpaceModel.findByIdAndDelete(id);
        } catch (error: any) {
            throw new Error(`Error al eliminar workspace: ${error.message}`);
        }
    }

    // Método privado para obtener el rol de un usuario en un workspace
    private getUserRole(workspace: IWorkSpaceDocument, userId: string): string {
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