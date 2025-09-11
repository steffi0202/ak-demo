/// <reference types="vite/client" />

declare module '*.css';

interface ImportMetaEnv {
  readonly VITE_BFF_BASE: string
  readonly VITE_SCOPE_EMAIL: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}