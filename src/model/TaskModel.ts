import mongoose, { Schema, Document } from "mongoose";
import { ITask } from "../interface/ITask";

export interface ITaskDocument extends ITask, Document { }

// Schema para los comentarios
const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now }
});

// Schema principal de Task
const TaskSchema = new Schema<ITaskDocument>({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, required: true },
    priority: { type: String, },
    workspace: { type: Schema.Types.ObjectId, ref: "WorkSpace", required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: null },
});

export const TaskModel = mongoose.model<ITaskDocument>("Task", TaskSchema);