import { Position, MarkerType, type InternalNode, type Node, type Edge } from '@xyflow/react';

// Интерфейс для координат
interface Point {
  x: number;
  y: number;
}

// Помощник для получения пересечения
function getNodeIntersection(intersectionNode: InternalNode, targetNode: InternalNode): Point {
  const { width, height } = intersectionNode.measured ?? { width: 0, height: 0 };
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = (width ?? 0) / 2;
  const h = (height ?? 0) / 2;

  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + (targetNode.measured?.width ?? 0) / 2;
  const y1 = targetPosition.y + (targetNode.measured?.height ?? 0) / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
}

// Возвращает позицию Handle (Top, Right, Bottom, Left)
function getEdgePosition(node: InternalNode, intersectionPoint: Point): Position {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);
  
  const width = node.measured?.width ?? 0;
  const height = node.measured?.height ?? 0;

  if (px <= nx + 1) return Position.Left;
  if (px >= nx + width - 1) return Position.Right;
  if (py <= ny + 1) return Position.Top;
  if (py >= ny + height - 1) return Position.Bottom;

  return Position.Top;
}

// Главная функция для параметров ребра
export function getEdgeParams(source: InternalNode, target: InternalNode) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

// Генерация начальных элементов
export function initialElements(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const center = { x: 400, y: 400 };

  nodes.push({ 
    id: 'target', 
    data: { label: 'Target' }, 
    position: center,
    type: 'application' // Ваш тип узла
  });

  for (let i = 0; i < 180; i++) {
    const degrees = i * (360 / 180);
    const radians = degrees * (Math.PI / 180);
    const x = 250 * Math.cos(radians) + center.x;
    const y = 250 * Math.sin(radians) + center.y;

    nodes.push({ 
      id: `${i}`, 
      data: { label: `Source ${i}` }, 
      position: { x, y },
      type: 'application' 
    });

    edges.push({
      id: `edge-${i}`,
      target: 'target',
      source: `${i}`,
      type: 'floating',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });
  }

  return { nodes, edges };
}
