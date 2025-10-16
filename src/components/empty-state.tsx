import { TextAttributes } from "@opentui/core"

import { tokyoNightTheme } from "../theme"

const theme = tokyoNightTheme.colors

type EmptyStateProps = {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <box
      style={{
        width: "100%",
        height: "100%",
        padding: 1,
        border: true,
        borderColor: theme.border,
        backgroundColor: theme.surfaceAlt,
        borderStyle: "rounded",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <text attributes={TextAttributes.DIM} fg={theme.textMuted}>
        {message}
      </text>
    </box>
  )
}
