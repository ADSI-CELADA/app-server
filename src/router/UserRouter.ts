import { Request, Response, Router } from "express";
import { UserController } from "../controller/UserController";


export class UserRouter {
    public router: Router;
    public controller: UserController;

    constructor() {
        this.router = Router();
        this.controller = new UserController();
        this.routes();
    }

    routes(): void {
        this.router.post('/createUser', (req: Request, res: Response) => this.controller.create(req, res));
        this.router.post('/loginUser', (req: Request, res: Response) => this.controller.login(req, res));
    }
}