import { Model, ObjectId } from "mongoose";
import { ITaskDocument, TaskModel } from "../model/TaskModel";
import { ITask } from "../interface/ITask";
import { RolePermissions } from "../utils/RolePermisions";
import { IWorkSpaceDocument, WorkSpaceModel } from "../model/WorkSpaceModel";




export class TaskService {

    private taskModel: Model<ITaskDocument> = TaskModel;
    private workSpaceModel: Model<IWorkSpaceDocument> = WorkSpaceModel;

    public async createTask(task: ITask, userId: ObjectId): Promise<ITask> {
        try {

            const workspace = await this.workSpaceModel.findById(task.workspace);

            if (!workspace) {
                throw new Error("Workspace no encontrado");
            };

            const userRole = RolePermissions.getUserRole(workspace, userId);

            if (!RolePermissions.can(userRole, "create_task")) {
                throw new Error("No tienes permiso para crear tareas");
            }

            task.createdBy = userId;

            const newTask = new this.taskModel(task);
            return await newTask.save();


        } catch (error) {
            throw error;
        }

    }

    public async getAllTasks(workSpaceId: ObjectId): Promise<ITask[]> {
        try {
            const tasks = await this.taskModel.find({ workspace: workSpaceId })
                .populate("assignedTo", "name email")
                .populate("createdBy", "name email")
                .populate("comments.user", "name email")
                .sort({ createAt: -1 });

            return tasks;
        } catch (error) {
            throw error;
        }
    }

    public async getTaskById(id: ObjectId): Promise<ITask | null> {
        try {
            const task = await this.taskModel.findById(id)
                .populate("assignedTo", "name email")
                .populate("createdBy", "name email")
                .populate("comments.user", "name email");

            if (!task) throw new Error("TASK_NOT_FOUND")

            return task;

        } catch (error) {
            throw error;
        }
    }

    public async updateTask(taskId: ObjectId, updateData: Partial<ITask>, userId: ObjectId): Promise<ITaskDocument | undefined | null> {
        try {
            const task = await this.taskModel.findById(taskId);
            if (!task) throw new Error("Tarea no encontrada");

            const workspace = await this.workSpaceModel.findById(task.workspace);
            if (!workspace) throw new Error("Workspace de la tarea no encontrado");

            const userRole = RolePermissions.getUserRole(workspace, userId);

            if (!RolePermissions.can(userRole, "update_task")) {
                throw new Error("No tienes permiso para actualizar esta tarea");
            };

            updateData.updateAt = new Date();

            const updateTask = await this.taskModel.findByIdAndUpdate(taskId, updateData, {
                new: true,
                runValidators: true
            })

            return updateTask;


        } catch (error: any) {
            throw new Error(error)
        }

    }

    public async deleteTask(taskId: ObjectId, userId: ObjectId): Promise<void> {
        try {

            const task = await this.taskModel.findById(taskId);
            if (!task) throw new Error("Tarea no encontrada");

            const workspace = await this.workSpaceModel.findById(task.workspace);
            if (!workspace) throw new Error("Workspace de la tarea no encontrado");

            const userRole = RolePermissions.getUserRole(workspace, userId)

            if (!RolePermissions.can(userRole, "delete_task")) {
                throw new Error("No tienes permiso para eliminar esta tarea");
            }

            await this.taskModel.findByIdAndDelete(taskId);


        } catch (error) {
            throw error;
        }
    }
}