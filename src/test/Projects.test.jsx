import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import Projects from '../pages/Projects'

const dialogMethods = Object.getOwnPropertyDescriptors(HTMLDialogElement.prototype)

beforeAll(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value() { this.setAttribute('open', '') } },
    close: { configurable: true, value() { this.removeAttribute('open') } },
  })
})

afterAll(() => {
  for (const name of ['showModal', 'close']) {
    delete HTMLDialogElement.prototype[name]
    if (dialogMethods[name]) Object.defineProperty(HTMLDialogElement.prototype, name, dialogMethods[name])
  }
})

describe('Projects Component', () => {
  it('renders the current projects with descriptions, approaches and galleries', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Open project:/ })).toHaveLength(5)
    expect(screen.queryByRole('button', { name: /RSS Aggregator|TourConnect|QA Automation Examples/ })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Open project: Autonomous Warehouse Robot' }))
    expect(screen.getAllByText('How it was built').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Enlarge The warehouse in Gazebo' })).toBeInTheDocument()
  })

  it('bounds button and keyboard navigation and restores focus after closing', () => {
    render(<Projects />)
    const card = screen.getByRole('button', { name: 'Open project: Autonomous Warehouse Robot' })
    card.focus()
    fireEvent.click(card)
    const opener = screen.getByRole('button', { name: 'Enlarge The warehouse in Gazebo' })
    opener.focus()
    fireEvent.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Autonomous Warehouse Robot image gallery' })
    const gallery = within(dialog)
    const previous = () => gallery.queryByRole('button', { name: 'Previous image' })
    const next = () => gallery.queryByRole('button', { name: 'Next image' })

    expect(previous()).not.toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
    expect(gallery.getByText('1 / 3')).toBeInTheDocument()
    fireEvent.click(next())
    expect(previous()).toBeInTheDocument()
    expect(next()).toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(previous()).toBeInTheDocument()
    expect(next()).not.toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(gallery.getByText('3 / 3')).toBeInTheDocument()
    fireEvent.click(gallery.getByRole('button', { name: 'Close gallery' }))
    expect(dialog).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
    fireEvent.click(screen.getByRole('button', { name: 'Close project' }))
    expect(card).toHaveFocus()
  })

  it('opens a thumbnail at its own position', () => {
    render(<Projects />)
    fireEvent.click(screen.getByRole('button', { name: 'Open project: Autonomous Warehouse Robot' }))
    fireEvent.click(screen.getByRole('button', { name: 'Enlarge Nav2 route in RViz' }))
    const gallery = within(screen.getByRole('dialog', { name: 'Autonomous Warehouse Robot image gallery' }))
    expect(gallery.getByText('2 / 3')).toBeInTheDocument()
    expect(gallery.getByRole('img', { name: /occupancy map/ })).toBeInTheDocument()
  })
})
