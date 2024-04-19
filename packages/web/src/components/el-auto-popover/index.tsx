import ElPopover from '@/common/element-ui/popover'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ResizeComponent from '../resize'
import debounce from 'lodash.debounce'
import { ComponentOptions } from 'vue'

const handleMouseEnter = (ElPopover as ComponentOptions<Vue>).methods?.handleMouseEnter!
const handleMouseLeave = (ElPopover as ComponentOptions<Vue>).methods?.handleMouseLeave!

const NewElPopover = Vue.extend({
  extends: ElPopover,
  methods: {
    handleMouseEnter(...args: any[]) {
      if (this.tigger === 'hover') {
        return handleMouseEnter.apply(this, args)
      }
    },
    handleMouseLeave(...args: any[]) {
      if (this.tigger === 'hover') {
        return handleMouseLeave.apply(this, args)
      }
    }
  }
})

@Component
export default class ElAutoPopover extends Vue {
  $props!: typeof ElPopover.prototype.$props
  $refs!: {
    popover: {
      trigger: string
      updatePopper(): void
      handleMouseEnter(): void
      handleMouseLeave(): void
    } & Vue
  }
  private update = debounce(() => {
    this.$refs.popover.updatePopper()
  }, 100)

  mounted() {
  }

  render() {
    return <NewElPopover
      ref="popover"
      on={this.$listeners}
      attrs={this.$attrs}
    >
      <ResizeComponent slot='reference' onResize={() => { this.update() }}>{this.$slots.reference}</ResizeComponent>
      <ResizeComponent onResize={() => { this.update() }}>{this.$slots.default}</ResizeComponent>
    </NewElPopover>
  }
}