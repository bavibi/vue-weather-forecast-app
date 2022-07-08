/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WEATHER_FORECAST_API_URI: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}