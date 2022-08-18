import { AjaxData } from "../type/ajax";

/**
 * fetch请求拦截
 */
export function newFetch() {
  const nativeFetch = window.fetch;
  if (nativeFetch) {
    window.fetch = function traceFetch(url: RequestInfo, init: RequestInit | undefined) {
      const timestamp = Date.now()
      const result = nativeFetch(url, init);
      result.then((res) => {
        const { url, status } = res;
        if (status === 200 || status === 304) {
          // 发送请求
          const data: AjaxData = {
            src: url,
            responseStatus: status,
            duration: Date.now() - timestamp,
            params: init && init.body ? init.body : undefined,
          }
        } else {
          // 发送失败
          const data: AjaxData = {
            src: url,
            responseStatus: status,
            params: init && init.body ? init.body : undefined,
          }
        }
      }).catch((e) => {
        // 无法发起请求,连接失败

      });
      return result;
    };
  }
}


/**
 * ajax, axios请求拦截
 */
export function newAjax() {
  const { open, send } = XMLHttpRequest.prototype;
  let rURL: string | URL
  let rMethod

  // 劫持 open方法
  // @ts-expect-error
  XMLHttpRequest.prototype.open = function openXHR(method, url, async) {
    rURL = url;
    rMethod = method;
    return open.call(this, method, url, async);
  };

  // 劫持 send方法
  XMLHttpRequest.prototype.send = function (body) {
    // body 就是post方法携带的参数
    const timestamp = +Date.now()
    // readyState发生改变时触发,也就是请求状态改变时
    // readyState 会依次变为 2,3,4 也就是会触发三次这里
    this.addEventListener('readystatechange', () => {
      const {
        readyState,
        status,
        responseURL = rURL,
      } = this;
      if (readyState === 4) { // 请求已完成,且响应已就绪
        if (status === 200 || status === 304) {
          const data: AjaxData = {
            src: responseURL,
            responseStatus: status,
            duration: Date.now() - timestamp,
            params: body ? body : undefined,
          }
        } else {
          const data: AjaxData = {
            src: responseURL,
            responseStatus: status,
            params: body ? body : undefined,
          }
        }
      }
    });


    return send.call(this, body);
  };
}