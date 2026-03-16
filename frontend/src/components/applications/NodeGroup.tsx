import { memo } from "react"
import { type NodeProps, /* NodeResizer */ } from "@xyflow/react"
import type { GroupNodeType } from "./nodeTypes"

export const GroupNode = memo(({ data, /* selected */ }: NodeProps<GroupNodeType>) => {

    return (
        <div className="h-full w-full overflow-hidden">
            {/* HEADER */}
            <div className="
                absolute
                top-0
                left-0
                right-0
                h-10
                px-3
                flex
                items-center
                text-xl
                font-semibold
                tracking-wide
            ">
                {data.label}
            </div>

        </div>
    )
})

GroupNode.displayName = "GroupNode"