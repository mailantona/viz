import type { Node } from "@xyflow/react"

export type ApplicationNodeData = {
    label: string
    labelDesc?: string
    systemStatus: "КИС" | "ЛИС" | "Спец.ПО"
    budgetCategory: "А" | "D" | "С" | "N"
    mainPlatform: string
    appId: string
}

export type GroupNodeData = {
    label: string
}

export type ApplicationNodeType = Node<ApplicationNodeData, "application">
export type GroupNodeType = Node<GroupNodeData, "group">

export type FlowNode = ApplicationNodeType | GroupNodeType