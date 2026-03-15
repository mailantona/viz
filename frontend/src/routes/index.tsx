import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className="p-2">
            <Link to="/applications" className="[&.active]:font-bold">
                Applications
            </Link>
        </div>
    )
}