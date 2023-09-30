/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  VITE_BEACON_URL: string;
  VITE_TURN_URL: string;
  VITE_TURN_USER: string;
  VITE_TURN_CRED: string;
}
