import { config, DotenvConfigOutput } from "dotenv";

export class Enviroment {

    public initConfig: DotenvConfigOutput;
    
    constructor() {
        this.initConfig = config()
    }

}