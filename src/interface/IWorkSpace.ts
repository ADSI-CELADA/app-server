import { ObjectId } from "mongoose";
import { IUser } from "./IUser";

export interface IWorkSpace {
    owner: ObjectId;
    name_workspace: string;
    description: string;
    members: IWorkSpaceMember[];
    createdAt: Date;
}

interface IWorkSpaceMember {
    user: IUser;
    role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
    joinedAt: Date;
}