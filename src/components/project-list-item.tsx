import { TextAttributes } from "@opentui/core"
import type { Key } from "react"

import { tokyoNightTheme } from "../theme"

const theme = tokyoNightTheme.colors

export type Project = {
  name: string
  updated: string
}

type ProjectListItemProps = {
  project: Project
  selected?: boolean
  onSelect?: () => void
  key?: Key
}

export function ProjectListItem({ project, selected = false, onSelect }: ProjectListItemProps) {
  const borderColor = selected ? theme.accent : theme.border
  const backgroundColor = selected ? theme.surfaceHighlight : theme.surfaceAlt
  const statusColor = selected ? theme.positive : theme.textPrimary

  return (
    <box
      id={`project-${project.name}`}
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
      <box style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
        <text fg={statusColor} style={{ width: 1 }}>
          ●
        </text>
        <text fg={theme.textPrimary}>{project.name}</text>
      </box>

      <text attributes={TextAttributes.DIM} fg={theme.textSecondary}>
        Last updated: {project.updated}
      </text>
    </box>
  )
}
