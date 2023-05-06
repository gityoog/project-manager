import { Terminal, ITerminalOptions } from 'xterm'
import { iTerminal } from "."
import { FitAddon } from 'xterm-addon-fit'
import { CanvasAddon } from 'xterm-addon-canvas'

import 'xterm/css/xterm.css'
import debounce from 'lodash.debounce'
export default class TerminalService implements iTerminal {
  term: Terminal
  fitAddon = new FitAddon
  constructor(options?: ITerminalOptions) {
    this.term = new Terminal({
      disableStdin: true,
      fontFamily: 'Consolas',
      convertEol: true,
      ...options
    })
    this.term.loadAddon(this.fitAddon)
    if (!isIE()) {
      this.term.loadAddon(new CanvasAddon())
    }
    this.resize = debounce(this.resize.bind(this), 20)
  }
  setOption<K extends keyof ITerminalOptions>(key: K, value: ITerminalOptions[K]) {
    this.term.options[key] = value
  }
  private el?: HTMLElement
  open(el: HTMLElement) {
    this.el = el
    this.term.open(el)
    this.term.focus()
  }
  reload() {
    // this.term.dispose()
    // if (this.el) {
    //   this.term.open(this.el)
    // }
  }
  refresh() {
    this.term.refresh(0, this.term.rows - 1)
  }
  resize() {
    if (this.term.element) {
      try {
        this.fitAddon.fit()
      } catch (e) {
        console.error(e)
      }
    }
  }
  write(data: string[]): void
  write(data: string | Uint8Array, callback?: () => void): void
  write(data: string | Uint8Array | string[], callback?: () => void) {
    if (Array.isArray(data)) {
      data.forEach(item => this.term.write(item))
    } else {
      this.term.write(data, callback)
    }
  }
  clear() {
    this.term.clear()
  }
  destroy() {
    this.term.dispose()
    this.el = undefined
  }
}

function isIE(): boolean {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true
  } else {
    return false
  }
}