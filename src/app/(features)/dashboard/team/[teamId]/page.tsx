
"use client";

import { useProjects } from '@/hooks/useProjects';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    FolderOpen,
    Users,
    Calendar,
    TrendingUp,
    FileText,
    BarChart3
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTeam } from '@/hooks/useTeam';

export default function TeamOverviewPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.teamId as string;

    const { teams } = useTeam();
    const { projects, createProject } = useProjects(teamId);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const currentTeam = teams.find(team => team.id === teamId);

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) return;

        setIsCreating(true);
        const project = await createProject(newProjectName, newProjectDescription);
        if (project) {
            setIsCreateDialogOpen(false);
            setNewProjectName('');
            setNewProjectDescription('');
            router.push(`/dashboard/team/${teamId}/project/${project.id}`);
        }
        setIsCreating(false);
    };

    const stats = [
        {
            title: 'Total Projects',
            value: projects.length,
            icon: FolderOpen,
            color: 'text-blue-600'
        },
        {
            title: 'Active Forms',
            value: '12', // This would come from forms data
            icon: FileText,
            color: 'text-green-600'
        },
        {
            title: 'Team Members',
            value: '1', // This would come from team members data
            icon: Users,
            color: 'text-purple-600'
        },
        {
            title: 'Monthly Responses',
            value: '284', // This would come from analytics data
            icon: TrendingUp,
            color: 'text-orange-600'
        }
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {currentTeam?.name || 'Team Overview'}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your projects and track team activity
                    </p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Project
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                            <DialogDescription>
                                Create a new project to organize your forms and collect responses.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="Enter project name..."
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description (optional)</Label>
                                <Textarea
                                    id="description"
                                    value={newProjectDescription}
                                    onChange={(e) => setNewProjectDescription(e.target.value)}
                                    placeholder="Describe your project..."
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreateProject}
                                disabled={!newProjectName.trim() || isCreating}
                            >
                                {isCreating ? 'Creating...' : 'Create Project'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Projects Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Projects</h2>
                    <Button variant="outline" size="sm" asChild>
                        <span onClick={() => router.push(`/dashboard/team/${teamId}/projects`)}>
                            View All
                        </span>
                    </Button>
                </div>

                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                            <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                                Create your first project to start organizing forms and collecting responses.
                            </p>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Project
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.slice(0, 6).map((project) => (
                            <Card
                                key={project.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => router.push(`/dashboard/team/${teamId}/project/${project.id}`)}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{project.name}</CardTitle>
                                        <Badge variant="secondary">Active</Badge>
                                    </div>
                                    {project.description && (
                                        <CardDescription className="line-clamp-2">
                                            {project.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <FileText className="w-3 h-3" />
                                                0 forms
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <BarChart3 className="w-3 h-3" />
                                                0 responses
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Common tasks to help you get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            onClick={() => setIsCreateDialogOpen(true)}
                        >
                            <FolderOpen className="w-6 h-6" />
                            <span>Create Project</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            onClick={() => router.push(`/dashboard/team/${teamId}/members`)}
                        >
                            <Users className="w-6 h-6" />
                            <span>Invite Members</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            onClick={() => router.push(`/dashboard/team/${teamId}/settings`)}
                        >
                            <Badge className="w-6 h-6" />
                            <span>Team Settings</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}