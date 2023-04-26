import ElCard from 'element-ui/lib/card.js'
import 'element-ui/lib/theme-chalk/card.css'

export default ElCard as Tsx.ClassComponent<{
  header?: string
  'body-style'?: string
  shadow?: 'never' | 'always' | 'hover'
}>