import mongoose, { Schema, Document } from "mongoose";
import { IWorkSpace } from "../interface/IWorkSpace";

export interface IWorkSpaceDocument extends IWorkSpace, Document { }

const WorkSpaceMemberSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER", "VIEWER"],
      default: "OWNER",
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WorkSpaceSchema = new Schema<IWorkSpaceDocument>({
  name_workspace: { type: String, required: true },
  description: { type: String, required: true },
  members: { type: [WorkSpaceMemberSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export const WorkSpaceModel = mongoose.model<IWorkSpaceDocument>("WorkSpace", WorkSpaceSchema);
