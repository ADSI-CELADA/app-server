import jwt from "jsonwebtoken";
import { UserModel } from "../model/UserModel";
import { IUser } from "../interface/IUser"
import { compareSync, genSaltSync, hashSync } from "bcrypt";

export class UserService {

    private userModel = UserModel;

    public async createUser(user: IUser): Promise<IUser> {
        try {
            const salt = genSaltSync(10);
            const hash = hashSync(user.password, salt);
            user.password = hash;
            const newUser = new this.userModel(user);
            return await newUser.save();
        } catch (error: any) {
            throw new error;
        }
    }

    public async loginUser(email: string, password: string): Promise<{ token: string; user: IUser }> {
        try {
            const user = await this.userModel.findOne({ email });

            if (!user) throw new Error("ERROR_FOUND");

            const validatePassword: boolean = compareSync(password, user.password);

            if (!validatePassword) throw new Error("ERROR_FOUND");

            const token: string = jwt.sign({ id: user.id, email: user.email }, "348YGV3NRP3FOWR347PE3Y8", { expiresIn: '2h' });

            return { token, user };

        } catch (error: any) {
            throw new Error("Credentials incorrect");
        }
    }

}