const i18n = {
  'zh-CN': {
    remove: {
      confirm: {
        title: '删除确认',
        message: '删除后不可恢复, 是否继续？'
      },
      success: {
        title: '删除操作',
        message: '删除成功'
      }
    }
  },
  'en': {
    remove: {
      confirm: {
        title: 'Delete',
        message: 'After deletion, it cannot be recovered. Continue?'
      },
      success: {
        title: 'Delete',
        message: 'Delete success'
      }
    }
  }
}
class TableListI18n {
  t!: typeof i18n[keyof typeof i18n]
  constructor() {
    this.setLang('zh-CN')
  }
  setLang(lang: string) {
    this.t = i18n[lang as keyof typeof i18n] || i18n['en']
  }
}
export default new TableListI18n()