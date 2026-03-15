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
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { useRouterState, Link } from "@tanstack/react-router"
import { Route } from "@/routes/applications"

import { ThemeProvider, useTheme } from "next-themes"
import {
  LoaderCircle,
  Home,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useStore } from "@/store/store"

import { ApplicationNode, type ApplicationNodeType } from "@/components/applications/NodeApp"
import FloatingEdge from "@/components/applications/EdgeFloating"
import FloatingConnectionLine from "@/components/applications/EdgeFloatingConnectionLine"
import { FilterPanel } from "@/components/applications/FilterPanel"

/*
────────────────────────
IMPORT LAYOUT ENGINE
────────────────────────
Алгоритм ELK вынесен
в отдельный файл
*/

import { layoutGraph } from "@/lib/layoutGraph"



/*
────────────────────────
СТАБИЛЬНЫЕ NODE TYPES
────────────────────────
ReactFlow рекомендует объявлять их вне компонента
*/

const nodeTypes = {
  application: ApplicationNode,
}

const edgeTypes = {
  floating: FloatingEdge,
}

/*
────────────────────────
GRAPH CANVAS
────────────────────────
*/

function GraphCanvas() {
  /*
  loader из router
  */
  const { nodes: allNodes, edges: allEdges } =
    Route.useLoaderData() as {
      nodes: ApplicationNodeType[]
      edges: Edge[]
    }

  /*
  search параметры
  */
  const { query, status, budget } = Route.useSearch()

  /*
  состояние роутера
  */
  const isLoading = useRouterState({
    select: (s) => s.isLoading,
  })

  /*
  тема
  */
  const { theme, setTheme } = useTheme()

  /*
  Zustand store
  */
  const showResizer = useStore((s) => s.showResizer)
  const toggleResizer = useStore((s) => s.toggleResizer)

  /*
  ReactFlow API
  */
  const { fitView, toObject } = useReactFlow()

  /*
  локальный state графа
  */
  const [nodes, setNodes, onNodesChange] = useNodesState<ApplicationNodeType>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  //Функция для сохранения нод и линий
  const handleSave = useCallback(() => {
    const flow = toObject()
    const layout = {
      nodes: flow.nodes.map(n => ({
        id: n.id,
        position: n.position,
        width: n.width ?? n.measured?.width ?? 300,
        height: n.height ?? n.measured?.height ?? 200
      })),
      viewport: flow.viewport
    }
    localStorage.setItem(
      "viz-layout",
      JSON.stringify(layout)
    )
    console.log("graph saved")
  }, [toObject])
  /*
  ────────────────────────
  FILTER ENGINE
  ────────────────────────
  */

  const graph = useMemo(() => {

    const filteredNodes = allNodes.filter((node) => {
      const label = node.data.label?.toLowerCase() ?? ""
      const matchQuery = !query || label.includes(query.toLowerCase())
      const matchStatus = !status || node.data.systemStatus === status
      const matchBudget = !budget || node.data.budgetCategory === budget
      return matchQuery && matchStatus && matchBudget
    })

    /*
    set для быстрого поиска
    */

    const nodeIds = new Set(filteredNodes.map((n) => n.id))

    const filteredEdges = allEdges.filter(
      (e) =>
        nodeIds.has(e.source) &&
        nodeIds.has(e.target)
    )

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
    }

  }, [allNodes, allEdges, query, status, budget])

  /*
  ────────────────────────
  GRAPH STATE SYNC
  ────────────────────────
  используем позиции из данных
  */

  useEffect(() => {

    setNodes(graph.nodes)
    setEdges(graph.edges)

    requestAnimationFrame(() => {
      fitView({
        duration: 400,
        padding: 0.2,
      })
    })

  }, [graph, setNodes, setEdges, fitView])

  /*
  ────────────────────────
  AUTO LAYOUT BUTTON
  ────────────────────────
  */

  const handleAutoLayout = useCallback(async () => {

    const { nodes: layoutedNodes, edges: layoutedEdges } = await layoutGraph(nodes, edges)

    setNodes(layoutedNodes)
    setEdges(layoutedEdges)

    requestAnimationFrame(() => {
      fitView({
        duration: 400,
        padding: 0.2,
      })
    })

  }, [nodes, edges, setNodes, setEdges, fitView])

  /*
  ────────────────────────
  CONNECT HANDLER
  ────────────────────────
  */

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  /*
  color mode для ReactFlow
  */

  const colorMode = useMemo(() => {
    return (
      theme === "dark" || theme === "light" ? theme : "system"
    ) as "dark" | "light" | "system"
  }, [theme])

  /*
  ────────────────────────
  RENDER
  ────────────────────────
  */

  return (
    <div className="h-screen w-screen bg-background">

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
        onConnect={onConnect}
        connectionLineComponent={FloatingConnectionLine}
        colorMode={colorMode}
        fitView
      >

        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
        />

        {/* toolbar */}
        <Panel position="top-right" className="flex flex-row gap-2" >
          {/* auto layout */}
          <Button variant="outline" size="icon" onClick={handleAutoLayout} title="Auto layout" > <LayoutGrid size={18} /> </Button>

          {/* Сохранить ноды */}
          <Button variant="outline" size="icon" onClick={handleSave} title="Save graph" >
            <Save size={18} />
          </Button>

          {/* node resize toggle */}
          <Button variant={showResizer ? "default" : "outline"} size="icon" onClick={toggleResizer} > {showResizer ? <Minimize2 size={18} /> : <Maximize2 size={18} />} </Button>

          {/* theme */}
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} > {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />} </Button>
        </Panel>

        <Panel position="top-left" className="flex flex-col gap-4">
          {/* home */}
          <Button variant="destructive" size="icon-lg" asChild >
            <Link to="/">
              <Home size={18} />
            </Link>
          </Button>
          <FilterPanel />
        </Panel>

      </ReactFlow>
    </div>
  )
}

/*
────────────────────────
ROOT COMPONENT
────────────────────────
*/

export default function Application() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <ReactFlowProvider>
        <GraphCanvas />
      </ReactFlowProvider>
    </ThemeProvider>
  )
}