import ELK, { type ElkNode, type ElkExtendedEdge } from "elkjs/lib/elk.bundled.js"
import { type Edge } from "@xyflow/react"
import { type FlowNode } from "@/components/applications/nodeTypes"

const elk = new ELK()

const APP_WIDTH = 300
const APP_HEIGHT = 180
const DEFAULT_GROUP_WIDTH = 600
const DEFAULT_GROUP_HEIGHT = 400

const rootLayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.spacing.nodeNode": "120",
  "elk.layered.spacing.nodeNodeBetweenLayers": "200",
  "elk.hierarchyHandling": "INCLUDE_CHILDREN",
}

const groupLayoutOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.spacing.nodeNode": "40",
  "elk.padding": "[top=70,left=30,bottom=30,right=30]",
}

export async function layoutGraph(nodes: FlowNode[], edges: Edge[]) {
  const groups = nodes.filter((n) => n.type === "group")
  const apps = nodes.filter((n) => n.type === "application")

  // Создаем структуру, строго следуя типу ElkNode
  const elkGraph: ElkNode = {
    id: "root",
    layoutOptions: rootLayoutOptions,
    children: groups.map((group): ElkNode => {
      const childrenNodes: ElkNode[] = apps
        .filter((app) => app.parentId === group.id && !app.hidden)
        .map((app): ElkNode => ({
          id: app.id,
          width: app.measured?.width ?? (app.style as any)?.width ?? APP_WIDTH,
          height: app.measured?.height ?? (app.style as any)?.height ?? APP_HEIGHT,
        }))

      // Важно: ОБЯЗАТЕЛЬНО возвращаем объект, соответствующий ElkNode
      return {
        id: group.id,
        width: (group.style as any)?.width ?? DEFAULT_GROUP_WIDTH,
        height: (group.style as any)?.height ?? DEFAULT_GROUP_HEIGHT,
        layoutOptions: groupLayoutOptions,
        children: childrenNodes,
      }
    }),
    edges: edges.map((edge): ElkExtendedEdge => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  }

  const layout = await elk.layout(elkGraph)

  const layoutInfo = new Map<string, { x: number; y: number; width?: number; height?: number }>()

  // Используем необязательную цепочку и типизацию для обхода результата
  layout.children?.forEach((group) => {
    layoutInfo.set(group.id, {
      x: group.x ?? 0,
      y: group.y ?? 0,
      width: group.width,
      height: group.height,
    })

    group.children?.forEach((app) => {
      layoutInfo.set(app.id, {
        x: app.x ?? 0,
        y: app.y ?? 0,
      })
    })
  })

  const layoutedNodes = nodes.map((node): FlowNode => {
    const info = layoutInfo.get(node.id)
    if (!info) return node

    if (node.type === "group") {
      return {
        ...node,
        position: { x: info.x, y: info.y },
        style: {
          ...node.style,
          width: info.width,
          height: info.height,
        },
      }
    }

    return {
      ...node,
      position: { x: info.x, y: info.y },
    }
  })

  return {
    nodes: layoutedNodes,
    edges,
  }
}