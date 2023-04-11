import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import ElLoading, { iElLoading } from 'components/el-loading'
import ProjectCard, { iProjectCard } from '../project-card'
import style from './style.module.scss'

export interface iProjectList {
  key: string
  getData(): iProjectCard[]
  status: iElLoading
}


@Component({
  computed: {
    data(this: ProjectList) {
      return this.service.getData()
    }
  }
})
export default class ProjectList extends Vue {
  @Prop() service!: iProjectList

  private data!: iProjectCard[]

  protected render() {
    return <ElLoading status={this.service.status} class={style.list}>
      {this.data.map((item) => <ProjectCard service={item}></ProjectCard>)}
    </ElLoading>
  }
}