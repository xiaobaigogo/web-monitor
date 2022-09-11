import { BehaviorData, PvData } from "../type/behavior";
import { Client } from "../core/Client";
import { keyType } from "../type/index";

import { formateTime, randomString } from "../utils/method";


const defTargetEls = ['div', 'span', 'button']
const defEventType = ['click', 'dbclick']

export function getEventData(eventType: string[] = defEventType, targetEls: string[] = defTargetEls) {
  eventType.forEach((event) => {
    window.addEventListener(event, (e) => {
      if (e.target instanceof HTMLElement) {
        if (targetEls.includes(e.target.nodeName.toLowerCase())) {
          const data: BehaviorData = {
            dom: e.target.getAttribute('id') ? `#${e.target.getAttribute('id')}` : (e.target.getAttribute('class') ? `.${e.target.getAttribute('class')}` : e.target.nodeName.toLowerCase()),
            nodeName: e.target.nodeName.toLowerCase(),
            eventType: event,
            time: (Date.now()).toString()
          }
          Client.sender.saveData(data, keyType.Behavior)
          // console.log(data)
        }
      }
    }, true)
  })
}

let oldURL = window.location.href; // 最后一次的url

/**
 * 获取pv
 */
function getHistoryData(url = window.location.href, title = document.title) {
  if (oldURL == url) {
    return
  }
  const data: PvData = {
    url,
    referer: oldURL,
    title,
    time: (Date.now() - 1000 * 60 * 60).toString()
  }
  oldURL = url || window.location.href
  // console.log(data)
  Client.sender.saveData(data, keyType.Pv)
}

/**
 * 获取uv
 */
export function getUv() {
  const date = new Date()

  let uv = `${date.getFullYear()}${formateTime(date.getMonth() + 1)}${formateTime(date.getDate())}-${formateTime(date.getHours())}${formateTime(date.getMinutes())}${formateTime(date.getSeconds())}-${randomString(8)}`

  if (localStorage.getItem('uv') == null) {
    localStorage.setItem('uv', JSON.stringify({ uv, time: new Date() }))
  } else {
    // @ts-expect-error
    const { uvB = uv, time } = JSON.parse(localStorage.getItem('uv'))
    const timeB = new Date(time)
    // 算为第二天的访客
    if (timeB.getFullYear() < date.getFullYear() || timeB.getMonth() < date.getMonth() || timeB.getDate() < date.getDate()) {
      localStorage.removeItem('uv')
      localStorage.setItem('uv', JSON.stringify({ uv, time: new Date() }))
    } else {
      uv = uvB
    }
  }

  return uv
}
/**
 * 改写pushState, replaceState方法
 */
export function newHistoryState({ pvHashTag = false }) {
  let lastIsPop: boolean
  if (window.history.pushState) {
    const nativePushState = window.history.pushState;
    window.history.pushState = (data, title, url) => {

      const result = nativePushState.call(window.history, data, title, url);
      getHistoryData()

      return result;
    };

    const nativeRepalceState = window.history.replaceState;
    window.history.replaceState = (data, title, url) => {

      const result = nativeRepalceState.call(window.history, data, title, url);
      getHistoryData()

      return result;
    };
    // hash变化也会触发popstate事件,而且会先触发popstate事件
    // 可以使用popstate来代替hashchange,如果支持History H5 Api
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/popstate_event
    window.addEventListener('popstate', () => {
      if (window.location.hash !== '') {
        const oldHost = oldURL.indexOf('#') > 0 // 多页面情况下 history模式刷新还是在pv页面
          ? oldURL.slice(0, oldURL.indexOf('#'))
          : oldURL;
        // 如果哈希值改变且不监听
        if (window.location.href.slice(0, window.location.href.indexOf('#')) === oldHost && !pvHashTag) return
      }
      lastIsPop = true

      getHistoryData()

    });

    window.addEventListener('hashchange', () => {
      if (pvHashTag && !lastIsPop) {
        getHistoryData()
      }
      lastIsPop = false;
    });
  }
}