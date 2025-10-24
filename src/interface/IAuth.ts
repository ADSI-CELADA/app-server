import { Request } from "express";
import { ObjectId } from "mongoose";

export interface IAuthRequest extends Request {
    user : IJwtPayload;
} 

export interface IJwtPayload {
  id: ObjectId;
  email: string;
  role: string;
  iat?: number; 
  exp?: number; 
}