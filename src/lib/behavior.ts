import { BehaviorData, PvData } from "../type/behavior";

export function getEventData(eventType: string[] = [], targetEls: string[] = []) {
  eventType.forEach((event) => {
    window.addEventListener(event, (e) => {
      if (e.target instanceof HTMLElement) {
        if (targetEls.includes(e.target.nodeName.toLowerCase())) {
          const data: BehaviorData = {
            dom: e.target.getAttribute('id') ? `#${e.target.getAttribute('id')}` : (e.target.getAttribute('class') ? `.${e.target.getAttribute('class')}` : e.target.nodeName.toLowerCase()),
            eventType: event,
            time: new Date()
          }
          console.log(data)
        }
      }
    })
  })
}

let oldURL = window.location.href; // 最后一次的url

/**
 * 获取pv
 */
export function getHistoryData(url = window.location.href, title = document.title) {
  if (oldURL == url) {
    return
  }
  const data: PvData = {
    url,
    referer: oldURL,
    title,
    time: new Date()
  }
  oldURL = url || window.location.href
  console.log(data)
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