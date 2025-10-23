import { Request, RequestHandler, Response, Router } from "express";
import { WorkSpaceController } from "../controller/WorkSpaceController";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { IAuthRequest } from "../interface/IAuth";

export class WorkSpaceRouter {
    public router: Router;
    private controller: WorkSpaceController;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.controller = new WorkSpaceController();
        this.authMiddleware = new AuthMiddleware();
        this.routes();
    }

    private routes(): void {

        // Crear un workspace (requiere autenticación)
        this.router.post(
            "/workspaces", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.createWorkSpace(req as IAuthRequest, res)
        );
        
        // Obtener todos los workspaces (requiere autenticación)
        this.router.get(
            "/workspaces", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.getAllWorkSpaces(req, res)
        );

        // Obtener un workspace por ID (requiere autenticación)
        this.router.get(
            "/workspaces/:id", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.getWorkSpaceById(req, res)
        );

        // Actualizar un workspace (requiere autenticación y permisos)
        this.router.put(
            "/workspaces/:id", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.updateWorkSpace(req as IAuthRequest, res)
        );

        // Eliminar un workspace (requiere autenticación y permisos)
        this.router.delete(
            "/workspaces/:id", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.deleteWorkSpace(req as IAuthRequest, res)
        );
    }
}