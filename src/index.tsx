import { TextAttributes, type InputRenderable, type KeyEvent, type ScrollBoxRenderable } from "@opentui/core"
import { render, useKeyboard } from "@opentui/react"
import { useEffect, useMemo, useRef, useState } from "react"

import { CommandPalette, type CommandPaletteCommand } from "./components/command-palette"
import type { Project } from "./components/project-list-item"
import { ProjectList } from "./components/project-list"
import { SearchInput } from "./components/search-input"
import { tokyoNightTheme } from "./theme"

const projects: Project[] = [
  { name: "frontend-app", updated: "7 days ago" },
  { name: "backend-api", updated: "11 days ago" },
  { name: "mobile-app", updated: "28 days ago" },
  { name: "data-pipeline", updated: "7 days ago" },
  { name: "ml-service", updated: "13 days ago" },
]

const theme = tokyoNightTheme.colors

type AppCommand = CommandPaletteCommand & {
  run: () => void
}

function App() {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState("")
  const [paletteSelectedIndex, setPaletteSelectedIndex] = useState(0)

  const scrollRef = useRef<ScrollBoxRenderable | null>(null)
  const searchInputRef = useRef<InputRenderable | null>(null)
  const paletteSearchInputRef = useRef<InputRenderable | null>(null)
  const paletteScrollRef = useRef<ScrollBoxRenderable | null>(null)

  const normalizedQuery = query.trim().toLowerCase()
  const visibleProjects = useMemo(() => {
    if (!normalizedQuery) return projects
    return projects.filter((project) => project.name.toLowerCase().includes(normalizedQuery))
  }, [normalizedQuery])
  const visibleCount = visibleProjects.length
  const selectedProject = visibleProjects[selectedIndex]

  const appCommands = useMemo<AppCommand[]>(() => {
    const commands: AppCommand[] = [
      {
        id: "focus-project-search",
        title: "Focus Project Search",
        description: "Jump to the project filter input",
        shortcut: ["Ctrl+F"],
        group: "Navigation",
        run: () => {
          searchInputRef.current?.focus()
        },
      },
      {
        id: "clear-project-filter",
        title: "Clear Project Filter",
        description: "Show every project",
        shortcut: ["Esc"],
        group: "Navigation",
        run: () => {
          setQuery("")
        },
      },
    ]

    if (visibleCount > 0) {
      commands.push(
        {
          id: "select-previous-project",
          title: "Select Previous Project",
          description: "Move highlight up in the project list",
          shortcut: ["Up"],
          group: "Navigation",
          run: () => {
            setSelectedIndex((current) => (current === 0 ? visibleCount - 1 : current - 1))
          },
        },
        {
          id: "select-next-project",
          title: "Select Next Project",
          description: "Move highlight down in the project list",
          shortcut: ["Down"],
          group: "Navigation",
          run: () => {
            setSelectedIndex((current) => (current === visibleCount - 1 ? 0 : current + 1))
          },
        },
      )
    }

    const projectCommands: AppCommand[] = projects.map((project) => ({
      id: `project-${project.name}`,
      title: `Switch to ${project.name}`,
      description: `Last updated ${project.updated}`,
      shortcut: ["Enter"],
      group: "Projects",
      run: () => {
        setQuery("")
        const projectIndex = projects.findIndex((entry) => entry.name === project.name)
        if (projectIndex !== -1) {
          setSelectedIndex(projectIndex)
        }
      },
    }))

    return [...commands, ...projectCommands]
  }, [visibleCount])

  const normalizedPaletteQuery = paletteQuery.trim().toLowerCase()
  const filteredCommands = useMemo<AppCommand[]>(() => {
    if (!normalizedPaletteQuery) return appCommands
    return appCommands.filter((command) => {
      const haystack = [
        command.title,
        command.description ?? "",
        command.group ?? "",
        command.shortcut?.join(" ") ?? "",
      ]
      return haystack.some((value) => value.toLowerCase().includes(normalizedPaletteQuery))
    })
  }, [appCommands, normalizedPaletteQuery])
  const filteredCount = filteredCommands.length
  const selectedCommand = filteredCommands[paletteSelectedIndex]

  const handlePaletteSelect = (index: number) => {
    setPaletteSelectedIndex(index)

    const command = filteredCommands[index]
    if (!command) return

    command.run()
    setPaletteOpen(false)
  }

  useKeyboard((key: KeyEvent) => {
    if ((key.meta || key.ctrl) && key.name === "k") {
      key.preventDefault()
      setPaletteOpen(true)
      setPaletteQuery("")
      setPaletteSelectedIndex(0)
      return
    }

    if (isPaletteOpen) {
      if (key.name === "escape") {
        key.preventDefault()
        setPaletteOpen(false)
        return
      }

      if ((key.name === "up" || key.name === "k") && filteredCount > 0) {
        key.preventDefault()
        setPaletteSelectedIndex((current) => (current === 0 ? filteredCount - 1 : current - 1))
        return
      }

      if ((key.name === "down" || key.name === "j") && filteredCount > 0) {
        key.preventDefault()
        setPaletteSelectedIndex((current) => (current === filteredCount - 1 ? 0 : current + 1))
        return
      }

      if (key.name === "return" || key.name === "enter") {
        key.preventDefault()
        const command = filteredCommands[paletteSelectedIndex]
        if (command) {
          command.run()
          setPaletteOpen(false)
        }
        return
      }

      return
    }

    if (visibleCount === 0) return

    if (key.name === "up" || key.name === "k") {
      key.preventDefault()
      setSelectedIndex((current) => (current === 0 ? visibleCount - 1 : current - 1))
      return
    }

    if (key.name === "down" || key.name === "j") {
      key.preventDefault()
      setSelectedIndex((current) => (current === visibleCount - 1 ? 0 : current + 1))
    }
  })

  useEffect(() => {
    setSelectedIndex(0)
    searchInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (visibleCount === 0) {
      setSelectedIndex(0)
      return
    }

    setSelectedIndex((current) => Math.min(current, visibleCount - 1))
  }, [visibleCount])

  useEffect(() => {
    const scrollbox = scrollRef.current
    if (!scrollbox || !selectedProject) return

    const target = scrollbox.findDescendantById(`project-${selectedProject.name}`)
    if (!target) return

    const viewportTop = scrollbox.viewport.y
    const viewportBottom = viewportTop + scrollbox.viewport.height
    const itemTop = target.y
    const itemBottom = itemTop + target.height
    const maxScrollTop = Math.max(0, scrollbox.scrollHeight - scrollbox.viewport.height)

    if (itemTop < viewportTop) {
      const delta = viewportTop - itemTop
      scrollbox.scrollTop = Math.max(0, scrollbox.scrollTop - delta)
      return
    }

    if (itemBottom > viewportBottom) {
      const delta = itemBottom - viewportBottom
      scrollbox.scrollTop = Math.min(maxScrollTop, scrollbox.scrollTop + delta)
    }
  }, [selectedProject])

  useEffect(() => {
    if (!isPaletteOpen) {
      setPaletteQuery("")
      setPaletteSelectedIndex(0)
      searchInputRef.current?.focus()
      return
    }

    paletteSearchInputRef.current?.focus()
    if (paletteScrollRef.current) {
      paletteScrollRef.current.scrollTop = 0
    }
  }, [isPaletteOpen])

  useEffect(() => {
    if (!isPaletteOpen) return

    if (filteredCount === 0) {
      setPaletteSelectedIndex(0)
      return
    }

    setPaletteSelectedIndex((current) => Math.min(current, filteredCount - 1))
  }, [filteredCount, isPaletteOpen])

  useEffect(() => {
    if (!isPaletteOpen) return

    const command = selectedCommand
    const scrollbox = paletteScrollRef.current
    if (!command || !scrollbox) return

    const target = scrollbox.findDescendantById(`command-${command.id}`)
    if (!target) return

    const viewportTop = scrollbox.viewport.y
    const viewportBottom = viewportTop + scrollbox.viewport.height
    const itemTop = target.y
    const itemBottom = itemTop + target.height
    const maxScrollTop = Math.max(0, scrollbox.scrollHeight - scrollbox.viewport.height)

    if (itemTop < viewportTop) {
      const delta = viewportTop - itemTop
      scrollbox.scrollTop = Math.max(0, scrollbox.scrollTop - delta)
      return
    }

    if (itemBottom > viewportBottom) {
      const delta = itemBottom - viewportBottom
      scrollbox.scrollTop = Math.min(maxScrollTop, scrollbox.scrollTop + delta)
    }
  }, [selectedCommand, isPaletteOpen])

  return (
    <box
      style={{
        flexDirection: "column",
        backgroundColor: theme.background,
        padding: 2,
        gap: 1,
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      {isPaletteOpen ? (
        <box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
            backgroundColor: theme.backgroundAlt,
            gap: 1,
          }}
        >
          <CommandPalette
            title="Run Command"
            placeholder="Type a command..."
            emptyMessage="No commands match your search"
            query={paletteQuery}
            onQueryChange={setPaletteQuery}
            commands={filteredCommands}
            selectedIndex={paletteSelectedIndex}
            onSelect={handlePaletteSelect}
            searchInputRef={paletteSearchInputRef}
            scrollRef={paletteScrollRef}
          />
        </box>
      ) : null}

      <text>
        Step: <span fg={theme.accent}>1/4 - Select Project</span>
      </text>

      <box
        style={{
          flexDirection: "column",
          gap: 1,
          padding: 1,
          border: true,
          borderColor: theme.border,
          backgroundColor: theme.surface,
          flexGrow: 1,
        }}
      >
        <text>
          <strong fg={theme.textPrimary}>Select Project</strong>
        </text>

        <text attributes={TextAttributes.DIM} fg={theme.textMuted}>
          Choose the project you want to review
        </text>

        <SearchInput ref={searchInputRef} value={query} placeholder="Search projects..." onInput={setQuery} />

        <box style={{ flexDirection: "column", gap: 1, flexGrow: 1 }}>
          <ProjectList
            projects={visibleProjects}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            scrollRef={scrollRef}
          />
        </box>

        <text attributes={TextAttributes.DIM}>
          <span fg={theme.accentMuted}>Tip:</span> Type to filter, then use arrow keys or click to select a project
        </text>
      </box>

      <text attributes={TextAttributes.BOLD} fg={theme.positive}>
        <span>●</span> AI Code Review System v1.0.0
      </text>
    </box>
  )
}

render(<App />)
