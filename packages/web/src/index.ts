import '@/style/index.scss'
import App from "./app"

declare global {
  interface Window {
    app: App
  }
}

window.app = new App()