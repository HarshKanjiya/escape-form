import { Building2 } from "lucide-react";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import AddTeam from "./addTeam";


function EmptyState({ searchQuery }: { searchQuery: string }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Building2 />
                </EmptyMedia>
                <EmptyTitle>No Teams Yet</EmptyTitle>
                <EmptyDescription>
                    {
                        searchQuery?.length ? (
                            <span>
                                No teams match your search criteria.
                            </span>
                        ) :
                            <span>
                                Get started by creating your first team.
                            </span>
                    }
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                {!searchQuery && (
                    <AddTeam />
                )}
            </EmptyContent>
        </Empty>
    );
}

export default EmptyState;