import { ErrorData } from "../type/error";
export function getPromiseError(): ErrorData | void {
  window.addEventListener('unhandledrejection', (e) => {
    try {
      const reason = e.reason
      let errorMessage: string | undefined
      let errorFilename: string | undefined
      let errorLineno: number | undefined
      let errorColno: number | undefined
      if (typeof reason === "string") {
        errorMessage = reason;
      } else if (typeof reason === "object") {
        errorMessage = reason.message;
        if (reason.stack) {
          let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
          errorFilename = matchResult[1];
          errorLineno = matchResult[2];
          errorColno = matchResult[3];
        }
      }
      e.promise.catch((err) => {
        const data: ErrorData = {
          errorType: 'promise-err',
          // errorUrl: e.path.toString(),
          errorMessage: e.reason,
          errorFilename,
          errorLineno,
          errorColno
        }
        return data
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
      errorColno: e.colno
    }

    return data
  }, true)
}

export function getResourceError(): ErrorData | void {
  window.addEventListener('error', (e) => {
    const target = e.target
    if (!isResourceError(target)) {
      return
    }

    const data: ErrorData = {
      errorType: 'resources-err',
      // @ts-expect-error
      errorUrl: target.baseURI || location.href,
      errorMessage: 'resource loading error',
      // @ts-expect-error
      errorFilename: target.src || target.href,
    }

    return data
  }, true)
}


function isResourceError(target:EventTarget|null):boolean {
  if (target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement || target instanceof HTMLAudioElement || target instanceof HTMLVideoElement) {
    return true
  } else {
    return false
  }
}

