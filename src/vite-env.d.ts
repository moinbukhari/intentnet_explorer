/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute URL of the hosted API, required for native (Capacitor) builds. */
  readonly VITE_API_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
