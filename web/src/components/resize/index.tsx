import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ResizeObserver from 'resize-observer-polyfill'

export type rect = {
  left: number | null
  top: number | null
  width: number | null
  height: number | null
  maxHeight: number | null
}

@Component
export default class ResizeComponent extends Vue {
  $props!: {
    scopedSlots?: {
      default: (rect: rect) => any
    }
    onResize?(rect: rect): void
    autoHeight?: boolean
    maxHeight?: string
  }

  @Prop() autoHeight!: boolean
  @Prop() maxHeight?: string

  @Watch('rect', { deep: true })
  onResize() {
    this.$emit('resize', {
      ...this.rect
    })
  }

  rect: rect = {
    left: null,
    top: null,
    width: null,
    height: null,
    maxHeight: null
  }
  private resizeCallback = () => {
    if (this.maxHeight) {
      this.updateMaxHeight()
    }
  }
  resizeOb!: ResizeObserver
  mounted() {
    window.addEventListener('resize', this.resizeCallback)
    this.resizeOb = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { left, top, width, height } = entry.contentRect
        if (this.maxHeight) {
          this.updateMaxHeight()
        } else {
          this.rect.maxHeight = height
        }
        if (this.rect.height !== height) {
          this.$emit('height', height)
        }
        this.rect.left = left
        this.rect.top = top
        this.rect.width = width
        this.rect.height = height
      }
    })
    this.resizeOb.observe(this.$el)
  }

  updateMaxHeight() {
    this.rect.maxHeight = parseFloat(window.getComputedStyle(this.$el).getPropertyValue('max-height')) || null
  }

  beforeDestroy() {
    this.resizeOb.unobserve(this.$el)
    window.removeEventListener('resize', this.resizeCallback)
  }

  protected render() {
    return <div on={this.$listeners} style={`${this.maxHeight ? 'max-height: ' + this.maxHeight + ';' : this.autoHeight ? '' : 'height: 100%;'}`}>
      {this.$scopedSlots.default && this.$scopedSlots.default(this.rect)}
    </div>
  }
}