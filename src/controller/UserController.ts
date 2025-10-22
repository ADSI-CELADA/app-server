import { Request, Response } from "express";
import { UserService } from "../service/UserService";

export class UserController {

    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async create(req: Request, res: Response): Promise<Object> {
        try {
            const user = await this.userService.createUser(req.body);
            return res.status(201).json({ user });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }
    };

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const {email, password} = req.body;
            const { token, user } = await this.userService.loginUser(email, password);
            res.status(200).json({ data : "LOGIN_OK", token, user })
        } catch (error) {
            res.status(401).json({ message: (error as Error).message });
        }
    }


}