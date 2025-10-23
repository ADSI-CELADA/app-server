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
            
            if (!userId) {
                return res.status(401).json({ message: "Usuario no autenticado" });
            }

            // Asignar el usuario autenticado como owner
            req.body.owner = userId;
            
            const workSpace = await this.workSpaceService.createWorkSpace(req.body);
            
            return res.status(201).json({ 
                message: "Workspace creado exitosamente",
                workSpace 
            });
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
            // Si es un error de permisos, retornar 403
            if (error.message.includes("permiso")) {
                return res.status(403).json({ message: error.message });
            }
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
            // Si es un error de permisos, retornar 403
            if (error.message.includes("permiso")) {
                return res.status(403).json({ message: error.message });
            }
            return res.status(500).json({ message: error.message });
        }
    }

}