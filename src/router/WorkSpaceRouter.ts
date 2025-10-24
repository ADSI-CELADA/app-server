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

        this.router.post(
            "/workspaces", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.createWorkSpace(req as IAuthRequest, res)
        );
        
        this.router.get(
            "/workspaces", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.getAllWorkSpaces(req, res)
        );

        this.router.get(
            "/workspaces/:id", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.getWorkSpaceById(req, res)
        );

        this.router.put(
            "/workspaces/:id", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.updateWorkSpace(req as IAuthRequest, res)
        );

        this.router.delete(
            "/workspaces/:id", 
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler, 
            (req: Request, res: Response) => this.controller.deleteWorkSpace(req as IAuthRequest, res)
        );


        this.router.post(
            "/workspaces/:id/members",
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler,
            (req: Request, res: Response) => this.controller.addMember(req as IAuthRequest, res)
        );

        this.router.patch(
            "/workspaces/:id/members/role",
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler,
            (req: Request, res: Response) => this.controller.updateMemberRole(req as IAuthRequest, res)
        );

        this.router.delete(
            "/workspaces/:id/members",
            this.authMiddleware.verifyToken.bind(this.authMiddleware) as RequestHandler,
            (req: Request, res: Response) => this.controller.removeMember(req as IAuthRequest, res)
        );
    }
}