import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interface/IUser";

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
