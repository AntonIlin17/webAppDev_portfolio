import { useLayoutEffect, useRef, useState } from 'react'

// Opens a <dialog> as a modal for as long as the component is mounted,
// and returns focus to whatever opened it afterwards.
function useOpenDialog(dialogRef, closeRef) {
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    const opener = document.activeElement
    dialog.showModal()
    closeRef.current.focus()
    return () => {
      dialog.close()
      if (opener?.isConnected) opener.focus()
    }
  }, [dialogRef, closeRef])
}

/**
 * A full-screen gallery of a project's screenshots.
 *   images      [{ src, alt, caption }]
 *   startIndex  which image to show first
 * Left and right arrow keys move between images. Escape, the close button or a click outside closes it.
 */
export default function Lightbox({ title, images, startIndex, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const [index, setIndex] = useState(startIndex)
  const image = images[index]

  useOpenDialog(dialogRef, closeRef)

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.contains(document.activeElement)) {
      const control = dialog.querySelector('.lightbox-nav') ?? closeRef.current
      control.focus()
    }
  }, [index])

  function move(offset) {
    setIndex((current) => Math.max(0, Math.min(current + offset, images.length - 1)))
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowLeft' ? -1 : 1)
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-overlay"
      aria-label={`${title} image gallery`}
      onKeyDown={handleKeyDown}
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <button ref={closeRef} type="button" className="lightbox-close" aria-label="Close gallery" onClick={onClose}>×</button>
      {index > 0 && (
        <button type="button" className="lightbox-nav left" aria-label="Previous image" onClick={() => move(-1)}>‹</button>
      )}
      <figure className="lightbox-figure">
        <img className="lightbox-img" src={image.src} alt={image.alt} />
        <figcaption className="lightbox-caption" aria-live="polite">
          <span>{image.caption}</span>
          <span className="lightbox-counter">{index + 1} / {images.length}</span>
        </figcaption>
      </figure>
      {index < images.length - 1 && (
        <button type="button" className="lightbox-nav right" aria-label="Next image" onClick={() => move(1)}>›</button>
      )}
    </dialog>
  )
}
