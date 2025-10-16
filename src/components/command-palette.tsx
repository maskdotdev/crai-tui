import { TextAttributes, type InputRenderable, type ScrollBoxRenderable } from "@opentui/core"
import type { Ref } from "react"

import { tokyoNightTheme } from "../theme"
import { EmptyState } from "./empty-state"
import { SearchInput } from "./search-input"

const theme = tokyoNightTheme.colors

export type CommandPaletteCommand = {
  id: string
  title: string
  description?: string
  shortcut?: string[]
  group?: string
}

type CommandPaletteProps = {
  title?: string
  placeholder?: string
  emptyMessage?: string
  query: string
  onQueryChange: (value: string) => void
  commands: CommandPaletteCommand[]
  selectedIndex: number
  onSelect: (index: number) => void
  searchInputRef?: Ref<InputRenderable | null>
  scrollRef?: Ref<ScrollBoxRenderable | null>
}

export function CommandPalette({
  title = "Command Palette",
  placeholder = "Search commands...",
  emptyMessage = "No commands found",
  query,
  onQueryChange,
  commands,
  selectedIndex,
  onSelect,
  searchInputRef,
  scrollRef,
}: CommandPaletteProps) {
  const groupedCommands = commands.reduce<Map<string, CommandPaletteCommand[]>>((groups, command) => {
    const groupName = command.group ?? ""
    if (!groups.has(groupName)) {
      groups.set(groupName, [])
    }

    groups.get(groupName)?.push(command)
    return groups
  }, new Map())

  let itemIndex = -1

  return (
    <box
      style={{
        flexDirection: "column",
        gap: 1,
        padding: 1,
        border: true,
        borderColor: theme.border,
        backgroundColor: theme.surface,
        borderStyle: "rounded",
      }}
    >
      <text>
        <strong fg={theme.textPrimary}>{title}</strong>
      </text>

      <SearchInput ref={searchInputRef} value={query} placeholder={placeholder} onInput={onQueryChange} />

      <scrollbox
        ref={scrollRef}
        style={{
          flexGrow: 1,
          flexShrink: 1,
          width: "100%",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {commands.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          Array.from(groupedCommands.entries()).map(([groupName, groupCommands]) => {
            const groupKey = groupName === "" ? "__ungrouped__" : groupName

            return (
              <box key={groupKey} style={{ flexDirection: "column", gap: 1 }}>
                {groupName ? (
                  <text attributes={TextAttributes.DIM} fg={theme.textMuted}>
                    {groupName}
                  </text>
                ) : null}

                {groupCommands.map((command) => {
                  itemIndex += 1
                  const index = itemIndex
                  return (
                    <CommandPaletteItem
                      key={command.id}
                      command={command}
                      selected={index === selectedIndex}
                      onSelect={() => onSelect(index)}
                    />
                  )
                })}
              </box>
            )
          })
        )}
      </scrollbox>
    </box>
  )
}

type CommandPaletteItemProps = {
  command: CommandPaletteCommand
  selected: boolean
  onSelect: () => void
}

function CommandPaletteItem({ command, selected, onSelect }: CommandPaletteItemProps) {
  const borderColor = selected ? theme.accent : theme.borderMuted
  const backgroundColor = selected ? theme.surfaceHighlight : theme.surfaceAlt

  return (
    <box
      id={`command-${command.id}`}
      onMouseDown={onSelect}
      style={{
        flexDirection: "column",
        gap: 0,
        padding: 1,
        border: true,
        borderColor,
        backgroundColor,
        borderStyle: "rounded",
      }}
    >
      <box style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <text fg={theme.textPrimary}>{command.title}</text>
        {command.shortcut && command.shortcut.length > 0 ? (
          <text attributes={TextAttributes.DIM} fg={theme.textSecondary}>
            {command.shortcut.join(" ")}
          </text>
        ) : null}
      </box>

      {command.description ? (
        <text attributes={TextAttributes.DIM} fg={theme.textSecondary}>
          {command.description}
        </text>
      ) : null}
    </box>
  )
}
