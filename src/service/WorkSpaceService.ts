import { Model } from "mongoose";
import { IWorkSpaceDocument, WorkSpaceModel } from "../model/WorkSpaceModel";
import { IWorkSpace } from "../interface/IWorkSpace";



export class WorkSpaceService {

    private workSpaceModel: Model<IWorkSpaceDocument> = WorkSpaceModel;

    public async createWorkSpace(workSpace: IWorkSpace): Promise<IWorkSpace> {
        try {
            const newWorkSpace = new this.workSpaceModel(workSpace)
            return await newWorkSpace.save();
        } catch (error: any) {
            throw error;
        }
    }

    public async getAllWorkSpaces() {
        try {
            const workSpaces = await this.workSpaceModel.find();
            return workSpaces;
        } catch (error: any) {
            throw error;
        }
    }

    public async getWorkSpaceById(id: string) {
        try {
            const workSpaceId = await this.workSpaceModel.findById(id);
            return workSpaceId;
        } catch (error: any) {
            throw new error;
        }
    }

    public async updateWorkSpace(id: string, workSpace: Partial<IWorkSpace>) {
        try {
            const updateWorkSpace = await this.workSpaceModel.findByIdAndUpdate(id, {$set : workSpace}, {new : true});
            return updateWorkSpace; 
        } catch (error: any) {
            throw error;
        }
    }

    public async deleteWorkSpace(id: string) {
        try {
            const deleteWorkSpace = await this.workSpaceModel.findByIdAndDelete(id);
            return deleteWorkSpace; 
        } catch (error: any) {
            throw error;
        }
    }


}