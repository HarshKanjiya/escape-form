import { ProjectList } from "@/components/projects/projectList";

// export const dynamic = 'force-dynamic'

type ProjectsPageProps = {
    params: Promise<{
        teamId: string;
    }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
    return (
        <div className="container mx-auto px-4 py-6">
            <ProjectList />
        </div>
    );
};
