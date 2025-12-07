"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormPageType, FormType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
    name: z.string().min(1, "Form name is required").min(3, "Form name must be at least 3 characters"),
    description: z.string().optional(),
    type: z.enum(FormType).nullable(),
    logoUrl: z.string().optional(),
    theme: z.string().optional(),
    FormPageType: z.enum(FormPageType).optional(),
    customSubdomain: z.string().optional(),
    requireConsent: z.boolean().optional(),
    allowAnonymous: z.boolean().optional(),
    multipleSubmissions: z.boolean().optional(),
    passwordProtected: z.boolean().optional(),
    analyticsEnabled: z.boolean().optional()
})

type FormValues = z.infer<typeof formSchema>

export default function FormSettings() {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            type: FormType.REACH_OUT,
            allowAnonymous: true,
            multipleSubmissions: true,
            passwordProtected: false,
            analyticsEnabled: false,
            requireConsent: false,
            customSubdomain: "",
            FormPageType: FormPageType.STEPPER,
            theme: "default",
            logoUrl: "",
        },
    });

    const handleSubmit = async (data: FormValues) => {
        const finalData = {

        };
        try {
            // const response = await api.post<ActionResponse<IForm>>(apiConstants.form.createForm(), finalData);
            // const form = response.data?.data;
            // if (!response.data?.success || !form) {
            //     toast.error(response.data?.message || "Failed to create form");
            //     return;
            // }
            // router.push(ROUTES.form.edit(form.teamId, form.projectId, form.id))

        }
        catch (err) {
            console.error("Error creating form:", err);
        }
    };

    const onFormSubmit = () => {
        const formData = form.getValues();
        handleSubmit({ ...formData });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
                <div className="w-full h-full">
                    <div className="flex items-start gap-4 h-full">
                        <Card className="shadow-none w-[200px] aspect-square">
                            <CardContent className="p-0">
                                <div className="relative w-[150px] h-[150px] m-auto">
                                    <Image src="/logo-light.png" alt="Logo" className="h-full w-full object-contain rounded-full overflow-hidden" height={100} width={100} />
                                    <Button className="absolute top-1 right-1 rounded-full" variant={'outline'} size={'icon'}>
                                        <PencilIcon />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none w-full h-full flex-1">
                            <CardContent className="w-full h-full !gap-0 grid grid-cols-12">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                            {/* <FormLabel className="text-base font-medium flex items-center gap-2 required">
                                                Form Name
                                            </FormLabel> */}
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="e.g. Customer Feedback Survey"
                                                    className="text-lg transition-all duration-200 focus:border-primary focus:ring-primary/20 hover:border-gray-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                            {/* <FormLabel className="text-base font-medium flex items-center gap-2 required">
                                                Form Type
                                            </FormLabel> */}
                                            <FormControl>
                                                <Select></Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="col-span-12">
                                            {/* <FormLabel className="text-base font-medium flex items-center gap-2">
                                                Description
                                            </FormLabel> */}
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Tell us what this form is for. This helps you organize your forms and provides context for respondents."
                                                    rows={4}
                                                    className="text-base resize-none transition-all duration-200 focus:border-primary focus:ring-primary/20 hover:border-gray-400 min-h-24"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    )
}