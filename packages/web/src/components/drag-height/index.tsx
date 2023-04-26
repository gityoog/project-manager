import throttle from 'lodash.throttle'

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import style from './style.module.scss'

@Component
export default class DragHeight extends Vue {
  $props!: {
    type?: 'top' | 'bottom'
    value?: number
    min?: number
  }
  @Prop({ default: 220 }) value!: number
  @Prop({ default: 'bottom' }) type!: 'top' | 'bottom'
  @Prop({ default: 0 }) min!: number

  dragEl = document.createElement('div')
  private isActived = false
  private height = this.value
  private offset = 0

  @Watch('value')
  onValueChange(value: number) {
    if (this.height !== value) {
      this.height = value
    }
  }

  mounted() {
    this.$el.appendChild(this.dragEl)
    this.dragEl.className = `${style.line} ${style[this.type]}`
    const onMove = throttle((e) => this.onMove(e), 20)
    this.dragEl.addEventListener('mousedown', (event) => {
      this.isActived = true
      this.offset = event.offsetY - this.dragEl.offsetHeight / 2
      document.addEventListener('mousemove', onMove)
      event.preventDefault()
    })
    document.addEventListener('mouseup', (event) => {
      if (this.isActived) {
        document.removeEventListener('mousemove', onMove)
        this.isActived = false
        if (this.value !== this.height) {
          this.$emit('input', this.height)
        }
      }
    })
  }
  onMove(event: MouseEvent) {
    let height = this.type === 'bottom' ? event.clientY - getElementViewTop(this.$el as HTMLElement) : (this.$el as HTMLElement).offsetHeight - (event.clientY - getElementViewTop(this.$el as HTMLElement))
    height = height - this.offset
    this.height = height > this.min ? height : this.min
  }
  destroyed() {
    this.dragEl.remove()
  }
  render() {
    return <div style={`position: relative;height:${this.height}px;`}>{this.$slots.default}</div>
  }
}

function getElementViewTop(element: HTMLElement) {
  let actualTop = element.offsetTop
  let current = element.offsetParent as HTMLElement | null
  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }
  return actualTop - (document.compatMode === "BackCompat" ? document.body.scrollTop : document.documentElement.scrollTop)
}