"use client";

import { Button } from "@/components/ui/button";
import { CustomCard, CustomCardContent, CustomCardFooter } from "@/components/ui/custom-card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Project } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { useGlobalStore } from "@/store/useGlobalStore";
import { DatabaseIcon, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ROUTES } from "@/constants/routes.constants";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const params = useParams();
  const teamId = params.teamId as string;
  const { setActiveProject } = useGlobalStore((state) => state);

  return (
    <Link href={ROUTES.project.list(teamId, project.id)} className="block p-0 m-0 outline-none focus:outline-none focus-visible:outline-none group" onClick={() => setActiveProject(project)}>
      <CustomCard hoverEffect className="group group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <CustomCardContent className="h-34">
          <div className="flex items-start space-x-4 w-full">
            <div className="flex-1 min-w-0">
              <h3 className="text-foreground line-clamp-1 mb-1">
                {project.name}
              </h3>
              <div className="flex items-center text-muted-foreground/60 dark:text-muted-foreground gap-2">
                {project?.description ? <span className=" line-clamp-1">{project.description}</span> : <span>No description</span>}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  variant="ghost"
                  size="sm"
                  tabIndex={-1}
                  className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-bg!"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.project.list(teamId, project.id)}>
                    View Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={ROUTES.project.settings(teamId, project.id)}>
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CustomCardContent>
        <CustomCardFooter className="px-6 pb-3">
          <div className="flex items-center gap-2">
            <DatabaseIcon className="w-4 h-4 inline-block" />
            {/* @ts-expect-error _count not added in generated type*/}
            <span>{project?._count?.forms || 0} Forms</span>
          </div>
          <div className="flex items-center gap-2">
            {project?.createdAt && <span>Created at <span className="tracking-widest ml-1">{formatDate(project?.createdAt)}</span></span>}
          </div>
        </CustomCardFooter>
      </CustomCard>
    </Link>
  );
}
