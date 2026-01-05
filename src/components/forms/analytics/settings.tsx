"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormPageType, Form as FormT } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UnsavedChangesBar } from "@/components/shared/unsavedChangesBar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomCard, CustomCardContent, CustomCardDescription, CustomCardHeader, CustomCardTitle } from "@/components/ui/custom-card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button as PreviewButton } from "./previewButton";
import { Separator } from "@/components/ui/separator";
import axios from "@/lib/axios";
import { apiConstants } from "@/constants/api.constants";
import { showError, showSuccess } from "@/lib/utils";

const themeConfigSchema = z.object({
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    buttonSize: z.enum(["sm", "md", "lg"]),
    buttonRadius: z.enum(["none", "sm", "md", "lg", "full"]),
});

const formSettingsSchema = z.object({
    name: z.string().min(3, "Form name must be at least 3 characters"),
    description: z.string().optional(),
    formPageType: z.nativeEnum(FormPageType),
    theme: themeConfigSchema,
});

type FormSettingsValues = z.infer<typeof formSettingsSchema>;

interface FormSettingsProps {
    form: FormT;
    refetchForm?: () => void;
}

const defaultTheme = {
    primaryColor: "#6366f1",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    buttonSize: "md" as const,
    buttonRadius: "md" as const,
};

export default function FormSettings({ form, refetchForm }: FormSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);

    const settingsForm = useForm<FormSettingsValues>({
        resolver: zodResolver(formSettingsSchema),
        defaultValues: {
            name: form.name,
            description: form.description || "",
            formPageType: form.formPageType,
            theme: {
                ...defaultTheme,
                ...(form.metadata as Record<string, any>),
            },
        },
    });

    const { isDirty } = settingsForm.formState;

    const handleSubmit = async (data: FormSettingsValues) => {
        setIsLoading(true);
        try {
            const response = await axios.put(apiConstants.dashboard.settings(form.id), data);
            if (!response.data?.success) {
                showError(response.data?.message || 'Failed to save settings');
                return;
            }
            showSuccess('Settings saved successfully');
            settingsForm.reset(data);
            refetchForm?.();
        } catch (err: any) {
            console.error("Error saving form settings:", err);
            throw new Error(err.response?.data?.message || 'Failed to save settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnsavedAction = (save: boolean) => {
        if (save) {
            settingsForm.handleSubmit(handleSubmit)();
        } else {
            settingsForm.reset();
        }
    };

    return (
        <ScrollArea className="h">
            <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(handleSubmit)} className="mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {/* Left Column - Basic Information */}
                        <div className="md:col-span-4">
                            <CustomCard className="border-none outline-none">
                                <CustomCardHeader>
                                    <CustomCardTitle>Basic Information</CustomCardTitle>
                                </CustomCardHeader>
                                <CustomCardContent className="py-6">
                                    <div className="space-y-6 w-full">
                                        <FormField
                                            control={settingsForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Form Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Customer Feedback Survey" className="w-full" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={settingsForm.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Describe the purpose of this form..."
                                                            rows={3}
                                                            className="w-full resize-none"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Empty space for visual balance */}
                                        <div className="h-8"></div>
                                    </div>
                                </CustomCardContent>
                            </CustomCard>
                        </div>

                        {/* Right Column - Display & Theme Settings */}
                        <div className="md:col-span-8">
                            <CustomCard className="border-none outline-none">
                                <CustomCardHeader>
                                    <CustomCardTitle>Display Settings</CustomCardTitle>
                                </CustomCardHeader>
                                <CustomCardContent className="py-6">
                                    <div className="space-y-8 w-full">
                                        <FormField
                                            control={settingsForm.control}
                                            name="formPageType"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>Page Type</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            className="flex space-x-2"
                                                        >
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value={FormPageType.STEPPER} id="stepper" />
                                                                <Label htmlFor="stepper">Multi-Step (Stepper)</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value={FormPageType.SINGLE} id="single" />
                                                                <Label htmlFor="single">Single Page</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormDescription>
                                                        Choose how questions are displayed to respondents
                                                    </FormDescription>
                                                </FormItem>
                                            )}
                                        />

                                        <Separator />

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-base font-semibold">Theme</h3>
                                                <p className="text-sm text-muted-foreground">Customize the look and feel</p>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <FormField
                                                    control={settingsForm.control}
                                                    name="theme.primaryColor"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Primary</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="color"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                        className="w-10 h-10 rounded cursor-pointer border"
                                                                    />
                                                                    <Input {...field} className="flex-1" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={settingsForm.control}
                                                    name="theme.backgroundColor"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Background</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="color"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                        className="w-10 h-10 rounded cursor-pointer border"
                                                                    />
                                                                    <Input {...field} className="flex-1" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={settingsForm.control}
                                                    name="theme.textColor"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Text</FormLabel>
                                                            <FormControl>
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="color"
                                                                        value={field.value}
                                                                        onChange={field.onChange}
                                                                        className="w-10 h-10 rounded cursor-pointer border"
                                                                    />
                                                                    <Input {...field} className="flex-1" />
                                                                </div>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={settingsForm.control}
                                                    name="theme.buttonSize"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Button Size</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="sm">Small</SelectItem>
                                                                    <SelectItem value="md">Medium</SelectItem>
                                                                    <SelectItem value="lg">Large</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={settingsForm.control}
                                                    name="theme.buttonRadius"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Button Radius</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="none">None</SelectItem>
                                                                    <SelectItem value="sm">Small</SelectItem>
                                                                    <SelectItem value="md">Medium</SelectItem>
                                                                    <SelectItem value="lg">Large</SelectItem>
                                                                    <SelectItem value="full">Full (Pill)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Theme Preview */}
                                            <div className="mt-6 p-6 border rounded-lg">
                                                <p className="text-sm font-medium mb-4">Preview</p>
                                                <div
                                                    className="p-6 rounded-lg space-y-4"
                                                    style={{
                                                        backgroundColor: settingsForm.watch("theme.backgroundColor"),
                                                        color: settingsForm.watch("theme.textColor"),
                                                    }}
                                                >
                                                    <p>Sample question text</p>
                                                    <PreviewButton
                                                        type="button"
                                                        size={
                                                            settingsForm.watch("theme.buttonSize") === "sm"
                                                                ? "sm"
                                                                : settingsForm.watch("theme.buttonSize") === "lg"
                                                                    ? "lg"
                                                                    : "default"
                                                        }
                                                        style={{
                                                            backgroundColor: settingsForm.watch("theme.primaryColor"),
                                                            borderRadius:
                                                                settingsForm.watch("theme.buttonRadius") === "none"
                                                                    ? "0"
                                                                    : settingsForm.watch("theme.buttonRadius") === "sm"
                                                                        ? "0.25rem"
                                                                        : settingsForm.watch("theme.buttonRadius") === "md"
                                                                            ? "0.5rem"
                                                                            : settingsForm.watch("theme.buttonRadius") === "lg"
                                                                                ? "0.75rem"
                                                                                : "9999px",
                                                        }}
                                                    >
                                                        Sample Button
                                                    </PreviewButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CustomCardContent>
                            </CustomCard>
                        </div>
                    </div>
                </form>
            </Form>

            <UnsavedChangesBar
                hasChanges={isDirty}
                onAction={handleUnsavedAction}
                isLoading={isLoading}
            />
        </ScrollArea>
    );
}