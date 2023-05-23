import ElAutocomplete from "element-ui/lib/autocomplete.js"
import 'element-ui/lib/theme-chalk/autocomplete.css'

export default ElAutocomplete as Tsx.ClassComponent<{
  placeholder?: string
  disabled?: boolean
  debounce?: number
  'value-key'?: string
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
  'fetch-suggestions'?: (queryString: string, callback: (suggestions: { value: string }[]) => void) => void
  'popper-class'?: string
  'trigger-on-focus'?: boolean
  name?: string
  'select-when-unmatched'?: boolean
  label?: string
  'prefix-icon'?: string
  'suffix-icon'?: string
  'hide-loading'?: boolean
  'popper-append-to-body'?: boolean
  'highlight-first-item'?: boolean
}>
