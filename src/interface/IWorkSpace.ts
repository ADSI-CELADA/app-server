import { IUser } from "./IUser";

export interface IWorkSpace {
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