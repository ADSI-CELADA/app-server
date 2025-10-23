import { Request } from "express";

export interface IAuthRequest extends Request {
    user : IJwtPayload;
} 

export interface IJwtPayload {
  id: string;
  email: string;
  role: string;
  iat?: number; 
  exp?: number; 
}