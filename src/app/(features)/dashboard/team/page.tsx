"use client";

import { getCurrentUserTeams } from "@/actions/team";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";



const formSchema = z.object({
  name: z.string().min(3, 'Team name must be at least 3 characters').max(30, 'Team name must be less than 30 characters'),
});


export default function TeamPage() {

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    getTeams();
  }, []);

  const getTeams = async () => {
    const { teams } = await getCurrentUserTeams();
    setTeams(teams);
  }

  const teamForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  const onTeamFormSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // const res = await createTeam(data);
      // console.log('res :>> ', res);

      teamForm.reset();
    } catch (error) {
      console.error('Error creating team:', error);
      // You can add toast notification here
    }
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {teams.map((team) => (
          <div
            key={team.id}
            className="rounded-lg border p-4 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => router.push(`/dashboard/team/${team.id}`)}
          >
            <h2 className="font-semibold">{team.name}</h2>
            <p className="text-sm text-muted-foreground">
              Created {new Date(team.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        <Card className="m-0 min-h-32 p-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='ghost' className="h-full w-full m-0">
                <PlusIcon className="mr-2 h-4 w-4" />
                New Team
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Team</DialogTitle>
              </DialogHeader>
              <Form {...teamForm}>
                <form onSubmit={teamForm.handleSubmit(onTeamFormSubmit)} className="space-y-4">
                  <FormField
                    control={teamForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter team name" {...field} />
                        </FormControl>
                        <FormDescription>Team name can be changed afterwards.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
}