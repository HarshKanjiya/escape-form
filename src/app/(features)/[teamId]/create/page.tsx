import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CreateProjectPageProps {
  params: {
    teamId: string;
  };
}

export default function CreateProjectPage({ params }: CreateProjectPageProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/${params.teamId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">
          Set up a new project for your team
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Provide basic information about your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <input 
                type="text" 
                className="w-full mt-1 px-3 py-2 border rounded-md" 
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea 
                className="w-full mt-1 px-3 py-2 border rounded-md" 
                rows={3}
                placeholder="Describe your project"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button>Create Project</Button>
              <Button variant="outline" asChild>
                <Link href={`/${params.teamId}`}>Cancel</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
