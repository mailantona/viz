// Application.tsx
import { useCallback, useEffect, useMemo } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  type Edge,
  type Connection,
  useReactFlow,
  MarkerType
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { Link, useRouterState } from "@tanstack/react-router"
import { Route } from "@/routes/applications"
import { ThemeProvider, useTheme } from "next-themes"
import { Home, Sun, Moon, Maximize2, Minimize2, LayoutGrid, Save, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useStore } from "@/store/store" // Используем ваш стор
import { ApplicationNode } from "@/components/applications/NodeApp"
import FloatingEdge from "@/components/applications/EdgeFloating"
import FloatingConnectionLine from "@/components/applications/EdgeFloatingConnectionLine"
import { FilterPanel } from "@/components/applications/NodeFilterPanel"
import type { FlowNode } from "@/components/applications/nodeTypes"
import { layoutGraph } from "@/components/applications/nodeLayoutGraph"

const nodeTypes = { application: ApplicationNode }
const edgeTypes = { floating: FloatingEdge }

function GraphCanvas() {
  const { nodes: initialNodes, edges: initialEdges } = Route.useLoaderData()
  const { query, status, budget } = Route.useSearch()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { getNodes, getEdges, fitView } = useReactFlow()

  // Достаем состояние из стора
  const showResizer = useStore((s) => s.showResizer)
  const toggleResizer = useStore((s) => s.toggleResizer)

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  // 1. Создаем функцию-хелпер для фитвью
  const performFitView = useCallback(() => {
    // requestAnimationFrame выполнится сразу, как только браузер будет готов к отрисовке
    requestAnimationFrame(() => {
      fitView({
        duration: 400,
        padding: 0.2,
        includeHiddenNodes: false
      });
    });
  }, [fitView]);
  // Единая логика фильтрации и синхронизации данных
  useEffect(() => {
    const appVisibility = new Map<string, boolean>()

    // 1. Фильтруем приложения
    const processedNodes = initialNodes.map((node) => {
      if (node.type === "group") return node

      const data = node.data as any
      const matchesQuery = !query || data.label?.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = !status || data.systemStatus === status
      const matchesBudget = !budget || data.budgetCategory === budget

      const isVisible = matchesQuery && matchesStatus && matchesBudget
      appVisibility.set(node.id, isVisible)

      return {
        ...node,
        hidden: !isVisible,
        data: { ...node.data } // Прокидываем состояние стора в данные ноды
      }
    })

    // 2. Скрываем группы без видимых детей
    const finalNodes = processedNodes.map((node) => {
      if (node.type === "group") {
        const hasVisibleChildren = initialNodes.some(
          (child) => child.parentId === node.id && appVisibility.get(child.id)
        )
        return { ...node, hidden: !hasVisibleChildren, data: { ...node.data } }
      }
      return node
    })

    setNodes(finalNodes)
    setEdges(initialEdges.filter(e => appVisibility.get(e.source) && appVisibility.get(e.target)))
    performFitView();

  }, [query, status, budget, initialNodes, initialEdges, setNodes, setEdges])

  const handleAutoLayout = useCallback(async () => {
    const { nodes: layoutedNodes } = await layoutGraph(getNodes() as FlowNode[], getEdges())
    setNodes(layoutedNodes)
    performFitView();
  }, [getNodes, getEdges, setNodes, fitView])

  const handleSave = useCallback(() => {
    const allNodes = getNodes();
    const allEdges = getEdges();
    // Логика сохранения (например, вывод в консоль или API запрос)
    console.log("Saving full graph structure:", { nodes: allNodes, edges: allEdges });

  }, [getNodes, getEdges]);

  /*
  состояние роутера
  */
  const isLoading = useRouterState({
    select: (s) => s.isLoading,
  })

  /*
    ────────────────────────
    CONNECT HANDLER
    ────────────────────────
    */

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "floating", markerEnd: { type: MarkerType.ArrowClosed } }, eds)
      ),
    [setEdges]
  );

  const colorMode = useMemo(() => {
    return (
      theme === "dark" || theme === "light" ? theme : "system"
    ) as "dark" | "light" | "system"
  }, [theme])

  return (
    <div className="h-screen w-screen bg-background text-foreground">

      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-[2px] pointer-events-none">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionLineComponent={FloatingConnectionLine}
        colorMode={colorMode}
        onConnect={onConnect}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={20} />

        <Panel position="top-right" className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleAutoLayout} title="Auto Layout">
            <LayoutGrid size={18} />
          </Button>
          {/* ВЕРНУЛИ КНОПКУ СОХРАНИТЬ */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleSave}
            title="Save graph"
          >
            <Save size={18} />
          </Button>
          <Button variant={showResizer ? "default" : "outline"} size="icon" onClick={toggleResizer}>
            {showResizer ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </Panel>

        <Panel position="top-left" className="flex flex-col gap-4">
          <Button variant="destructive" size="icon" asChild><Link to="/"><Home size={18} /></Link></Button>
          <FilterPanel />
        </Panel>
      </ReactFlow>
    </div>
  )
}

export default function Application() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactFlowProvider>
        <GraphCanvas />
      </ReactFlowProvider>
    </ThemeProvider>
  )
}