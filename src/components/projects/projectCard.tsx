"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Project } from "@/types/db";
import { Calendar, Folder, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SpotlightCard } from "../ui/spotLightCard";
import { useStore } from "@/store/useStore";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const params = useParams();
  const teamId = params.teamId as string;
  const { setActiveProject } = useStore((state) => state);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/${teamId}/${project.id}`} className="block" onClick={() => setActiveProject(project)}>
      <SpotlightCard>
        <Card className="group relative hover:shadow-md transition-all duration-200 cursor-pointer bg-secondary/50 backdrop-blur-2xl rounded-none">
          <CardContent className="px-4 sm:p-6">
            <div className="flex items-center space-x-4">

              <div className="p-3 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Folder className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -left-8 -bottom-5 -z-10 opacity-70">
                <Folder className="w-28 h-28 sm:w-36 sm:h-36 text-secondary" />0
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground line-clamp-1 mb-1">
                  {project.name}
                </h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Created {formatDate(project.created_at)}</span>
                </div>
              </div>

              {/* Action Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/${teamId}/${project.id}`}>
                      View Project
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${teamId}/${project.id}/settings`}>
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </SpotlightCard>
    </Link>
  );
}
