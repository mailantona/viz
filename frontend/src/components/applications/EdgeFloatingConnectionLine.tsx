/**
 * Кастомный компонент линии соединения, отображаемый во время
 * перетаскивания нового ребра. Используется не только для
 * отображения пути, но и маленького кружка в конце.
 */
import { memo } from 'react';
import { getBezierPath, type ConnectionLineComponentProps, type InternalNode } from '@xyflow/react';
import { getEdgeParams } from '../../scripts/initialElements';

const FloatingConnectionLine = ({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
}: ConnectionLineComponentProps) => {
  if (!fromNode) return null;

  // 1. Оптимизация: создаем mock-объект без лишних вложений, если возможно, 
  // но сохраняем структуру для getEdgeParams
  const targetNode = {
    id: 'connection-target',
    measured: { width: 1, height: 1 },
    internals: {
      positionAbsolute: { x: toX, y: toY },
    },
  } as InternalNode;

  // 2. Расчет параметров (sx, sy и т.д.)
  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    fromNode as InternalNode,
    targetNode
  );

  // 3. Генерация пути Bezier
  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos || fromPosition,
    targetPosition: targetPos || toPosition,
    targetX: tx || toX,
    targetY: ty || toY,
  });

  return (
    <g className="pointer-events-none">
      <path
        fill="none"
        stroke="currentColor" 
        strokeWidth={2}
        className="react-flow__connection-path dashed animated opacity-60"
        d={edgePath}
      />
      <circle
        cx={tx || toX}
        cy={ty || toY}
        fill="var(--background)"
        r={3}
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </g>
  );
};

// 4. memo здесь критически важен, так как компонент вызывается очень часто
export default memo(FloatingConnectionLine);
