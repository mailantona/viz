import { createFileRoute } from '@tanstack/react-router'
import Application from '@/pages/Application'
import { MarkerType, type Edge } from "@xyflow/react";
import { z } from 'zod'
import type { ApplicationNodeType } from '../components/applications/NodeApp'
import { LoaderCircle } from "lucide-react" // Импортируем иконку для лоадера 

const fetchFlowData = async (): Promise<{ nodes: ApplicationNodeType[], edges: Edge[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 500)); 
  return {
    nodes: [
      {
        id: "1",
        type: "application",
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
        position: { x: 500, y: 500 },
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
    ],
    edges: [
      { 
        id: "e1-2", 
        source: "1", 
        target: "2", 
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