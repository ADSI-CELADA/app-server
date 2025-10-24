import { Request, Response } from "express";
import { WorkSpaceService } from "../service/WorkSpaceService";
import { IAuthRequest } from "../interface/IAuth";

export class WorkSpaceController {

    private workSpaceService: WorkSpaceService;

    constructor() {
        this.workSpaceService = new WorkSpaceService();
    }

    // Crear un nuevo workspace
    public async createWorkSpace(req: IAuthRequest, res: Response): Promise<Response> {
        try {
            const userId = req.user?.id;

            if (!userId) return res.status(401).json({ message: "Usuario no autenticado" });

            req.body.owner = userId;

            const workSpace = await this.workSpaceService.createWorkSpace(req.body);

            return res.status(201).json({ message: "Workspace creado exitosamente", workSpace });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Obtener todos los workspaces
    public async getAllWorkSpaces(req: Request, res: Response): Promise<Response> {
        try {
            const workSpaces = await this.workSpaceService.getAllWorkSpaces();

            return res.status(200).json({
                count: workSpaces.length,
                workSpaces
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Obtener un workspace por ID
    public async getWorkSpaceById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;

            const workSpace = await this.workSpaceService.getWorkSpaceById(id);

            if (!workSpace) {
                return res.status(404).json({ message: "Workspace no encontrado" });
            }

            return res.status(200).json({ workSpace });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Actualizar un workspace (requiere permisos)
    public async updateWorkSpace(req: IAuthRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            const workSpace = await this.workSpaceService.updateWorkSpace(
                id,
                req.body,
                userId
            );

            return res.status(200).json({
                message: "Workspace actualizado exitosamente",
                workSpace
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Eliminar un workspace (requiere permisos)
    public async deleteWorkSpace(req: IAuthRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            await this.workSpaceService.deleteWorkSpace(id, userId);

            return res.status(200).json({
                message: "Workspace eliminado exitosamente"
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    public async addMember(req: IAuthRequest, res: Response): Promise<Response> {
        try {
            const { id: workspaceId } = req.params;
            const { userId, role } = req.body;
            const requestingUserId = req.user?.id;

            if (!requestingUserId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            if (!userId) {
                return res.status(400).json({ message: "El ID del usuario es requerido" });
            }

            if (!role || !["OWNER", "ADMIN", "MEMBER", "VIEWER"].includes(role)) {
                return res.status(400).json({
                    message: "Rol inválido. Debe ser: OWNER, ADMIN, MEMBER o VIEWER"
                });
            }

            const workspace = await this.workSpaceService.addMember(
                workspaceId,
                userId,
                role,
                requestingUserId
            );

            return res.status(200).json({
                message: "Miembro añadido exitosamente",
                workspace
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Actualizar el rol de un miembro
    public async updateMemberRole(req: IAuthRequest, res: Response): Promise<Response> {
        try {
            const { id: workspaceId } = req.params;
            const { userId, role } = req.body;
            const requestingUserId = req.user?.id;

            if (!requestingUserId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            if (!userId || !role) {
                return res.status(400).json({
                    message: "El ID del usuario y el rol son requeridos"
                });
            }

            if (!["OWNER", "ADMIN", "MEMBER", "VIEWER"].includes(role)) {
                return res.status(400).json({
                    message: "Rol inválido. Debe ser: OWNER, ADMIN, MEMBER o VIEWER"
                });
            }

            const workspace = await this.workSpaceService.updateMemberRole(
                workspaceId,
                userId,
                role,
                requestingUserId
            );

            return res.status(200).json({
                message: "Rol actualizado exitosamente",
                workspace
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    // Remover un miembro del workspace
    public async removeMember(req: IAuthRequest, res: Response): Promise<Response> {
        try {
            const { id: workspaceId } = req.params;
            const { userId } = req.body;
            const requestingUserId = req.user?.id;

            if (!requestingUserId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            if (!userId) {
                return res.status(400).json({ message: "El ID del usuario es requerido" });
            }

            const workspace = await this.workSpaceService.removeMember(
                workspaceId,
                userId,
                requestingUserId
            );

            return res.status(200).json({
                message: "Miembro removido exitosamente",
                workspace
            });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

}