import WRequest from "wrequest"

export default class Status {
  loading = false
  error = false
  msg = ''

  private wrequest: WRequest<any> | null = null
  use<T>(wrequest: WRequest<T>) {
    this.wrequest = wrequest
    return wrequest.load(() => {
      if (this.wrequest !== wrequest) {
        return
      }
      this.msg = 'Loading'
      this.loading = true
    }).after.success(() => {
      if (this.wrequest !== wrequest) {
        return
      }
      this.error = false
    }).after.fail(e => {
      if (this.wrequest !== wrequest) {
        return
      }
      this.msg = e
      this.error = true
    }).final(() => {
      if (this.wrequest !== wrequest) {
        return
      }
      this.loading = false
      this.wrequest = null
    })
  }

  fail(msg: string) {
    this.loading = false
    this.error = true
    this.msg = msg
    this.wrequest = null
  }

  normal() {
    this.loading = false
    this.error = false
    this.msg = ''
    this.wrequest = null
  }


  destroy() {
    if (this.wrequest) {
      this.wrequest.destroy()
    }
    this.wrequest = null
  }
}