const i18n = {
  'zh-CN': {
    cancel: '取 消',
    sbumit: '确 定',
    close: '关 闭',
    wait: '请稍后'
  },
  'en': {
    cancel: 'Cancel',
    sbumit: 'Submit',
    close: 'Close',
    wait: 'Please wait'
  }
}
class ElDialogI18n {
  lang!: string
  t!: typeof i18n[keyof typeof i18n]
  constructor() {
    this.setLang('zh-CN')
  }
  setLang(lang: string) {
    this.lang = lang
    this.t = i18n[lang as keyof typeof i18n] || i18n['en']
  }
}
export default new ElDialogI18n()