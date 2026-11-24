import { useEffect, useRef, useState } from 'react'

function useRecaptcha() {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function renderWidget() {
      if (window.grecaptcha?.render && containerRef.current && widgetIdRef.current === null) {
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        })
        setReady(true)
      }
    }

    if (window.grecaptcha?.render) {
      renderWidget()
      return
    }

    const interval = setInterval(() => {
      if (window.grecaptcha?.render) {
        renderWidget()
        clearInterval(interval)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [])

  const getToken = () => {
    if (window.grecaptcha && widgetIdRef.current !== null) {
      return window.grecaptcha.getResponse(widgetIdRef.current)
    }
    return ''
  }

  const reset = () => {
    if (window.grecaptcha && widgetIdRef.current !== null) {
      window.grecaptcha.reset(widgetIdRef.current)
    }
  }

  return { containerRef, getToken, reset, ready }
}

export default useRecaptcha