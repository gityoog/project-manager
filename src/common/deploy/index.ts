import DeployBasic from "./basic"
import DeployByPost from "./post"

export default class DeployService {
  static factory(type: string): DeployBasic | null {
    if (type === 'Post') {
      return new DeployByPost()
    }
    return null
  }
}