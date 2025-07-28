import { getProjectForms } from "@/actions/form";
import { FormList } from "@/components/forms/formList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic'

type ProjectsPageProps = {
    params: Promise<{
        teamId: string;
        projectId: string;
    }>;
}

export default async function FormsPage({ params }: ProjectsPageProps) {
    const { projectId } = await params;
    const response = await getProjectForms(projectId);

    // Handle error cases
    if (!response.success) {
        return (
            <div className="container mx-auto px-4 py-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load projects. Please try again later.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Handle the response and extract projects data
    const projects = response.data || [];

    return (
        <div className="container mx-auto px-4 py-6">
            <FormList forms={projects} />
        </div>
    );
};
