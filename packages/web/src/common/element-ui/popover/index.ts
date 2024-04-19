import ElPopover from 'element-ui/lib/popover.js'
import 'element-ui/lib/theme-chalk/popover.css'

export default ElPopover as Tsx.ClassComponent<{
  value?: boolean
  trigger?: 'click' | 'focus' | 'hover' | 'manual'
  title?: string
  width?: string
  content?: string
  visible?: boolean
  disabled?: boolean
  offset?: number
  transition?: string
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'
  popperClass?: string
  openDelay?: number
  closeDelay?: number
  tabindex?: number
}>