import { getTeamProjects } from "@/actions/project";
import { ProjectList } from "@/components/projects/projectList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type ProjectsPageProps = {
    params: Promise<{
        teamId: string;
    }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
    const { teamId } = await params;
    const projectsResponse = await getTeamProjects(teamId);

    // Handle error cases
    if (!projectsResponse.success) {
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
    const projects = projectsResponse.data || [];

    return (
        <div className="container mx-auto px-4 py-6">
            <ProjectList projects={projects} />
        </div>
    );
};
