export function pannable(node) {
  let x
  let y

  function handleMousedown(e) {
    x = e.clientX || e.touches[0].clientX
    y = e.clientY || e.touches[0].clientY

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

  function handleMousemove(e) {
    e.preventDefault()
    const clientX = e.clientX || e.touches[0].clientX
    const clientY = e.clientY || e.touches[0].clientY
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

  function handleMouseup(e) {
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
