import MySocket from "./socket"

interface MainWebSocket {
  <TOn extends { [key: string]: any[] } = {}, TEmit extends { [key: string]: any[] } = {}, NS extends string | void = void, Query = void>(data: { namesapce: string }): (data?: MySocket.Options<NS, Query>) => MySocket<TOn, TEmit>
  bindHandler: (callback: MySocket.handler) => void
  bindBaseUrl: (url: string) => void
  bindToken: (token: string) => void
}

const MainWebSocket: MainWebSocket = function ({ namesapce }) {
  return data => new MySocket({
    url: baseurl,
    namesapce,
    token,
    handler,
    data
  })
}

let token: string
let baseurl: string
let handler: MySocket.handler

MainWebSocket.bindToken = value => token = value
MainWebSocket.bindBaseUrl = url => baseurl = url
MainWebSocket.bindHandler = callback => handler = callback

export default MainWebSocket