/* import type { FlowNode } from "@/components/applications/nodeTypes"

// Расстояние от краев группы до нод (сверху больше, чтобы не перекрывать заголовок)
const PADDING = {
  top: 50, 
  right: 30,
  bottom: 30,
  left: 30,
}

// Расстояние между самими нодами
const GAP = 30
// Количество колонок внутри группы
const COLUMNS = 2 

export function autoResizeGroups(nodes: FlowNode[]): FlowNode[] {
  // 1. Группируем дочерние элементы по их родителям
  const appsByGroup = new Map<string, FlowNode[]>()

  for (const node of nodes) {
    if (node.type !== "application" || node.hidden || !node.parentId) continue

    if (!appsByGroup.has(node.parentId)) {
      appsByGroup.set(node.parentId, [])
    }
    appsByGroup.get(node.parentId)!.push(node)
  }

  // 2. Создаем копию всех нод для мутации (React Flow требует новый массив)
  const nextNodes = [...nodes]

  // 3. Расставляем детей в сетку и меняем размер группы
  for (let i = 0; i < nextNodes.length; i++) {
    const groupNode = nextNodes[i]

    if (groupNode.type === "group") {
      const children = appsByGroup.get(groupNode.id)
      if (!children || children.length === 0) continue

      // Сортируем ноды для стабильного порядка (например, по ID), 
      // чтобы они не прыгали местами при каждом клике
      children.sort((a, b) => a.id.localeCompare(b.id))

      let currentX = PADDING.left
      let currentY = PADDING.top
      let maxRowHeight = 0
      let col = 0

      let maxGroupWidth = 0
      let maxGroupHeight = 0

      for (const child of children) {
        // Берем измеренные размеры ноды, или дефолтные
        const w = child.measured?.width ?? (child.style as any)?.width ?? 300
        const h = child.measured?.height ?? (child.style as any)?.height ?? 180

        // Перенос на новую строку, если превышен лимит колонок
        if (col >= COLUMNS) {
          col = 0
          currentX = PADDING.left
          currentY += maxRowHeight + GAP
          maxRowHeight = 0
        }

        // Обновляем позицию дочерней ноды (координаты относительны группы)
        const childIndex = nextNodes.findIndex((n) => n.id === child.id)
        if (childIndex !== -1) {
          nextNodes[childIndex] = {
            ...nextNodes[childIndex],
            position: { x: currentX, y: currentY },
          }
        }

        // Вычисляем максимальную высоту в текущей строке
        maxRowHeight = Math.max(maxRowHeight, h)
        
        // Вычисляем крайние точки для размера группы
        maxGroupWidth = Math.max(maxGroupWidth, currentX + w)
        maxGroupHeight = Math.max(maxGroupHeight, currentY + h)

        // Сдвигаемся вправо для следующей ноды
        currentX += w + GAP
        col++
      }

      // Обновляем размеры самой группы с учетом отступов
      nextNodes[i] = {
        ...groupNode,
        style: {
          ...groupNode.style,
          width: maxGroupWidth + PADDING.right,
          height: maxGroupHeight + PADDING.bottom,
        },
      }
    }
  }

  return nextNodes
} */