import type { InputRenderable } from "@opentui/core"
import { forwardRef } from "react"

import { tokyoNightTheme } from "../theme"

const theme = tokyoNightTheme.colors

type SearchInputProps = {
  value: string
  placeholder?: string
  onInput: (value: string) => void
}

export const SearchInput = forwardRef<InputRenderable, SearchInputProps>(function SearchInput(
  { value, placeholder = "Search...", onInput },
  ref,
) {

  return (
    <box
      style={{
        border: true,
        borderColor: theme.border,
        backgroundColor: theme.surfaceAlt,
        height: 6,
        alignItems: "center",
      }}
    >
      <input
        ref={ref}
        value={value}
        height={4}
        onInput={onInput}
        width={'100%'}
        placeholder={placeholder}
        backgroundColor={theme.surfaceAlt}
        textColor={theme.textPrimary}
        // focusedBackgroundColor={theme.surfaceHighlight}
        // focusedTextColor={theme.textPrimary}
        placeholderColor={theme.placeholder}
        cursorColor={theme.accent}
      />
    </box>
  )
})
