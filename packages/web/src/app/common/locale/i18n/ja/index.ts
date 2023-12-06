import ElLocaleJa from "@/common/element-ui/locale/ja"

export default {
  lang: 'Ja',
  title: 'プロジェクト管理',
  el: ElLocaleJa,
  tabs: {
    other: 'その他'
  },
  project: {
    card: {
      running: 'ランニング',
      exited: '終了',
      build: 'ビルド',
      more: '詳細',
      runFail: '起動失敗',
      terminal: '見せる/隠れるターミナル'
    },
    edit: {
      title: 'プロジェクト情報',
      name: 'プロジェクト名',
      category: 'プロジェクトカテゴリ',
      sort: 'プロジェクトのソート'
    },
    process: {
      default: '既定のコマンド',
      namePrefix: 'コマンド',
      add: 'コマンドの追加',
      context: 'コマンドアドレス',
      setting: {
        title: 'コマンド設定',
        encoding: 'コーディング',
        env: {
          title: '環境変数',
          add: '環境変数の追加',
        },
        autostart: {
          title: '自動スタート',
          label: 'プログラムによる自動起動'
        },
        deploy: {
          title: 'デプロイメント構成',
          type: 'タイプ',
          post: {
            url: 'アドレス',
            key: 'フィールド',
            type: 'タイプ',
            formdata: 'フォームデータ',
            binary: 'バイナリ',
          }
        }
      }
    },
    detail: {
      title: 'プロジェクト情報',
      other: 'その他',
      process: {
        start: '起動',
        stop: '停止',
      },
      output: {
        filename: 'ファイル名',
        size: 'サイズ',
        time: '時間',
        action: '操作',
        download: 'ダウンロード',
        remove: '削除'
      }
    }
  },
  category: {
    name: '名前',
    sort: 'ソート',
    time: '時間',
    action: '操作',
    save: 'セーブ',
    cancel: 'キャンセル',
    add: '追加',
    edit: '編集',
    remove: '削除',
    tip: {
      name: 'カテゴリ名を入力してください'
    }
  },
  logging: {
    target: '目標',
    action: '操作',
    user: 'ユーザー',
    ip: 'IP',
    time: '時間',
    description: '説明'
  },
  selector: {
    checkAll: 'すべて選択',
    remove: '削除',
    confirm: {
      title: 'アイテムの削除',
      message: (total: string | number) => `${total}${Number(total) >= 10 ? '個' : 'つ'}のアイテムを削除しますか`
    }
  },
  setting: {
    title: 'システム設定',
    local: {
      title: 'ローカル設定',
      language: '言語',
      pty: 'ターミナル',
      fontSize: 'フォントサイズ',
      fontFamily: 'フォント',
      stats: {
        title: '統計',
        tip: 'ホームページに CPU/メモリの使用状況情報を表示するかどうか',
      },
      reset: 'リセット',
      save: 'セーブ',
      saveSuccess: 'セーブ成功',
    },
    server: {
      title: 'バックグラウンドの設定',
      cache: 'キャッシュ',
      clearOutput: '出力をクリアする',
      clearLog: 'ログをクリアする',
      shell: 'シェル',
      pty: 'ターミナル',
      process: {
        title: 'プロセス',
        keep: '再起動時に状態を維持する',
      },
      reset: 'リセット',
      save: 'セーブ',
      saveSuccess: 'セーブ成功',
      clearOutputTitle: 'ビルドレコードをクリアする',
      clearOutputMessage: 'すべてのビルドレコードとファイルをクリアしたいですか',
      clearOutputSuccess: 'クリア成功',
      clearLogTitle: 'ログをクリアする',
      clearLogMessage: 'すべてのログをクリアしますか?',
      clearLogSuccess: 'クリア成功',
    },
    category: {
      title: 'カテゴリ管理',
    },
    logging: {
      title: '操作ログ',
    }
  },
  tip: {
    save: 'セーブ',
    cancel: 'キャンセル',
    saveSuccess: 'セーブ成功',
    enabled: '有効化',
  }
}