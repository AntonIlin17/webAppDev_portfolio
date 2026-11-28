import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Projects from '../pages/Projects'
import ProjectPage from '../pages/ProjectPage'
import projects from '../pages/projectData'

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

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Project data', () => {
  it('gives every project a unique address and at least one screenshot', () => {
    const slugs = projects.map((project) => project.slug)
    expect(new Set(slugs).size).toBe(projects.length)
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/)
      expect(project.images.length).toBeGreaterThan(0)
    }
  })
})

describe('Projects filmstrip', () => {
  it('lists the current projects, each linking to its own page', () => {
    renderAt('/projects')
    expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument()
    const frames = screen.getAllByRole('link', { name: /^Open project:/ })
    expect(frames).toHaveLength(5)
    expect(frames[0]).toHaveAttribute('href', '/projects/warehouse-robot')
    expect(screen.queryByRole('link', { name: /RSS Aggregator|TourConnect|QA Automation Examples/ })).not.toBeInTheDocument()
  })

  it('opens a project page from its frame', () => {
    renderAt('/projects')
    fireEvent.click(screen.getByRole('link', { name: 'Open project: Autonomous Warehouse Robot' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Autonomous Warehouse Robot' })).toBeInTheDocument()
  })
})

describe('Project page', () => {
  it('shows the write-up, the links and a way to the next project', () => {
    renderAt('/projects/warehouse-robot')
    expect(screen.getByText('How it was built')).toBeInTheDocument()
    expect(screen.getByText('My contribution')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Source code/ })).toHaveAttribute('href', 'https://github.com/AntonIlin17/autonomous-warehouse-robot')
    expect(screen.getByRole('link', { name: /Back to work/ })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: /Next project/ })).toHaveAttribute('href', '/projects/dither-cabinet')
  })

  it('starts on the demo video when there is one and switches to a screenshot', () => {
    renderAt('/projects/warehouse-robot')
    expect(screen.getByLabelText('Autonomous Warehouse Robot demo video')).toBeInTheDocument()
    const tab = screen.getByRole('button', { name: /The warehouse in Gazebo/ })
    expect(tab).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(tab)
    expect(tab).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Enlarge The warehouse in Gazebo' })).toBeInTheDocument()
  })

  it('starts on the cover screenshot when there is no demo video', () => {
    renderAt('/projects/dither-cabinet')
    expect(screen.getByRole('button', { name: 'Enlarge Dahlia in the print studio' })).toBeInTheDocument()
  })

  it('bounds gallery navigation and restores focus after closing', () => {
    renderAt('/projects/dither-cabinet')
    const opener = screen.getByRole('button', { name: 'Enlarge Dahlia in the print studio' })
    opener.focus()
    fireEvent.click(opener)
    const dialog = screen.getByRole('dialog', { name: 'Dither Cabinet image gallery' })
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
    expect(next()).not.toBeInTheDocument()
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(gallery.getByText('3 / 3')).toBeInTheDocument()
    fireEvent.click(gallery.getByRole('button', { name: 'Close gallery' }))
    expect(dialog).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('opens the gallery at the screenshot that was chosen', () => {
    renderAt('/projects/warehouse-robot')
    fireEvent.click(screen.getByRole('button', { name: /Nav2 route in RViz/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Enlarge Nav2 route in RViz' }))
    const gallery = within(screen.getByRole('dialog', { name: 'Autonomous Warehouse Robot image gallery' }))
    expect(gallery.getByText('2 / 3')).toBeInTheDocument()
    expect(gallery.getByRole('img', { name: /occupancy map/ })).toBeInTheDocument()
  })

  it('explains an unknown address and links back', () => {
    renderAt('/projects/not-a-project')
    expect(screen.getByRole('heading', { name: 'That project is not here.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Back to work' })).toHaveAttribute('href', '/projects')
  })
})
