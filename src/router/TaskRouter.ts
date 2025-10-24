import { Request, RequestHandler, Response, Router } from "express";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { IAuthRequest } from "../interface/IAuth";
import { TaskController } from "../controller/TaskController";

export class TaskRouter {
    public router: Router;
    private controller: TaskController;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.controller = new TaskController();
        this.authMiddleware = new AuthMiddleware();
        this.routes();
    }

    private routes(): void {

        // Crear un workspace (requiere autenticación)
        this.router.post(
            "/tasks", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.createTask(req as IAuthRequest, res)
        );
    }
}