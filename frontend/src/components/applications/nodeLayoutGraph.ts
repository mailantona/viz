import ELK from "elkjs/lib/elk.bundled.js"
import { type Edge } from "@xyflow/react"
import { type FlowNode } from "@/components/applications/nodeTypes"

const elk = new ELK()

/*
ELK настройки layout
*/
const elkOptions = {
  "elk.algorithm": "box",
  "elk.direction": "RIGHT",
  "elk.spacing.nodeNode": "80",
  "elk.layered.spacing.nodeNodeBetweenLayers": "120",

  "elk.nodeSize.constraints": "MINIMUM_SIZE",
  "elk.edgeRouting": "ORTHOGONAL",
  
}

/*
Тип ноды, возвращаемой ELK
*/
type ElkNode = {
  id: string
  x?: number
  y?: number
  children?: ElkNode[]
}

export async function layoutGraph(
  nodes: FlowNode[],
  edges: Edge[]
) {

  /*
  ────────────────────────
  разделяем ноды
  ────────────────────────
  */

  const groups = nodes.filter((n) => n.type === "group")
  const apps = nodes.filter((n) => n.type === "application")

  /*
  ────────────────────────
  строим структуру ELK
  ────────────────────────
  */

  const graph = {
    id: "root",
    layoutOptions: elkOptions,

    children: groups.map((group) => ({
      id: group.id,
      width: group.width ?? 600,
      height: group.height ?? 400,

      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
      },

      children: apps
        .filter((app) => app.parentId === group.id)
        .map((app) => ({
          id: app.id,
          width: app.width ?? app.measured?.width ?? 300,
          height: app.height ?? app.measured?.height ?? 160,
        })),
    })),

    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  }

  /*
  ────────────────────────
  запускаем ELK
  ────────────────────────
  */

  const layout = await elk.layout(graph) as { children?: ElkNode[] }

  /*
  ────────────────────────
  собираем координаты
  ────────────────────────
  */

  const positions = new Map<string, { x: number; y: number }>()

  layout.children?.forEach((group) => {

    positions.set(group.id, {
      x: group.x ?? 0,
      y: group.y ?? 0,
    })

    group.children?.forEach((child) => {
      positions.set(child.id, {
        x: child.x ?? 0,
        y: child.y ?? 0,
      })
    })
  })

  /*
  ────────────────────────
  применяем позиции
  ────────────────────────
  */

  const layoutedNodes = nodes.map((node) => ({
    ...node,
    position: positions.get(node.id) ?? node.position,
  }))

  return {
    nodes: layoutedNodes,
    edges,
  }
}