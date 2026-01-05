"use client";
import { useState, useEffect } from "react";
import { Form as FormType } from "@prisma/client";
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from "@/components/ui/custom-card";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { CustomDialog, CustomDialogContent, CustomDialogHeader, CustomDialogTitle, CustomDialogFooter, CustomDialogTrigger, CustomDialogBody, CustomDialogDescription } from "@/components/ui/custom-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { PlusIcon, TrashIcon, EyeIcon, EyeOffIcon, KeyIcon, Trash2Icon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/datePicker";
import { AnimatePresence, motion } from "framer-motion";
import { UnsavedChangesBar } from "@/components/shared/unsavedChangesBar";
import axios from "@/lib/axios";
import { apiConstants } from "@/constants/api.constants";
import { showError, showSuccess } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const passwordEntrySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    expireAt: z.string().optional(),
    usableUpto: z.number().min(1, "Must be at least 1"),
    isValid: z.boolean(),
});
type PasswordEntry = z.infer<typeof passwordEntrySchema>;

const securitySettingsSchema = z.object({
    maxResponses: z.number().min(1).optional(),
    openAt: z.string().optional(),
    closeAt: z.string().optional(),
    requireConsent: z.boolean(),
    allowAnonymous: z.boolean(),
    multipleSubmissions: z.boolean(),
    passwordProtected: z.boolean(),
});

type SecuritySettingsValues = z.infer<typeof securitySettingsSchema>;

interface FormSecurityProps {
    form: FormType;
}

function PasswordModal({
    open,
    onClose,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    onSave: (entry: PasswordEntry) => void;
}) {
    const form = useForm<PasswordEntry>({
        resolver: zodResolver(passwordEntrySchema),
        defaultValues: {
            name: "",
            password: "",
            expireAt: "",
            usableUpto: 1,
            isValid: true,
        },
    });

    const { isSubmitting } = form.formState;
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data: PasswordEntry) => {
        onSave(data);
        form.reset();
        onClose();
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <CustomDialog open={open} onOpenChange={handleClose}>
            <CustomDialogContent className="sm:max-w-[425px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CustomDialogHeader>
                            <CustomDialogTitle>Create New Password</CustomDialogTitle>
                        </CustomDialogHeader>
                        <CustomDialogBody>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="required">Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter password name"
                                                className="bg-muted! dark:bg-input!"
                                                {...field}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="required">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter password"
                                                    type={showPassword ? "text" : "password"}
                                                    className="bg-muted! dark:bg-input! pr-10"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                                    onClick={() => setShowPassword((v) => !v)}
                                                >
                                                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="expireAt"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Expire At</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value ? new Date(field.value) : undefined}
                                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : "")}
                                                placeholder="Select expiration date"
                                                dateFormat="yyyy-MM-dd"
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="usableUpto"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel className="required">Usable Up To</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                placeholder="Enter number"
                                                className="bg-muted! dark:bg-input!"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CustomDialogBody>
                        <CustomDialogFooter className="px-5 pb-4 pt-3">
                            <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" loading={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save Password"}
                            </Button>
                        </CustomDialogFooter>
                    </form>
                </Form>
            </CustomDialogContent>
        </CustomDialog>
    );
}

export default function FormSecurity({ form }: FormSecurityProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [activePasswords, setActivePasswords] = useState<PasswordEntry[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const securityForm = useForm<SecuritySettingsValues>({
        resolver: zodResolver(securitySettingsSchema),
        defaultValues: {
            maxResponses: form.maxResponses ?? undefined,
            openAt: form.openAt ? new Date(form.openAt).toISOString().slice(0, 16) : "",
            closeAt: form.closeAt ? new Date(form.closeAt).toISOString().slice(0, 16) : "",
            requireConsent: form.requireConsent ?? false,
            allowAnonymous: form.allowAnonymous ?? false,
            multipleSubmissions: form.multipleSubmissions ?? false,
            passwordProtected: form.passwordProtected ?? false,
        },
    });

    const { isDirty } = securityForm.formState;

    const getDateFromDateTime = (dateTime: string) => dateTime ? new Date(dateTime.split('T')[0]) : undefined;
    const getTimeFromDateTime = (dateTime: string) => dateTime ? dateTime.split('T')[1] || "" : "";
    const combineDateTime = (date: Date | undefined, time: string) => {
        if (!date) return "";
        const dateStr = date.toISOString().split('T')[0];
        return time ? `${dateStr}T${time}` : dateStr + "T00:00";
    };

    useEffect(() => {
        if (securityForm.watch('passwordProtected')) {
            fetchActivePasswords();
        } else {
            setActivePasswords([]);
        }
    }, [securityForm.watch('passwordProtected'), form.id]);

    useEffect(() => {
        if (securityForm.watch('allowAnonymous')) {
            securityForm.setValue('passwordProtected', false);
        }
    }, [securityForm.watch('allowAnonymous')]);
    useEffect(() => {
        if (securityForm.watch('passwordProtected')) {
            securityForm.setValue('allowAnonymous', false);
        }
    }, [securityForm.watch('passwordProtected')]);

    const handleSubmit = async (data: SecuritySettingsValues) => {
        setIsLoading(true);
        try {
            const response = await axios.put(apiConstants.dashboard.security(form.id), data);
            if (!response.data?.success) {
                showError(response.data?.message || 'Failed to save security settings');
                return;
            }
            showSuccess('Security settings saved successfully');
            securityForm.reset(data);
        } catch (err: any) {
            console.error("Error saving security settings:", err);
            showError(err.response?.data?.message || 'Failed to save security settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnsavedAction = (save: boolean) => {
        if (save) {
            securityForm.handleSubmit(handleSubmit)();
        } else {
            securityForm.reset();
        }
    };

    const handleAddPassword = async (entry: PasswordEntry) => {
        try {
            const response = await axios.post(apiConstants.dashboard.security(form.id) + '/passwords', entry);
            if (!response.data?.success) {
                showError(response.data?.message || 'Failed to create password');
                return;
            }
            showSuccess('Password created successfully');
            await fetchActivePasswords();
        } catch (err: any) {
            console.error("Error creating password:", err);
            showError(err.response?.data?.message || 'Failed to create password');
        }
    };
    const handleRemovePassword = async (id?: string) => {
        if (!id) return;
        try {
            const response = await axios.delete(apiConstants.dashboard.security(form.id) + `/passwords/${id}`);
            if (!response.data?.success) {
                showError(response.data?.message || 'Failed to delete password');
                return;
            }
            showSuccess('Password deleted successfully');
            await fetchActivePasswords();
        } catch (err: any) {
            console.error("Error deleting password:", err);
            showError(err.response?.data?.message || 'Failed to delete password');
        }
    };

    const fetchActivePasswords = async () => {
        try {
            const response = await axios.get(apiConstants.dashboard.security(form.id) + '/passwords');
            if (response.data?.success) {
                setActivePasswords(response.data.data || []);
            }
        } catch (err: any) {
            console.error("Error fetching passwords:", err);
            showError(err.response?.data?.message || 'Failed to fetch passwords');
        }
    };

    return (
        <Form {...securityForm}>
            <ScrollArea className="h-full">
                <div className="grid grid-cols-12 gap-6">
                    <div className="space-y-6 col-span-12 md:col-span-4">
                        <CustomCard className="outline-none">
                            <CustomCardHeader>
                                <CustomCardTitle>Submission Limits</CustomCardTitle>
                            </CustomCardHeader>
                            <CustomCardContent className="space-y-4 w-full">
                                <div className="flex items-center justify-between w-full">
                                    <Label>Max Responses</Label>
                                    <FormField
                                        control={securityForm.control}
                                        name="maxResponses"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-y-0">
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        className="w-32"
                                                        value={field.value ?? ""}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                        placeholder="Unlimited"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <Label>Multiple Submissions</Label>
                                    <FormField
                                        control={securityForm.control}
                                        name="multipleSubmissions"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-y-0">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CustomCardContent>
                        </CustomCard>

                        <CustomCard className="outline-none">
                            <CustomCardHeader>
                                <CustomCardTitle>Availability</CustomCardTitle>
                            </CustomCardHeader>
                            <CustomCardContent className="space-y-4">
                                <div className="flex items-center justify-between w-full">
                                    <Label>Open At</Label>
                                    <div className="flex gap-2 items-center">
                                        <DatePicker
                                            value={getDateFromDateTime(securityForm.watch('openAt') || "")}
                                            onChange={(date) => securityForm.setValue('openAt', combineDateTime(date, getTimeFromDateTime(securityForm.watch('openAt') || "")))}
                                            placeholder="Select date"
                                            dateFormat="yyyy-MM-dd"
                                            className="w-40"
                                        />
                                        <Input
                                            type="time"
                                            className="w-32"
                                            value={getTimeFromDateTime(securityForm.watch('openAt') || "")}
                                            onChange={(e) => securityForm.setValue('openAt', combineDateTime(getDateFromDateTime(securityForm.watch('openAt') || ""), e.target.value))}
                                        />
                                        <AnimatePresence>
                                            {securityForm.watch('openAt') && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Button size={'icon'} variant={'outline'} onClick={() => securityForm.setValue('openAt', "")}>
                                                        <Trash2Icon className="h-4 w-4" />
                                                        <span className="sr-only">Clear</span>
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <Label>Close At</Label>
                                    <div className="flex gap-2 items-center">
                                        <DatePicker
                                            value={getDateFromDateTime(securityForm.watch('closeAt') || "")}
                                            onChange={(date) => securityForm.setValue('closeAt', combineDateTime(date, getTimeFromDateTime(securityForm.watch('closeAt') || "")))}
                                            placeholder="Select date"
                                            dateFormat="yyyy-MM-dd"
                                            className="w-40"
                                        />
                                        <Input
                                            type="time"
                                            className="w-32"
                                            value={getTimeFromDateTime(securityForm.watch('closeAt') || "")}
                                            onChange={(e) => securityForm.setValue('closeAt', combineDateTime(getDateFromDateTime(securityForm.watch('closeAt') || ""), e.target.value))}
                                        />
                                        <AnimatePresence>
                                            {securityForm.watch('closeAt') && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <Button size={'icon'} variant={'outline'} onClick={() => securityForm.setValue('closeAt', "")}>
                                                        <Trash2Icon className="h-4 w-4" />
                                                        <span className="sr-only">Clear</span>
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </CustomCardContent>
                        </CustomCard>
                    </div>
                    {/* Column 2: col-span-8 */}
                    <div className="space-y-6 col-span-12 md:col-span-8">
                        {/* Access Control */}
                        <CustomCard className="outline-none">
                            <CustomCardHeader>
                                <CustomCardTitle>Consent & Access Control</CustomCardTitle>
                            </CustomCardHeader>
                            <CustomCardContent className="space-y-4 w-full">
                                <FormField
                                    control={securityForm.control}
                                    name="requireConsent"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between w-full space-y-0 gap-4">
                                            <FormLabel htmlFor="reqConsent" className="flex-1">Require Consent</FormLabel>
                                            <FormControl>
                                                <Switch id="reqConsent" checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={securityForm.control}
                                    name="allowAnonymous"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between w-full space-y-0 gap-4">
                                            <FormLabel htmlFor="allowAnonymous" className="flex-1">Allow Anonymous Responses</FormLabel>
                                            <FormControl>
                                                <Switch id="allowAnonymous" checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={securityForm.control}
                                    name="passwordProtected"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between w-full space-y-0 gap-4">
                                            <FormLabel htmlFor="passwordProtected" className="flex-1">Password Protected</FormLabel>
                                            <FormControl>
                                                <Switch id="passwordProtected" checked={field.value} onCheckedChange={field.onChange} disabled={securityForm.watch('allowAnonymous')} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {securityForm.watch('passwordProtected') && (
                                    <div className="mt-4 w-full">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">Active Passwords</span>
                                            <Button size="sm" variant="outline" onClick={() => setShowPasswordModal(true)}>
                                                <PlusIcon className="h-4 w-4 mr-1" /> Add Password
                                            </Button>
                                        </div>
                                        {activePasswords.length === 0 ? (
                                            <div className="text-muted-foreground text-sm py-4 flex items-center gap-2">
                                                <KeyIcon className="h-5 w-5" /> No passwords set.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {activePasswords.map((p) => (
                                                    <div key={p.id} className="flex items-center gap-3 border rounded-lg p-2">
                                                        <div className="flex-1">
                                                            <div className="font-medium">{p.name}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                Expires: {p.expireAt || "Never"} | Usable up to: {p.usableUpto}
                                                            </div>
                                                        </div>
                                                        <Badge variant={p.isValid ? "default" : "secondary"}>
                                                            {p.isValid ? "Active" : "Inactive"}
                                                        </Badge>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-destructive"
                                                            onClick={() => handleRemovePassword(p.id)}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CustomCardContent>
                        </CustomCard>
                    </div>
                    {/* Password Modal */}
                    <PasswordModal
                        open={showPasswordModal}
                        onClose={() => setShowPasswordModal(false)}
                        onSave={handleAddPassword}
                    />
                </div>
                <UnsavedChangesBar
                    hasChanges={isDirty}
                    onAction={handleUnsavedAction}
                    isLoading={isLoading}
                    saveLabel="Save Settings"
                    discardLabel="Discard Changes"
                    message="You have unsaved changes in security settings."
                />
            </ScrollArea >
        </Form>
    );
}