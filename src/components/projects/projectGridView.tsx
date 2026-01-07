import { Project } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";
import { ProjectCard } from "./projectCard";
import { CustomCard, CustomCardContent, CustomCardFooter } from "../ui/custom-card";

function ProjectGridView({ projects, loading }: { projects: Project[]; loading: boolean }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                loading ?
                    Array.from({ length: 3 }).map((_, index) => (
                        <CustomCard key={index}>
                            <CustomCardContent className="h-[136px]">
                                <Skeleton className="h-40 w-full rounded-md" />
                            </CustomCardContent>
                            <CustomCardFooter className="flex items-center justify-between">
                                <Skeleton className="h-5 w-32 rounded-md" />
                                <Skeleton className="h-5 w-14 rounded-md" />
                            </CustomCardFooter>
                        </CustomCard>
                    ))
                    :
                    projects.map((project) => <ProjectCard key={project.id} project={project} />)
            }
        </div>
    );
}

export default ProjectGridView;