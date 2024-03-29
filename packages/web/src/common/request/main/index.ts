import { AxiosRequestConfig, AxiosResponse } from "axios"
import WRequest from "wrequest"
import axios from 'axios'

const service = axios.create({
  withCredentials: true,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json'
  }
})

interface MainRequest {
  <T = void, R = void>(config: AxiosRequestConfig): WRequest.Generator<T, R>
  page: <T = void, R = void>(config: AxiosRequestConfig) => WRequest.Generator<{
    page: number
    size: number
    params: T
  }, {
    total: number
    page: number
    data: R[]
  }>
  url<T = void>(generate: (data: T) => string): (data: T) => string
  bindBaseUrl: (url: string) => void
  bindErrorhandler(callback: (error: string) => void): void
  bindNoAuthHandler(callback: () => void): void
  bindToken: (token: string) => void
}

type Response<T> = {
  status: 0
  msg: string
} | {
  status: 1
  info: T
} | {
  status: -1
  msg: string
}

const MainRequest: MainRequest = <T = void, R = void>(config: AxiosRequestConfig) => WRequest.Build<T, R>(params => service({
  method: 'POST',
  ...config,
  data: typeof config.data === 'object' ? { ...config.data, ...params } : params || {}
}).then((res: AxiosResponse<Response<R> | {} | undefined>) => {
  const data = res.data
  if (data && 'status' in data) {
    if (data.status === 0) {
      throw new Error(data.msg)
    } else if (data.status === -1) {
      noAuthHandler()
      throw new Error(data.msg)
    } else {
      return data.info
    }
  }
  throw new Error('server error')
})).handle(wRequest => wRequest.fail(errorHandler))

let errorHandler = (error: string) => { console.error(error) }
let noAuthHandler = () => { console.error('no auth') }

MainRequest.url = callback => data => {
  const url = callback(data)
  const base = service.defaults.baseURL!
  if (base.endsWith('/') && url.startsWith('/')) {
    return base + url.slice(1)
  } else if (!base.endsWith('/') && !url.startsWith('/')) {
    return base + '/' + url
  } else {
    return base + url
  }
}
MainRequest.page = (config) => MainRequest(config)
MainRequest.bindBaseUrl = url => service.defaults.baseURL = url
MainRequest.bindErrorhandler = callback => errorHandler = callback
MainRequest.bindToken = token => service.defaults.headers['Token'] = token
MainRequest.bindNoAuthHandler = callback => noAuthHandler = callback

export default MainRequest