import type { FlowNode } from "@/components/applications/nodeTypes"

// Настройки для нод ВНУТРИ групп
const NODE_PADDING = { top: 50, right: 30, bottom: 30, left: 30 }
const NODE_GAP = 30
const NODE_ROW_TOLERANCE = 80

// Настройки для самих ГРУПП на холсте
const GROUP_GAP = 20 
// Погрешность для определения "колонки". 
// Если X-координаты групп отличаются меньше чем на 400px, они считаются одной колонкой.
const COLUMN_TOLERANCE = 200 

export function autoResizeGroups(nodes: FlowNode[]): FlowNode[] {
  let nextNodes = [...nodes]

  // --- ШАГ 1: ВНУТРЕННЕЕ ВЫРАВНИВАНИЕ И РЕСАЙЗ ГРУПП (без изменений) ---
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

  // --- ШАГ 2: ВНЕШНЕЕ ВЫРАВНИВАНИЕ (КОЛОНКИ / MASONRY) ---
  const groups = nextNodes.filter(n => n.type === "group")
  if (groups.length === 0) return nextNodes

  // 1. Сортируем все группы сначала по X, чтобы выявить колонки
  const sortedByX = [...groups].sort((a, b) => a.position.x - b.position.x)
  
  const columns: FlowNode[][] = []
  let currentColumn: FlowNode[] = []
  let currentBaseX = sortedByX[0].position.x

  for (const group of sortedByX) {
    if (Math.abs(group.position.x - currentBaseX) <= COLUMN_TOLERANCE) {
      currentColumn.push(group)
    } else {
      columns.push(currentColumn)
      currentColumn = [group]
      currentBaseX = group.position.x
    }
  }
  if (currentColumn.length > 0) columns.push(currentColumn)

  // 2. Раскладываем колонки
  let globalX = 0

  for (const col of columns) {
    // Внутри колонки сортируем группы по их текущему Y (кто был выше, тот и останется выше)
    col.sort((a, b) => a.position.y - b.position.y)
    
    let currentY = 0
    let maxColWidth = 0

    for (const group of col) {
      const gWidth = Number(group.style?.width) || 0
      const gHeight = Number(group.style?.height) || 0

      const gIdx = nextNodes.findIndex(n => n.id === group.id)
      
      // Ставим группу в текущую позицию колонки
      nextNodes[gIdx] = {
        ...nextNodes[gIdx],
        position: { x: globalX, y: currentY }
      }

      // Наращиваем высоту только для этой колонки
      currentY += gHeight + GROUP_GAP
      maxColWidth = Math.max(maxColWidth, gWidth)
    }

    // Сдвигаем X для следующей колонки на ширину самой широкой группы в текущей колонке
    globalX += maxColWidth + GROUP_GAP
  }

  return nextNodes
}