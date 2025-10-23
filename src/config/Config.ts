import { config, DotenvConfigOutput } from "dotenv";

export class Environment {
    private static instance: Environment;
    private initConfig: DotenvConfigOutput;

    private constructor() {
        this.initConfig = config();

        if (this.initConfig.error) {
            console.error("Error cargando .env:", this.initConfig.error);
            throw new Error("No se pudo cargar el archivo .env");
        }
    }

    public static getInstance(): Environment {
        if (!Environment.instance) {
            Environment.instance = new Environment();
        }
        
        return Environment.instance;
    }

    public get(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`Variable de entorno no encontrada: ${key}`);
        }
        return value;
    }
}
