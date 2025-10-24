import { ObjectId } from "mongoose";


export interface ITask {

    title: string;
    subtitle : string;
    description : string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority : 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    comments: IComment[];
    createdBy: ObjectId;
    workspace: ObjectId;
    assignedTo: ObjectId;
    createdAt : Date;
    updateAt : Date;

}

export interface IComment {
    user: string; 
    text: string;
    createdAt: Date;
}