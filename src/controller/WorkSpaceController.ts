import { Request, Response } from "express";
import { WorkSpaceService } from "../service/WorkSpaceService";

export class WorkSpaceController {

    private workSpaceService: WorkSpaceService;

    constructor() {
        this.workSpaceService = new WorkSpaceService();
    }

    public async createWorkSpace(req: Request, res: Response): Promise<Response> {
        try {
            const workSpace = await this.workSpaceService.createWorkSpace(req.body);
            return res.status(201).json({ workSpace })
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    public async getAllWorkSpaces(req: Request, res: Response): Promise<Response> {
        try {
            const workSpace = await this.workSpaceService.getAllWorkSpaces();
            return res.status(200).json({ workSpace })
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    public async getWorkSpaceById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const workSpace = await this.workSpaceService.getWorkSpaceById(id);
            return res.status(200).json({ workSpace })
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    public async updateWorkSpace(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const workSpace = await this.workSpaceService.updateWorkSpace(id, req.body);
            return res.status(201).json({ workSpace })
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

    public async deleteWorkSpace(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const workSpace = await this.workSpaceService.deleteWorkSpace(id);
            return res.status(201).json({ workSpace })
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    };

}