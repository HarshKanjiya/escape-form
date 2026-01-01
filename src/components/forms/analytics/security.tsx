"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UnsavedChangesBar } from "@/components/shared/unsavedChangesBar";
import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon, EyeIcon, EyeOffIcon, KeyIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import z from "zod";
import { Badge } from "@/components/ui/badge";

// Password entry schema
const passwordEntrySchema = z.object({
    id: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    expireAt: z.string().optional(),
    isValid: z.boolean(),
});

// Security settings schema
const securitySettingsSchema = z.object({
    passwordProtected: z.boolean(),
    passwords: z.array(passwordEntrySchema),
    ipRestriction: z.boolean(),
    allowedIps: z.string().optional(),
    rateLimitEnabled: z.boolean(),
    rateLimitMaxRequests: z.number().min(1),
    rateLimitWindowMinutes: z.number().min(1),
    captchaEnabled: z.boolean(),
    captchaType: z.enum(["recaptcha", "hcaptcha", "turnstile"]).optional(),
    honeypotEnabled: z.boolean(),
});

type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;
type PasswordEntry = z.infer<typeof passwordEntrySchema>;

interface FormSecurityProps {
    formId?: string;
    initialData?: Partial<SecuritySettingsValues>;
    onSave?: (data: SecuritySettingsValues) => Promise<void>;
}

const defaultValues: SecuritySettingsValues = {
    passwordProtected: false,
    passwords: [],
    ipRestriction: false,
    allowedIps: "",
    rateLimitEnabled: false,
    rateLimitMaxRequests: 100,
    rateLimitWindowMinutes: 60,
    captchaEnabled: false,
    captchaType: undefined,
    honeypotEnabled: true,
};

function generatePassword(length: number = 12): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

export default function FormSecurity({ formId, initialData, onSave }: FormSecurityProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

    const form = useForm<SecuritySettingsValues>({
        resolver: zodResolver(securitySettingsSchema),
        defaultValues: { ...defaultValues, ...initialData },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "passwords",
    });

    const { isDirty } = form.formState;
    const passwordProtected = form.watch("passwordProtected");
    const ipRestriction = form.watch("ipRestriction");
    const rateLimitEnabled = form.watch("rateLimitEnabled");
    const captchaEnabled = form.watch("captchaEnabled");

    const togglePasswordVisibility = useCallback((index: number) => {
        setVisiblePasswords(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    }, []);

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    }, []);

    const handleAddPassword = useCallback(() => {
        const newPassword = generatePassword();
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 30); // 30 days from now
        
        append({
            password: newPassword,
            expireAt: expireDate.toISOString().split('T')[0],
            isValid: true,
        });
    }, [append]);

    const handleSubmit = async (data: SecuritySettingsValues) => {
        setIsLoading(true);
        try {
            if (onSave) {
                await onSave(data);
            }
            form.reset(data);
        } catch (err) {
            console.error("Error saving security settings:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnsavedAction = (save: boolean) => {
        if (save) {
            form.handleSubmit(handleSubmit)();
        } else {
            form.reset();
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 pb-20">
                    {/* Password Protection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <KeyIcon className="h-5 w-5" />
                                Password Protection
                            </CardTitle>
                            <CardDescription>
                                Require a password to access your form
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="passwordProtected"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Enable Password Protection</FormLabel>
                                            <FormDescription>
                                                Users will need to enter a password to view the form
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

                            {passwordProtected && (
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium">Active Passwords</h4>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddPassword}
                                        >
                                            <PlusIcon className="h-4 w-4 mr-2" />
                                            Generate Password
                                        </Button>
                                    </div>

                                    {fields.length === 0 ? (
                                        <div className="text-center py-8 border rounded-lg border-dashed">
                                            <KeyIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                No passwords created yet
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={handleAddPassword}
                                            >
                                                Create First Password
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {fields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="flex items-center gap-3 p-3 border rounded-lg"
                                                >
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`passwords.${index}.password`}
                                                                render={({ field: passwordField }) => (
                                                                    <FormItem className="flex-1">
                                                                        <FormControl>
                                                                            <div className="relative">
                                                                                <Input
                                                                                    {...passwordField}
                                                                                    type={visiblePasswords.has(index) ? "text" : "password"}
                                                                                    placeholder="Password"
                                                                                    className="pr-20"
                                                                                />
                                                                                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="h-7 w-7"
                                                                                        onClick={() => togglePasswordVisibility(index)}
                                                                                    >
                                                                                        {visiblePasswords.has(index) ? (
                                                                                            <EyeOffIcon className="h-4 w-4" />
                                                                                        ) : (
                                                                                            <EyeIcon className="h-4 w-4" />
                                                                                        )}
                                                                                    </Button>
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        className="h-7 w-7"
                                                                                        onClick={() => copyToClipboard(passwordField.value)}
                                                                                    >
                                                                                        <CopyIcon className="h-4 w-4" />
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <FormField
                                                                control={form.control}
                                                                name={`passwords.${index}.expireAt`}
                                                                render={({ field: expireField }) => (
                                                                    <FormItem className="flex-1">
                                                                        <FormControl>
                                                                            <Input
                                                                                {...expireField}
                                                                                type="date"
                                                                                className="w-auto"
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name={`passwords.${index}.isValid`}
                                                                render={({ field: validField }) => (
                                                                    <FormItem className="flex items-center gap-2">
                                                                        <FormControl>
                                                                            <Switch
                                                                                checked={validField.value}
                                                                                onCheckedChange={validField.onChange}
                                                                            />
                                                                        </FormControl>
                                                                        <Badge variant={validField.value ? "default" : "secondary"}>
                                                                            {validField.value ? "Active" : "Inactive"}
                                                                        </Badge>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Access Control */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Access Control</CardTitle>
                            <CardDescription>
                                Restrict who can access your form
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="ipRestriction"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">IP Restriction</FormLabel>
                                            <FormDescription>
                                                Only allow access from specific IP addresses
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

                            {ipRestriction && (
                                <FormField
                                    control={form.control}
                                    name="allowedIps"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Allowed IP Addresses</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="192.168.1.1, 10.0.0.0/24"
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Comma-separated list of IP addresses or CIDR ranges
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Rate Limiting */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Rate Limiting</CardTitle>
                            <CardDescription>
                                Prevent abuse by limiting submission frequency
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="rateLimitEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Enable Rate Limiting</FormLabel>
                                            <FormDescription>
                                                Limit the number of submissions per time window
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

                            {rateLimitEnabled && (
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="rateLimitMaxRequests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Max Requests</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Maximum submissions allowed
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="rateLimitWindowMinutes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time Window (minutes)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Reset period in minutes
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Bot Protection */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Bot Protection</CardTitle>
                            <CardDescription>
                                Prevent automated spam submissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="honeypotEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Honeypot Protection</FormLabel>
                                            <FormDescription>
                                                Add invisible fields to catch bots (recommended)
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
                                name="captchaEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">CAPTCHA</FormLabel>
                                            <FormDescription>
                                                Require users to complete a challenge
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

                            {captchaEnabled && (
                                <FormField
                                    control={form.control}
                                    name="captchaType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CAPTCHA Provider</FormLabel>
                                            <FormControl>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {[
                                                        { value: "recaptcha", label: "reCAPTCHA" },
                                                        { value: "hcaptcha", label: "hCaptcha" },
                                                        { value: "turnstile", label: "Cloudflare Turnstile" },
                                                    ].map((option) => (
                                                        <Button
                                                            key={option.value}
                                                            type="button"
                                                            variant={field.value === option.value ? "default" : "outline"}
                                                            className="w-full"
                                                            onClick={() => field.onChange(option.value)}
                                                        >
                                                            {option.label}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
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