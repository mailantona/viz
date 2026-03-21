/**
 * Компонент ребра типа "floating" – рисует кривую между узлами.
 * Path вычисляется с помощью getBezierPath и memoизируется
 * для минимизации перерисовок при стабильных координатах.
 */
import { memo, useMemo } from 'react';
import { getBezierPath, useInternalNode, type EdgeProps } from '@xyflow/react';
import { getEdgeParams } from './EdgeInitialElements';

const FloatingEdge = ({ id, source, target, markerEnd, style }: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const edgePath = useMemo(() => {
    // Быстрая проверка на существование узлов
    if (!sourceNode || !targetNode) return null;

    // Защита от NaN: если размеры еще не измерены движком, не считаем путь
    if (!sourceNode.measured.width || !targetNode.measured.width) return null;

    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

    const [path] = getBezierPath({
      sourceX: sx,
      sourceY: sy,
      sourcePosition: sourcePos,
      targetX: tx,
      targetY: ty,
      targetPosition: targetPos,
    });

    return path;
  }, [sourceNode, targetNode]);

  if (!edgePath) return null;

  return (
    <path
      id={id}
      className="react-flow__edge-path stroke-primary stroke-[2px] fill-none transition-[stroke-width] duration-200"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
};

// 4. Оборачиваем в memo, чтобы React не перерисовывал Edge, 
// если пропсы (id, markerEnd) не менялись
export default memo(FloatingEdge);
