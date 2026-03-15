/**
 * Описывает пользовательскую ноду `application` для ReactFlow.
 * Проект ориентирован на быстрый рендер большого количества
 * узлов, поэтому здесь используются memo, вынесенные стили,
 * а также выборочное чтение состояния из zustand.
 */

import { memo } from "react";
import { Handle, Position, NodeResizer, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/store";
import { Badge } from "@/components/ui/badge";

/**
 * 1. ТИПИЗАЦИЯ ДАННЫХ НОДЫ
 */
/**
 * Типизация данных, которые хранятся внутри каждой ноды.
 * Поскольку данные используются в UI (метки, статус, идентификатор)
 * удобнее описать шаблон с обязательными полями.
 */
export type ApplicationNodeType = Node<{
    label: string;
    labelDesc?: string;
    systemStatus: "КИС" | "ЛИС" | "Спец.ПО";
    budgetCategory: "А" | "D" | "С" | "N";
    mainPlatform: string;
    appId: string;
}>;

/**
 * 2. КОНСТАНТЫ СТИЛЕЙ (вынесены для предотвращения пересоздания при рендере)
 */
const BUDGET_STYLES: Record<string, string> = {
    "А": "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    "D": "from-indigo-600 to-purple-600 shadow-indigo-500/20",
    "С": "from-amber-500 to-orange-600 shadow-amber-500/20",
    "N": "from-rose-500 to-pink-600 shadow-rose-500/20",
};

const SYSTEM_STATUS_STYLES: Record<string, string> = {
    "КИС": "bg-green-500/15 text-green-600",
    "ЛИС": "bg-destructive/15 text-destructive",
    "Спец.ПО": "bg-yellow-500/15 text-yellow-600",
};

const HANDLE_CLASSES = "w-3 h-3 border-2 border-background opacity-30 hover:opacity-100 transition-opacity z-10";

/**
 * 3. КОМПОНЕНТ НОДЫ
 */
export const ApplicationNode = memo(({ selected, data }: NodeProps<ApplicationNodeType>) => {
    // Оптимизированный выбор состояния из Zustand
    const showResizer = useStore((state) => state.showResizer);

    return (
        <div className="h-full w-full group text-card-foreground">
            {/* Ресайзер ноды */}
            {showResizer && selected && (
                <NodeResizer
                    minWidth={160}
                    minHeight={80}
                    isVisible={selected}
                    lineClassName="border-blue-500"
                    handleClassName="h-3 w-3 bg-background border-2 border-blue-500 rounded-sm"
                />
            )}

            {/* Входной порт */}
            <Handle type="target" position={Position.Top} className={cn( HANDLE_CLASSES, selected ? "opacity-100" : "opacity-0")} />

            {/* Основной контейнер карточки */}
            <div className={cn(
                "h-full w-full shadow-xl overflow-hidden rounded-xl border bg-card flex flex-col transition-all duration-200",
                selected ? "border-slate-500 ring-1 ring-slate-500 shadow-2xl" : "border-border"
            )}>

                {/* Шапка карточки */}
                <div className="bg-muted/50 border-b border-border/50 px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Badge className={cn(
                                "shrink-0 text-[10px] px-1.5 py-0 border-none pointer-events-none font-bold",
                                SYSTEM_STATUS_STYLES[data.systemStatus]
                            )}>
                                {data.systemStatus}
                            </Badge>
                            <div className="text-sm font-semibold truncate text-card-foreground tracking-tight">
                                {data.label}
                            </div>
                        </div>
                        <div className="text-[10px] text-muted-foreground leading-none truncate px-0.5 opacity-60">
                            {data.labelDesc}
                        </div>
                    </div>

                    {/* Индикатор бюджета */}
                    <div className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-linear-to-tr shadow-sm",
                        BUDGET_STYLES[data.budgetCategory] || BUDGET_STYLES["D"]
                    )}>
                        <span className="text-[10px] font-black text-white leading-none">
                            {data.budgetCategory}
                        </span>
                    </div>
                </div>

                {/* Тело карточки */}
                <div className="flex-1 p-3 pt-2 bg-card text-left">
                    <p className="text-[13px] text-card-foreground leading-snug line-clamp-3">
                        {data.label}
                    </p>
                </div>

                {/* Разделитель */}
                <div className="h-px bg-border/40 mx-3" />

                {/* Футер карточки */}
                <div className="flex h-9 items-center bg-card text-sm mt-auto">
                    <div className="flex-1 flex items-center justify-center px-3 min-w-0">
                        <span className="truncate text-foreground text-[10px] font-bold tracking-widest opacity-80">
                            {data.mainPlatform}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-border/60 shrink-0" />

                    <div className="w-24 shrink-0 px-2 text-center font-mono text-[10px] font-medium uppercase tracking-tight text-muted-foreground/80">
                        {data.appId || "Н/Д"}
                    </div>
                </div>
            </div>

            {/* Выходной порт */}
            <Handle type="source" position={Position.Bottom} className={cn( HANDLE_CLASSES, selected ? "opacity-100" : "opacity-0")} />
        </div>
    );
});

ApplicationNode.displayName = "ApplicationNode";
