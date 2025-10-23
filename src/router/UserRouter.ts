import { Request, RequestHandler, Response, Router } from "express";
import { UserController } from "../controller/UserController";
import { AuthMiddleware } from "../middleware/authMiddleware";

export class UserRouter {
    public router: Router;
    private controller: UserController;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.controller = new UserController();
        this.authMiddleware = new AuthMiddleware();
        this.routes();
    }

    private routes(): void {
        this.router.post("/createUser", (req: Request, res: Response) => this.controller.create(req, res));
        this.router.post("/loginUser", (req: Request, res: Response) => this.controller.login(req, res));
    }
}
