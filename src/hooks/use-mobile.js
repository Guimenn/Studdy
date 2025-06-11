import * as React from "react"

/**
 * Hook personalizado para detectar dispositivos móveis
 * Monitora o tamanho da tela e retorna se está em modo mobile
 */

const MOBILE_BREAKPOINT = 768

/**
 * Hook que detecta se o dispositivo é mobile baseado na largura da tela
 * @returns {boolean} - True se a largura da tela for menor que 768px
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}
