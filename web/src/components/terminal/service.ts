import { Terminal, ITerminalOptions } from 'xterm'
import { iTerminal } from "."
import { FitAddon } from 'xterm-addon-fit'
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
    this.resize = debounce(this.resize.bind(this), 20)
  }
  open(el: HTMLElement) {
    this.term.open(el)
    this.term.focus()
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
} 