import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ResizeComponent from '../resize'

export interface iTerminal {
  open(el: HTMLElement): void
  resize(): void
}

@Component
export default class TerminalComponent extends Vue {
  $props!: {
    service: iTerminal
  }
  @Prop() service!: iTerminal
  mounted() {
    this.service.open(this.$el as HTMLElement)
  }
  protected render() {
    return <ResizeComponent style="overflow: hidden" onResize={rect => {
      if (rect.height) {
        this.service.resize()
      }
    }}></ResizeComponent>
  }
}