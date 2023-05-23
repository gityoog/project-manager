import { iEnvEditor } from "."

export default class IEnvEditor implements iEnvEditor {
  data: {
    key: string
    value: string
  }[] = []
  add() {
    this.data.push({
      key: '',
      value: ''
    })
  }
  remove(index: number) {
    this.data.splice(index, 1)
  }

  setData(data: {
    key: string
    value: string
  }[]) {
    this.data = data.map(item => ({ key: item.key, value: item.value }))
    if (this.data.length === 0) {
      this.add()
    }
  }

  getData() {
    return this.data.map(item => ({ key: item.key, value: item.value })).filter(item => item.key)
  }
}