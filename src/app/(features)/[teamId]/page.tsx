import { ProjectList } from "@/components/projects/projectList";

export default async function ProjectsPage({ params }: { params: Promise<{ teamId: string }> }) {
    const { teamId } = await params;
    return (
        <div className="container mx-auto px-4 py-6 sm:pt-12">
            <ProjectList teamId={teamId} />
        </div>
    );
};
