export function pannable(node: Element) {
  let x: number
  let y: number

  function handleMousedown(e: MouseEvent | TouchEvent) {
    if (e instanceof MouseEvent) {
      x = e.clientX
      y = e.clientY
    } else if (e instanceof TouchEvent) {
      x = e.touches[0].clientX
      y = e.touches[0].clientY
    }

    node.dispatchEvent(
      new CustomEvent('panstart', {
        detail: { x, y },
      })
    )

    window.addEventListener('mousemove', handleMousemove)
    window.addEventListener('touchmove', handleMousemove, { passive: false })
    window.addEventListener('mouseup', handleMouseup)
    window.addEventListener('touchend', handleMouseup, { passive: false })
  }

  function handleMousemove(e: MouseEvent | TouchEvent) {
    e.preventDefault()
    let clientX: number
    let clientY: number

    if (e instanceof MouseEvent) {
      clientX = e.clientX
      clientY = e.clientY
    } else if (e instanceof TouchEvent) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }

    const dx = clientX - x
    const dy = clientY - y
    x = clientX
    y = clientY

    node.dispatchEvent(
      new CustomEvent('panmove', {
        detail: { x, y, dx, dy },
      })
    )
  }

  function handleMouseup(e: MouseEvent) {
    x = e.clientX // || e.touches[0].clientX
    y = e.clientY // || e.touches[0].clientY

    node.dispatchEvent(
      new CustomEvent('panend', {
        detail: { x, y, isTouch: e.type === 'touchend' },
      })
    )

    window.removeEventListener('mousemove', handleMousemove)
    window.removeEventListener('touchmove', handleMousemove)
    window.removeEventListener('mouseup', handleMouseup)
    window.removeEventListener('touchend', handleMouseup)
  }

  node.addEventListener('mousedown', handleMousedown)
  node.addEventListener('touchstart', handleMousedown, { passive: false })

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMousedown)
      node.removeEventListener('touchstart', handleMousedown)
    },
  }
}
