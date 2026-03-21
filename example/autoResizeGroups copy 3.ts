/* import type { FlowNode } from "@/components/applications/nodeTypes"

// Настройки для нод ВНУТРИ групп
const NODE_PADDING = { top: 50, right: 30, bottom: 30, left: 30 }
const NODE_GAP = 30
const NODE_ROW_TOLERANCE = 80

// Настройки для самих ГРУПП на холсте
const GROUP_GAP = 40 // Расстояние между группами
const GROUP_ROW_TOLERANCE = 200 // Погрешность для определения "строки" из групп

export function autoResizeGroups(nodes: FlowNode[]): FlowNode[] {
  let nextNodes = [...nodes]

  // --- ШАГ 1: ВЫРАВНИВАНИЕ НОД ВНУТРИ ГРУПП И ИХ РЕСАЙЗ ---
  const appsByGroup = new Map<string, FlowNode[]>()
  for (const node of nextNodes) {
    if (node.type === "application" && !node.hidden && node.parentId) {
      if (!appsByGroup.has(node.parentId)) appsByGroup.set(node.parentId, [])
      appsByGroup.get(node.parentId)!.push(node)
    }
  }

  for (let i = 0; i < nextNodes.length; i++) {
    const groupNode = nextNodes[i]
    if (groupNode.type === "group") {
      const children = appsByGroup.get(groupNode.id)
      if (!children || children.length === 0) continue

      // Сортируем детей по текущим позициям
      const sortedByY = [...children].sort((a, b) => a.position.y - b.position.y)
      const rows: FlowNode[][] = []
      let currentRow: FlowNode[] = []
      let currentBaseY = sortedByY[0].position.y

      for (const child of sortedByY) {
        if (Math.abs(child.position.y - currentBaseY) <= NODE_ROW_TOLERANCE) {
          currentRow.push(child)
        } else {
          rows.push(currentRow)
          currentRow = [child]
          currentBaseY = child.position.y
        }
      }
      if (currentRow.length > 0) rows.push(currentRow)

      let currentInnerY = NODE_PADDING.top
      let maxGroupWidth = 0

      for (const row of rows) {
        row.sort((a, b) => a.position.x - b.position.x)
        let currentInnerX = NODE_PADDING.left
        let maxRowHeight = 0

        for (const child of row) {
          const w = child.measured?.width ?? (child.style as any)?.width ?? 300
          const h = child.measured?.height ?? (child.style as any)?.height ?? 180
          
          const idx = nextNodes.findIndex(n => n.id === child.id)
          nextNodes[idx] = { ...nextNodes[idx], position: { x: currentInnerX, y: currentInnerY } }

          currentInnerX += w + NODE_GAP
          maxRowHeight = Math.max(maxRowHeight, h)
        }
        maxGroupWidth = Math.max(maxGroupWidth, currentInnerX - NODE_GAP)
        currentInnerY += maxRowHeight + NODE_GAP
      }

      nextNodes[i] = {
        ...groupNode,
        style: {
          ...groupNode.style,
          width: maxGroupWidth + NODE_PADDING.right,
          height: currentInnerY - NODE_GAP + NODE_PADDING.bottom,
        }
      }
    }
  }

  // --- ШАГ 2: ВЫРАВНИВАНИЕ ГРУПП МЕЖДУ СОБОЙ ---
  const groups = nextNodes.filter(n => n.type === "group")
  if (groups.length === 0) return nextNodes

  // Группируем сами группы в "виртуальные строки" на холсте
  const sortedGroupsByY = [...groups].sort((a, b) => a.position.y - b.position.y)
  const groupRows: FlowNode[][] = []
  let currentGroupRow: FlowNode[] = []
  let currentGroupBaseY = sortedGroupsByY[0].position.y

  for (const group of sortedGroupsByY) {
    if (Math.abs(group.position.y - currentGroupBaseY) <= GROUP_ROW_TOLERANCE) {
      currentGroupRow.push(group)
    } else {
      groupRows.push(currentGroupRow)
      currentGroupRow = [group]
      currentGroupBaseY = group.position.y
    }
  }
  if (currentGroupRow.length > 0) groupRows.push(currentGroupRow)

  let globalY = 0 // Начальная координата первой строки групп

  for (const row of groupRows) {
    row.sort((a, b) => a.position.x - b.position.x)
    let globalX = 0
    let maxRowHeight = 0

    for (const group of row) {
      const gWidth = Number(group.style?.width) || 0
      const gHeight = Number(group.style?.height) || 0

      const gIdx = nextNodes.findIndex(n => n.id === group.id)
      nextNodes[gIdx] = {
        ...nextNodes[gIdx],
        position: { x: globalX, y: globalY }
      }

      globalX += gWidth + GROUP_GAP
      maxRowHeight = Math.max(maxRowHeight, gHeight)
    }
    globalY += maxRowHeight + GROUP_GAP
  }

  return nextNodes
} */