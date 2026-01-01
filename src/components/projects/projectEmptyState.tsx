import { Folder } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import AddProject from "./addProject";

function ProjectEmptyState({ searchQuery, getProjects }: { searchQuery: string, getProjects: () => void }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Folder />
                </EmptyMedia>
                <EmptyTitle>No Projects Yet</EmptyTitle>
                <EmptyDescription>
                    {
                        searchQuery?.length ? (
                            <span>
                                No projects match your search criteria.
                            </span>
                        ) :
                            <span>
                                Get started by creating your first project.
                            </span>
                    }
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                {!searchQuery && (
                    <AddProject onSuccess={() => getProjects()} />
                )}
            </EmptyContent>
        </Empty>
    );
}

export default ProjectEmptyState;