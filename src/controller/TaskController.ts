import { Request, Response } from "express";
import { TaskService } from "../service/TaskService";
import { IAuthRequest } from "../interface/IAuth";
import { ObjectId } from "mongoose";




export class TaskController {

    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    public async createTask(req: IAuthRequest, res: Response): Promise<Response> {
        try {

            const userId = req.user?.id;

            if (!userId) return res.status(401).json({ message: "Usuario no autenticado" });

            const newtask = await this.taskService.createTask(req.body, userId);

            return res.status(201).json({ data: newtask })


        } catch (error: any) {
            return res.status(500).json({ error : error.message })
        }

    }

}