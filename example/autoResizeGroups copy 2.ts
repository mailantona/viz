/* import type { FlowNode } from "@/components/applications/nodeTypes"

// Отступы от краев группы до крайних нод
const PADDING = {
  top: 50,
  right: 30,
  bottom: 30,
  left: 30,
}

// Одинаковое расстояние между самими нодами по горизонтали и вертикали
const GAP = 30

// Погрешность по оси Y (в пикселях). 
// Если ноды по вертикали отличаются меньше чем на 80px, они считаются одной "строкой".
const ROW_TOLERANCE = 80

export function autoResizeGroups(nodes: FlowNode[]): FlowNode[] {
  const appsByGroup = new Map<string, FlowNode[]>()

  // 1. Собираем детей по группам
  for (const node of nodes) {
    if (node.type !== "application" || node.hidden || !node.parentId) continue
    if (!appsByGroup.has(node.parentId)) {
      appsByGroup.set(node.parentId, [])
    }
    appsByGroup.get(node.parentId)!.push(node)
  }

  const nextNodes = [...nodes]

  for (let i = 0; i < nextNodes.length; i++) {
    const groupNode = nextNodes[i]

    if (groupNode.type === "group") {
      const children = appsByGroup.get(groupNode.id)
      if (!children || children.length === 0) continue

      // 2. Сортируем ноды по вертикали (Y), чтобы выявить визуальные строки
      const sortedByY = [...children].sort((a, b) => a.position.y - b.position.y)

      // 3. Группируем ноды в строки на основе их Y-координаты с учетом погрешности
      const rows: FlowNode[][] = []
      let currentRow: FlowNode[] = []
      let currentBaseY = sortedByY[0]?.position.y ?? 0

      for (const child of sortedByY) {
        // Если нода находится примерно на том же уровне, добавляем в текущую строку
        if (Math.abs(child.position.y - currentBaseY) <= ROW_TOLERANCE) {
          currentRow.push(child)
        } else {
          // Иначе начинаем новую строку
          rows.push(currentRow)
          currentRow = [child]
          currentBaseY = child.position.y
        }
      }
      if (currentRow.length > 0) rows.push(currentRow)

      // 4. Аккуратно расставляем ноды, сохраняя их относительный порядок
      let currentY = PADDING.top
      let maxGroupWidth = 0

      for (const row of rows) {
        // Сортируем ноды внутри одной строки по горизонтали (слева направо)
        row.sort((a, b) => a.position.x - b.position.x)

        let currentX = PADDING.left
        let maxRowHeight = 0

        for (const child of row) {
          const w = child.measured?.width ?? (child.style as any)?.width ?? 300
          const h = child.measured?.height ?? (child.style as any)?.height ?? 180

          // Обновляем позицию ноды в общем массиве
          const childIndex = nextNodes.findIndex((n) => n.id === child.id)
          if (childIndex !== -1) {
            nextNodes[childIndex] = {
              ...nextNodes[childIndex],
              position: { x: currentX, y: currentY },
            }
          }

          // Сдвигаемся вправо на ширину ноды + заданный отступ
          currentX += w + GAP
          maxRowHeight = Math.max(maxRowHeight, h)
        }

        // Запоминаем максимальную ширину группы по самой длинной строке
        maxGroupWidth = Math.max(maxGroupWidth, currentX - GAP)
        
        // Сдвигаемся вниз для следующей строки
        currentY += maxRowHeight + GAP
      }

      // 5. Подгоняем рамку группы под ровно расставленные ноды
      nextNodes[i] = {
        ...groupNode,
        style: {
          ...groupNode.style,
          width: maxGroupWidth + PADDING.right,
          height: currentY - GAP + PADDING.bottom,
        },
      }
    }
  }

  return nextNodes
} */