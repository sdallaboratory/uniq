export interface Env {
    NODE_ENV: 'production' | 'development';
    PROXY_EXPOSED_PORT: string;
    MONGO_EXPOSED_PORT: string;
    MONGO_DATA_PATH: string;
    MONGO_INITDB_ROOT_USERNAME: string;
    MONGO_INITDB_ROOT_PASSWORD: string;
}