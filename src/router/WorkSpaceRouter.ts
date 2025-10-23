import { Request, RequestHandler, Response, Router } from "express";
import { UserController } from "../controller/UserController";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { WorkSpaceController } from "../controller/WorkSpaceController";

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

        this.router.post("/createWorkSpace", this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
        (req: Request, res: Response) => this.controller.createWorkSpace(req, res));
        
        this.router.get("/workSpaces", this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
        (req: Request, res: Response) => this.controller.getAllWorkSpaces(req, res));

        this.router.get("/workSpace/:id", this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
        (req: Request, res: Response) => this.controller.getWorkSpaceById(req, res));

        this.router.put("/workSpace/:id", this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
        (req: Request, res: Response) => this.controller.updateWorkSpace(req, res));

        this.router.delete("/workSpace/:id", this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
        (req: Request, res: Response) => this.controller.deleteWorkSpace(req, res));

        
    }
}
