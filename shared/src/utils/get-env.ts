import { Env } from "../models/env/env"

export function getEnv(): typeof process.env & Partial<Env> {
    try {
        return process.env;
    } catch {
        return {};
    }
}