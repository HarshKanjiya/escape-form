import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";


function FormEmptyState({ searchQuery, projectId }: { searchQuery: string, projectId: string }) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ClipboardList />
                </EmptyMedia>
                <EmptyTitle>No Forms Yet</EmptyTitle>
                <EmptyDescription>
                    {
                        searchQuery?.length ? (
                            <span>
                                No forms match your search criteria.
                            </span>
                        ) :
                            <span>
                                Get started by creating your first form.
                            </span>
                    }
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                {!searchQuery && (
                    <Link href={`${projectId}/forms/new`}>
                        <Button>
                            Create Form
                        </Button>
                    </Link>
                )}
            </EmptyContent>
        </Empty>
    );
}

export default FormEmptyState;