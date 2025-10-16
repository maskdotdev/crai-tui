import type { ScrollBoxRenderable } from "@opentui/core"
import type { RefObject } from "react"

import { EmptyState } from "./empty-state"
import type { Project } from "./project-list-item"
import { ProjectListItem } from "./project-list-item"

type ProjectListProps = {
  projects: Project[]
  selectedIndex: number
  onSelect: (index: number) => void
  scrollRef?: RefObject<ScrollBoxRenderable | null>
}

export function ProjectList({ projects, selectedIndex, onSelect, scrollRef }: ProjectListProps) {
  return (
    <scrollbox
      ref={scrollRef}
      style={{
        flexGrow: 1,
        flexShrink: 1,
        width: "100%",
        height: "100%",
      }}
    >
      {projects.length === 0 ? (
        <EmptyState message="No projects found" />
      ) : (
        projects.map((project, index) => (
          <ProjectListItem
            key={project.name}
            project={project}
            selected={index === selectedIndex}
            onSelect={() => onSelect(index)}
          />
        ))
      )}
    </scrollbox>
  )
}
