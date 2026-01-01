"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { UnsavedChangesBar } from "@/components/shared/unsavedChangesBar";
import { FormPageType, FormType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

// Theme configuration schema
const themeConfigSchema = z.object({
    primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"),
    buttonSize: z.enum(["sm", "md", "lg"]),
    buttonRadius: z.enum(["none", "sm", "md", "lg", "full"]),
    fontFamily: z.string().optional(),
});

// Main form settings schema
const formSettingsSchema = z.object({
    name: z.string().min(1, "Form name is required").min(3, "Form name must be at least 3 characters"),
    description: z.string().optional(),
    type: z.nativeEnum(FormType),
    logoUrl: z.string().optional(),
    formPageType: z.nativeEnum(FormPageType),
    uniqueSubdomain: z.string().optional(),
    customDomain: z.string().optional(),
    maxResponses: z.number().nullable().optional(),
    openAt: z.date().nullable().optional(),
    closeAt: z.date().nullable().optional(),
    requireConsent: z.boolean(),
    allowAnonymous: z.boolean(),
    multipleSubmissions: z.boolean(),
    analyticsEnabled: z.boolean(),
    theme: themeConfigSchema,
});

type FormSettingsValues = z.infer<typeof formSettingsSchema>;
type ThemeConfig = z.infer<typeof themeConfigSchema>;

interface FormSettingsProps {
    formId?: string;
    initialData?: Partial<FormSettingsValues>;
    onSave?: (data: FormSettingsValues) => Promise<void>;
}

const defaultTheme: ThemeConfig = {
    primaryColor: "#6366f1",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    buttonSize: "md",
    buttonRadius: "md",
    fontFamily: "Inter",
};

const defaultValues: FormSettingsValues = {
    name: "",
    description: "",
    type: FormType.REACH_OUT,
    logoUrl: "",
    formPageType: FormPageType.STEPPER,
    uniqueSubdomain: "",
    customDomain: "",
    maxResponses: null,
    openAt: null,
    closeAt: null,
    requireConsent: false,
    allowAnonymous: true,
    multipleSubmissions: false,
    analyticsEnabled: true,
    theme: defaultTheme,
};

export default function FormSettings({ formId, initialData, onSave }: FormSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormSettingsValues>({
        resolver: zodResolver(formSettingsSchema),
        defaultValues: { ...defaultValues, ...initialData },
    });

    const { isDirty } = form.formState;

    // Parse theme from string if provided as JSON
    useEffect(() => {
        if (initialData?.theme && typeof initialData.theme === "string") {
            try {
                const parsedTheme = JSON.parse(initialData.theme as unknown as string);
                form.setValue("theme", { ...defaultTheme, ...parsedTheme });
            } catch {
                form.setValue("theme", defaultTheme);
            }
        }
        if (initialData?.logoUrl) {
            setLogoPreview(initialData.logoUrl);
        }
    }, [initialData, form]);

    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogoPreview(result);
                form.setValue("logoUrl", result, { shouldDirty: true });
            };
            reader.readAsDataURL(file);
        }
    }, [form]);

    const handleRemoveLogo = useCallback(() => {
        setLogoPreview(null);
        form.setValue("logoUrl", "", { shouldDirty: true });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [form]);

    const handleSubmit = async (data: FormSettingsValues) => {
        setIsLoading(true);
        try {
            if (onSave) {
                await onSave(data);
            }
            // Reset form state to mark as saved
            form.reset(data);
        } catch (err) {
            console.error("Error saving form settings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnsavedAction = (save: boolean) => {
        if (save) {
            form.handleSubmit(handleSubmit)();
        } else {
            form.reset();
            setLogoPreview(initialData?.logoUrl || null);
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-20">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>
                                Configure the basic details of your form
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-6">
                                {/* Logo Upload */}
                                <div className="flex flex-col items-center gap-2">
                                    <div className="relative w-[120px] h-[120px] border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                        {logoPreview ? (
                                            <>
                                                <Image
                                                    src={logoPreview}
                                                    alt="Form Logo"
                                                    fill
                                                    className="object-contain"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-8 w-8"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="destructive"
                                                        className="h-8 w-8"
                                                        onClick={handleRemoveLogo}
                                                    >
                                                        <Trash2Icon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="h-full w-full flex flex-col gap-2"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">Upload Logo</span>
                                            </Button>
                                        )}
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </div>

                                {/* Form Name and Type */}
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Form Name</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            placeholder="e.g. Customer Feedback Survey"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {/* <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Form Type</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select form type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value={FormType.REACH_OUT}>Reach Out</SelectItem>
                                                            <SelectItem value={FormType.EMBEDDED}>Embedded</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        /> */}
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        {...field}
                                                        placeholder="Describe the purpose of this form..."
                                                        rows={3}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Display Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Display Settings</CardTitle>
                            <CardDescription>
                                Configure how your form is displayed to users
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="formPageType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Page Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select page type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={FormPageType.STEPPER}>Multi-Step (Stepper)</SelectItem>
                                                    <SelectItem value={FormPageType.SINGLE}>Single Page</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Choose how questions are displayed to respondents
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxResponses"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Max Responses</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Unlimited"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Leave empty for unlimited responses
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="uniqueSubdomain"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subdomain</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <Input
                                                        {...field}
                                                        placeholder="my-form"
                                                        className="rounded-r-none"
                                                    />
                                                    <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-sm text-muted-foreground">
                                                        .escapeform.io
                                                    </span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="customDomain"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Custom Domain</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="forms.yourdomain.com"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Theme Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme Configuration</CardTitle>
                            <CardDescription>
                                Customize the look and feel of your form
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="theme.primaryColor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Primary Color</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                                    />
                                                    <Input
                                                        {...field}
                                                        placeholder="#6366f1"
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="theme.backgroundColor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Background Color</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                                    />
                                                    <Input
                                                        {...field}
                                                        placeholder="#ffffff"
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="theme.textColor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Text Color</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="color"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className="w-10 h-10 rounded cursor-pointer border-0"
                                                    />
                                                    <Input
                                                        {...field}
                                                        placeholder="#1f2937"
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="theme.buttonSize"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Size</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select size" />
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
                                    control={form.control}
                                    name="theme.buttonRadius"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Button Radius</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select radius" />
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
                                <FormField
                                    control={form.control}
                                    name="theme.fontFamily"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Font Family</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select font" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Inter">Inter</SelectItem>
                                                    <SelectItem value="Roboto">Roboto</SelectItem>
                                                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                                                    <SelectItem value="Lato">Lato</SelectItem>
                                                    <SelectItem value="Poppins">Poppins</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Theme Preview */}
                            <div className="mt-4 p-4 border rounded-lg">
                                <p className="text-sm text-muted-foreground mb-2">Preview</p>
                                <div
                                    className="p-4 rounded-lg"
                                    style={{
                                        backgroundColor: form.watch("theme.backgroundColor"),
                                        color: form.watch("theme.textColor"),
                                        fontFamily: form.watch("theme.fontFamily"),
                                    }}
                                >
                                    <p className="mb-2">Sample question text</p>
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-white transition-colors"
                                        style={{
                                            backgroundColor: form.watch("theme.primaryColor"),
                                            borderRadius:
                                                form.watch("theme.buttonRadius") === "none" ? "0" :
                                                    form.watch("theme.buttonRadius") === "sm" ? "0.25rem" :
                                                        form.watch("theme.buttonRadius") === "md" ? "0.5rem" :
                                                            form.watch("theme.buttonRadius") === "lg" ? "0.75rem" : "9999px",
                                            padding:
                                                form.watch("theme.buttonSize") === "sm" ? "0.25rem 0.75rem" :
                                                    form.watch("theme.buttonSize") === "lg" ? "0.75rem 1.5rem" : "0.5rem 1rem",
                                        }}
                                    >
                                        Sample Button
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Behavior */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Behavior</CardTitle>
                            <CardDescription>
                                Control how your form behaves for respondents
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="allowAnonymous"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Allow Anonymous Responses</FormLabel>
                                            <FormDescription>
                                                Allow users to submit responses without being signed in
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="multipleSubmissions"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Allow Multiple Submissions</FormLabel>
                                            <FormDescription>
                                                Allow the same user to submit multiple responses
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="requireConsent"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Require Consent</FormLabel>
                                            <FormDescription>
                                                Require users to accept terms before submitting
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="analyticsEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Enable Analytics</FormLabel>
                                            <FormDescription>
                                                Track form views, submissions, and completion rates
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </form>
            </Form>

            <UnsavedChangesBar
                hasChanges={isDirty}
                onAction={handleUnsavedAction}
                isLoading={isLoading}
            />
        </>
    );
}