import ElLocaleZhCN from "@/common/element-ui/locale/zh-CN"

export default {
  title: '项目管理可视化',
  el: ElLocaleZhCN,
  tabs: {
    other: '其他'
  },
  project: {
    build: {
      title: '打包',
      run: '打包',
      stop: '停止',
      download: '下载',
      remove: '删除',
      tip: {
        stopFail: '停止失败',
        runFail: '启动失败'
      },
      list: {
        name: '名称',
        time: '时间',
        size: '大小',
        action: '操作'
      }
    },
    card: {
      running: '运行中',
      exited: '已停止',
      build: '打包',
      runFail: '启动失败'
    },
    edit: {
      title: '项目信息',
      name: '项目名称',
      category: '项目类型',
      context: '项目地址',
      dev: '调试命令',
      build: '打包命令',
      deploy: '部署地址',
      sort: '项目排序'
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
    save: '保存',
    cancel: '取消',
    saveSuccess: '保存成功'
  }
}