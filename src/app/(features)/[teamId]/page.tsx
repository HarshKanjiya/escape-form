import { ProjectList } from "@/components/projects/projectList";

export default async function ProjectsPage() {
    return (
        <div className="container mx-auto px-4 py-6">
            <ProjectList />
        </div>
    );
};
