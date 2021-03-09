import { createApp } from "vue"
import App from "./App.vue"
import "./index.css"

declare global {
  interface Window {
    backendURL: string
  }
}

// @ts-expect-error i don't want to change my tsconfig
window.backendURL = import.meta.env.PROD ? window.location.host : "http://localhost:8000"

createApp(App).mount("#app")
