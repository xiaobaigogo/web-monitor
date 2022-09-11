import { ErrorData } from "../type/error";
import { Client } from "../core/Client";
import { keyType } from "../type/index";

export function getPromiseError(): ErrorData | void {
  window.addEventListener('unhandledrejection', (e) => {
    try {
      const reason = e.reason
      let errorMessage: string | undefined
      let errorFilename: string | undefined
      let errorLineno: number | undefined
      let errorColno: number | undefined
      if (typeof reason === "string") {
        // console.log(reason)
        errorMessage = reason;
      } else if (typeof reason === "object") {
        // console.log(reason)
        errorMessage = reason;
        if (reason.stack) {
          let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
          errorFilename = matchResult[1];
          errorLineno = Number(matchResult[2]);
          errorColno = Number(matchResult[3]);
        }
      }
      e.promise.catch((err) => {
        const data: ErrorData = {
          errorType: 'promise-err',
          // errorUrl: e.path.toString(),
          errorMessage,
          errorFilename,
          errorLineno,
          errorColno,
          time: (Date.now()).toString()
        }
        // console.log(data)
        Client.sender.saveData(data, keyType.Error)
      })
    } catch (error) {
      console.log(error)
    }
  })
}

export function getJsError(): ErrorData | void {
  window.addEventListener('error', (e) => {
    const target = e.target
    if (isResourceError(target)) {
      return
    }

    const data: ErrorData = {
      errorType: 'js-err',
      errorUrl: location.href,
      errorMessage: e.message,
      errorFilename: e.filename,
      errorLineno: e.lineno,
      errorColno: e.colno,
      time: (Date.now()).toString()
    }
    Client.sender.saveData(data, keyType.Error)

    // console.log(data)
  }, true)
}

export function getResourceError(): ErrorData | void {
  window.addEventListener('error', (e) => {
    const target = e.target
    if (!isResourceError(target)) {
      return
    }

    // @ts-expect-error
    const errorFilename = target.src || target.href
    const suffix = errorFilename.slice(errorFilename.lastIndexOf('/') + 1)
    const data: ErrorData = {
      errorType: 'resources-err',
      // @ts-expect-error
      errorUrl: target.baseURI || location.href,
      errorMessage: `${suffix} loading error`,
      errorFilename,
      time: (Date.now()).toString()
    }
    Client.sender.saveData(data, keyType.Error)

    // console.log(data)
  }, true)
}


function isResourceError(target: EventTarget | null): boolean {
  if (target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement || target instanceof HTMLAudioElement || target instanceof HTMLVideoElement) {
    return true
  } else {
    return false
  }
}

