import { createFileRoute } from '@tanstack/react-router'
import Application from '@/pages/Application'
import { MarkerType, type Edge } from "@xyflow/react";
import { z } from 'zod'
import type { FlowNode } from "@/components/applications/nodeTypes"
import { LoaderCircle } from "lucide-react" // Импортируем иконку для лоадера 

const fetchFlowData = async (): Promise<{
  nodes: FlowNode[]
  edges: Edge[]
}> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    nodes: [
      {
        id: "group-1",
        type: "group",
        position: { x: 50, y: 50 },
        style: {
          width: 600,
          height: 400,
          background: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.4)",
          borderRadius: 12,
        },
        data: { label: "Группа: Системы скважин" },
      },
      {
        id: "group-2",
        type: "group",
        position: { x: 750, y: 200 },
        style: {
          width: 500,
          height: 350,
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.4)",
          borderRadius: 12,
        },
        data: { label: "Группа: Инфраструктура" },
      },
      {
        id: "group-3",
        type: "group",
        position: { x: 800, y: 500 },
        style: {
          width: 500,
          height: 350,
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.4)",
          borderRadius: 12,
        },
        data: { label: "Группа: Инфраструктура 2" },
      },
      {
        id: "1",
        type: "application",
        parentId: "group-1",
        position: { x: 100, y: 100 },
        style: { width: 300 },
        data: {
          label: "Цифровое дело скважины, учетотказов подземного оборудования",
          labelDesc: "Корпоративная система управления данными скважин",
          systemStatus: "КИС",
          budgetCategory: "N",
          mainPlatform: "SAP",
          appId: "APP-12956",
        },
      },
      {
        id: "2",
        type: "application",
        parentId: "group-2",
        position: { x: 200, y: 200 },
        style: { width: 300 },
        data: {
          label: "Цифровое дело скважины, учёт отказов подземного оборудования",
          labelDesc: "Локальная система для работы с данными скважин",
          systemStatus: "ЛИС",
          budgetCategory: "D",
          mainPlatform: "SharePoint",
          appId: "APP-12956",
        },
      },
      {
        id: "3",
        type: "application",
        parentId: "group-2",
        position: { x: 10, y: 10 },
        style: { width: 300 },
        data: {
          label: "АРМ РРМ",
          labelDesc: "Локальная система для работы с данными скважин",
          systemStatus: "ЛИС",
          budgetCategory: "D",
          mainPlatform: "SharePoint",
          appId: "APP-12959",
        },
      },
      {
        id: "4",
        type: "application",
        parentId: "group-3",
        position: { x: 10, y: 10 },
        style: { width: 300 },
        data: {
          label: "АРМ РРМ",
          labelDesc: "Локальная система для работы с данными скважин",
          systemStatus: "ЛИС",
          budgetCategory: "D",
          mainPlatform: "SharePoint",
          appId: "APP-12959",
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        type: 'floating',
        markerEnd: { type: MarkerType.ArrowClosed }
      },
      {
        id: "e1-3",
        source: "1",
        target: "3",
        type: 'floating',
        markerEnd: { type: MarkerType.ArrowClosed }
      }
    ]
  }
}

const applicationsSearchSchema = z.object({
  query: z.string().optional(),
  status: z.enum(['КИС', 'ЛИС', 'Спец.ПО']).optional(),
  budget: z.enum(['А', 'D', 'С', 'N']).optional(),
})

export type ApplicationsSearch = z.infer<typeof applicationsSearchSchema>;

export const Route = createFileRoute('/applications')({
  validateSearch: (search) => applicationsSearchSchema.parse(search),

  // УДАЛИЛИ loaderDeps, чтобы фильтрация не вызывала перезагрузку лоадера

  loader: async () => {
    // Загружаем данные ОДИН раз
    return await fetchFlowData();
  },
  // --- ДОБАВЛЕНО: КРАСИВЫЙ ЛОАДЕР ---

  // Чистый лоадер без мерцания и волн
  pendingComponent: () => (
    <div className="flex flex-col h-screen w-screen items-center justify-center bg-background">
      <div className="flex items-center justify-center">
        {/* Оставляем только вращение, убрали animate-ping */}
        <LoaderCircle
          className="h-10 w-10 animate-spin text-primary/80"
          strokeWidth={2}
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-1">
        <h2 className="text-base font-medium tracking-tight text-foreground/80">
          Загрузка данных
        </h2>
        <p className="text-xs text-muted-foreground">
          Пожалуйста, подождите...
        </p>
      </div>
    </div>
  ),

  // Через сколько миллисекунд показывать лоадер (0 = сразу)
  pendingMs: 0,

  // ---------------------------------

  component: Applications,
})

function Applications() {
  return <Application />
}