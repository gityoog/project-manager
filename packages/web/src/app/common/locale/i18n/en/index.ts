import ElLocaleEn from "@/common/element-ui/locale/en"

export default {
  lang: 'en',
  title: 'Project Manager',
  el: ElLocaleEn,
  tabs: {
    other: 'Other'
  },
  project: {
    card: {
      running: 'Running',
      exited: 'Exited',
      build: 'Build',
      more: 'More',
      runFail: 'Run Failed',
      terminal: 'Show/Hide Terminal Display'
    },
    edit: {
      title: 'Project Info',
      name: 'Name',
      category: 'Category',
      sort: 'Sort'
    },
    process: {
      default: 'Default Shell',
      add: 'Add',
      namePrefix: 'Shell',
      context: 'Context',
      setting: {
        title: 'Process Setting',
        encoding: 'Encoding',
        env: {
          title: 'Env',
          add: 'Add Env',
        },
        autostart: {
          title: 'Autostart',
          label: 'Autostart with program',
        },
        deploy: {
          title: 'Deploy Config',
          type: 'Type',
          post: {
            url: 'Url',
            signKey: 'Sign Key',
            signScheme: 'Sign Scheme',
            formSignKey: 'Form Sign',
            formFileKey: 'Form File',
          }
        }
      }
    },
    detail: {
      title: 'Project Detail',
      other: 'Other',
      process: {
        start: 'Start',
        stop: 'Stop',
      },
      output: {
        filename: 'Filename',
        size: 'Size',
        time: 'Time',
        action: 'Act.',
        remove: 'Remove',
        download: 'Download',
        deploy: {
          title: 'Deploy',
          run: 'Deploy',
          stop: 'Stop',
          retry: 'Retry',
          deploying: 'Deploying',
          successfull: 'Successfull',
          failed: 'Failed',
          tip: {
            failed: 'Deploy Failed',
            successfull: 'Deploy Successfull'
          }
        }
      }
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
    local: {
      title: 'Local',
      language: 'Lang',
      pty: 'Pty',
      fontSize: 'Font Size',
      fontFamily: 'Font Family',
      stats: {
        title: 'Stats',
        tip: 'Whether to display CPU/memory usage information on the homepage'
      },
      reset: 'Reset',
      save: 'Save',
      saveSuccess: 'Save Success',
    },
    server: {
      title: 'Server',
      cache: 'Clear',
      clearOutput: 'Output',
      clearLog: 'Log',
      shell: 'Shell',
      pty: 'Pty',
      process: {
        title: 'Process',
        keep: 'Keep Status on Restart',
      },
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
    saveSuccess: 'Save Success',
    enabled: 'Enabled',
  }
}