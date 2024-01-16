import ElLocaleZhCN from "@/common/element-ui/locale/zh-CN"

export default {
  lang: 'zh-CN',
  title: '项目管理可视化',
  el: ElLocaleZhCN,
  tabs: {
    other: '其他'
  },
  auth: {
    expired: '用户过期',
    expiredMessage: '用户验证已过期，是否重新验证？',
    password: '密码',
  },
  project: {
    card: {
      running: '运行中',
      exited: '已停止',
      build: '打包',
      more: '更多',
      runFail: '启动失败',
      terminal: '显示/关闭终端显示'
    },
    edit: {
      title: '项目信息',
      name: '项目名称',
      category: '项目类型',
      sort: '项目排序'
    },
    process: {
      default: '默认命令',
      namePrefix: '命令',
      add: '添加命令',
      context: '命令地址',
      setting: {
        title: '命令设置',
        encoding: '编码',
        env: {
          title: '环境变量',
          add: '添加环境变量',
        },
        autostart: {
          title: '自动启动',
          label: '跟随程序启动'
        },
        deploy: {
          title: '部署配置',
          type: '类型',
          post: {
            url: '上传地址',
            signKey: '签名秘钥',
            signScheme: '签名协议',
            formSignKey: '签名字段',
            formFileKey: '文件字段',
          }
        }
      }
    },
    detail: {
      title: '项目信息',
      other: '其他',
      process: {
        start: '启动',
        stop: '停止',
      },
      output: {
        filename: '文件名',
        size: '大小',
        time: '时间',
        version: '版本',
        action: '操作',
        download: '下载',
        remove: '删除',
        deploy: {
          title: '部署',
          run: '部署',
          stop: '停止',
          retry: '重试',
          deploying: '部署中',
          successfull: '部署成功',
          failed: '部署失败',
          tip: {
            failed: '部署失败',
            successfull: '部署成功'
          }
        }
      }
    }
  },
  category: {
    name: '名称',
    sort: '排序',
    time: '时间',
    action: '操作',
    save: '保存',
    cancel: '取消',
    add: '添加',
    edit: '编辑',
    remove: '删除',
    tip: {
      name: '请输入分类名称'
    }
  },
  logging: {
    target: '对象',
    action: '操作',
    user: '用户',
    ip: 'IP',
    time: '时间',
    description: '描述'
  },
  selector: {
    checkAll: '全选',
    remove: '删除',
    confirm: {
      title: '删除项目',
      message: (total: string | number) => `确定删除${total}个项目吗？`
    }
  },
  setting: {
    title: '系统设置',
    local: {
      title: '本地设置',
      language: '语言',
      pty: '终端',
      fontSize: '字体大小',
      fontFamily: '字体',
      stats: {
        title: '统计',
        tip: '是否在首页显示CPU/内存的使用信息',
      },
      reset: '重置',
      save: '保存',
      saveSuccess: '保存成功',
    },
    server: {
      title: '后台设置',
      cache: '缓存',
      clearOutput: '清空输出',
      clearLog: '清空日志',
      shell: '命令',
      pty: '终端',
      process: {
        title: '进程',
        keep: '重启保持状态',
      },
      reset: '重置',
      save: '保存',
      saveSuccess: '保存成功',
      clearOutputTitle: '清空打包记录',
      clearOutputMessage: '确定要清空所有打包记录和文件吗？',
      clearOutputSuccess: '清空成功',
      clearLogTitle: '清空日志',
      clearLogMessage: '确定要清空所有日志吗？',
      clearLogSuccess: '清空成功',
    },
    category: {
      title: '分类管理',
    },
    logging: {
      title: '操作日志',
    }
  },
  tip: {
    confirm: '确定',
    save: '保存',
    cancel: '取消',
    saveSuccess: '保存成功',
    enabled: '启用',
    submit: '提交',
  }
}