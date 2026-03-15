import ELK from "elkjs/lib/elk.bundled.js"
import { type Edge } from "@xyflow/react"
import { type ApplicationNodeType } from "@/components/applications/NodeApp"

const elk = new ELK()

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "RIGHT",
  "elk.layered.spacing.nodeNodeBetweenLayers": "120",
  "elk.spacing.nodeNode": "80",
}

export async function layoutGraph(
  nodes: ApplicationNodeType[],
  edges: Edge[]
) {
  const graph = {
    id: "root",
    layoutOptions: elkOptions,

    children: nodes.map((node) => ({
      id: node.id,
      width: node.width ?? 200,
      height: node.height ?? 120,
    })),

    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  }

  const layout = await elk.layout(graph)

  const layoutedNodes = nodes.map((node) => {
    const elkNode = layout.children?.find(
      (n) => n.id === node.id
    )

    return {
      ...node,
      position: {
        x: elkNode?.x ?? 0,
        y: elkNode?.y ?? 0,
      },
    }
  })

  return {
    nodes: layoutedNodes,
    edges,
  }
}