import { Configuration } from 'webpack'

export default abstract class iBaseConfigComponent {
  abstract getBaseConfig(): Configuration
  abstract getDevConfig(): Configuration
  abstract getProdConfig(): Configuration
}