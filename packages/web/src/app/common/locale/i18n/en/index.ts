import ElLocaleEn from "@/common/element-ui/locale/en"

export default {
  title: 'Project Manager',
  el: ElLocaleEn,
  tabs: {
    other: 'Other'
  },
  project: {
    build: {
      title: 'Build',
      run: 'Build',
      stop: 'Stop',
      download: 'Download',
      remove: 'Remove',
      tip: {
        stopFail: 'Stop Failed',
        runFail: 'Run Failed'
      },
      list: {
        name: 'Name',
        time: 'Time',
        size: 'Size',
        action: 'Act.'
      }
    },
    card: {
      running: 'Running',
      exited: 'Exited',
      build: 'Build',
      runFail: 'Run Failed'
    },
    edit: {
      title: 'Project Info',
      name: 'Name',
      category: 'Category',
      context: 'Context',
      dev: 'Dev',
      build: 'Build',
      deploy: 'Deploy',
      sort: 'Sort'
    }
  },
  category: {
    name: 'Name',
    sort: 'Sort',
    time: 'Time',
    action: 'Act.',
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    edit: 'Edit',
    remove: 'Remove',
    tip: {
      name: 'Please input category name'
    }
  },
  logging: {
    target: 'Target',
    action: 'Action',
    user: 'User',
    ip: 'IP',
    time: 'Time',
    description: 'Desc'
  },
  selector: {
    checkAll: 'Check All',
    remove: 'Remove',
    confirm: {
      title: 'Delete Project',
      message: (total: string | number) => `Are you sure to delete ${total} projects?`
    }
  },
  setting: {
    title: 'System Setting',
    base: {
      title: 'General',
      cache: 'Clear',
      clearOutput: 'Output',
      clearLog: 'Log',
      lang: 'Lang',
      shell: 'Shell',
      pty: 'Pty',
      reset: 'Reset',
      save: 'Save',
      saveSuccess: 'Save Success',
      clearOutputTitle: 'Clear Output',
      clearOutputMessage: 'Are you sure to clear all output and files?',
      clearOutputSuccess: 'Clear Success',
      clearLogTitle: 'Clear Log',
      clearLogMessage: 'Are you sure to clear all logs?',
      clearLogSuccess: 'Clear Success',
    },
    category: {
      title: 'Category',
    },
    logging: {
      title: 'Logging',
    }
  },
  tip: {
    save: 'Save',
    cancel: 'Cancel',
    saveSuccess: 'Save Success'
  }
}