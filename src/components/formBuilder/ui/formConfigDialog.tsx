"use client";

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFormBuilder } from '@/store/useFormBuilder';
import { FormUpdate } from '@/types/db';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart2, ChevronDown, Clock, Eye, EyeOff, ImagePlus, Lock, MonitorSmartphone, Replace, Settings, Shield, Trash2, Users2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import z from 'zod';


const formSettingsSchema = z.object({
    name: z.string().min(1, 'Name is required').max(80, 'Max 80 characters'),
    description: z.string().max(240, 'Max 240 characters').optional().or(z.literal('')),
    logo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    analytics_enabled: z.boolean(),
    welcome_screen_enabled: z.boolean(),
    welcome_screen: z.string().max(500, 'Too long').optional().or(z.literal('')),
    thank_you_screen_enabled: z.boolean(),
    thank_you_screen: z.string().max(500, 'Too long').optional().or(z.literal('')),
    time_bound: z.boolean(),
    open_at: z.string().optional().or(z.literal('')),
    close_at: z.string().optional().or(z.literal('')),
    multiple_submissions: z.boolean(),
    allow_anonymous: z.boolean(),
    password_protected: z.boolean(),
    password: z.string().min(6, 'Password too short').max(64, 'Password too long').optional(),
    require_consent: z.boolean(),
});

type FormSettingsData = z.infer<typeof formSettingsSchema>;
type FormSettingsForm = UseFormReturn<FormSettingsData>;


export default function FormConfigDialog() {

    const { dataSource, updateForm } = useFormBuilder();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSettingsSchema),
        defaultValues: {
            name: dataSource?.name || '',
            description: dataSource?.description || '',
            logo_url: dataSource?.logo_url || '',
            thank_you_screen_enabled: !!dataSource?.thank_you_screen,
            thank_you_screen: typeof dataSource?.thank_you_screen === 'string' ? dataSource?.thank_you_screen : '',
            welcome_screen_enabled: !!dataSource?.welcome_screen,
            welcome_screen: typeof dataSource?.welcome_screen === 'string' ? dataSource?.welcome_screen : '',
            analytics_enabled: !!dataSource?.analytics_enabled,
            time_bound: !!(dataSource?.open_at || dataSource?.close_at),
            open_at: dataSource?.open_at || '',
            close_at: dataSource?.close_at || '',
            multiple_submissions: !!dataSource?.multiple_submissions,
            allow_anonymous: !!dataSource?.allow_anonymous,
            password_protected: !!dataSource?.password_protected,
            password: '',
            require_consent: !!dataSource?.require_consent,
        }
    });

    const { watch, handleSubmit, reset, formState: { isSubmitting } } = form;
    const watchTimeBound = watch('time_bound');
    const watchPasswordProtected = watch('password_protected');

    return (
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { reset(); } }}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label='Edit Settings'><Settings /></Button>
            </DialogTrigger>
            <DialogContent className='md:min-w-[720px] max-h-[85vh] flex flex-col p-0 overflow-hidden'>
                <DialogHeader className='px-4 py-3 border-b bg-background'>
                    <DialogTitle className='text-lg font-semibold'>Form Settings</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id='form-settings' className='space-y-4 overflow-y-auto px-6 pt-6 pb-6 custom-scrollbar' onSubmit={handleSubmit(async (values) => {
                        let hasError = false;
                        if (values.time_bound) {
                            if (!values.open_at) { form.setError('open_at', { message: 'Open date required' }); hasError = true; }
                            if (!values.close_at) { form.setError('close_at', { message: 'Close date required' }); hasError = true; }
                        }
                        if (values.password_protected && !values.password) {
                            form.setError('password', { message: 'Password required' });
                            hasError = true;
                        }
                        if (hasError) return;
                        // Prepare update payload
                        const update: Partial<FormUpdate> = {
                            name: values.name,
                            description: values.description || null,
                            logo_url: values.logo_url || null,
                            thank_you_screen: values.thank_you_screen_enabled ? values.thank_you_screen || '' : null,
                            welcome_screen: values.welcome_screen_enabled ? values.welcome_screen || '' : null,
                            open_at: values.time_bound ? values.open_at || null : null,
                            close_at: values.time_bound ? values.close_at || null : null,
                            multiple_submissions: values.multiple_submissions,
                            password_protected: values.password_protected,
                            require_consent: values.require_consent,
                            analytics_enabled: values.analytics_enabled,
                            allow_anonymous: values.allow_anonymous,
                        };
                        // TODO: handle password hashing externally if needed
                        updateForm(update);
                        setDialogOpen(false);
                    })}>
                        {/* Row: Logo upload (drag/drop) on left, Name & Description stacked on right */}
                        <div className='flex flex-col md:flex-row gap-8'>
                            <FormField control={form.control} name='logo_url' render={({ field }) => (
                                <FormItem className='flex flex-col'>
                                    <FormLabel>Logo</FormLabel>
                                    <FormControl>
                                        <div
                                            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; if (!dragActive) setDragActive(true); }}
                                            onDragLeave={(e) => { if (e.currentTarget === e.target) setDragActive(false); }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files?.[0];
                                                if (file && file.type.startsWith('image/')) {
                                                    const url = URL.createObjectURL(file);
                                                    field.onChange(url);
                                                }
                                                setDragActive(false);
                                            }}
                                            className={cn('relative group border rounded-xl w-[120px] h-[120px] flex flex-col items-center justify-center gap-2 text-center p-3 cursor-pointer transition-all overflow-hidden',
                                                dragActive ? 'border-primary/80 ring-2 ring-primary/30 bg-primary/5 scale-[1.01]' : 'hover:border-primary/60 hover:bg-muted/40',
                                                field.value ? 'bg-muted backdrop-blur-sm' : 'bg-background'
                                            )}
                                        >
                                            <input
                                                type='file'
                                                accept='image/*'
                                                className='hidden'
                                                id='logoUploadInput'
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file && file.type.startsWith('image/')) {
                                                        const url = URL.createObjectURL(file);
                                                        field.onChange(url);
                                                    }
                                                }}
                                            />
                                            {field.value ? (
                                                <div className='w-full h-full relative'>
                                                    <img src={field.value} alt='Logo preview' className='object-cover w-full h-full rounded-lg transition-all group-hover:brightness-90' />
                                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex flex-col items-center justify-end gap-2  text-xs text-white transition-opacity'>
                                                        <div className='flex w-full gap-2 py-2 items-center justify-center'>
                                                            <Button type='button' size='icon' variant='secondary' onClick={() => document.getElementById('logoUploadInput')?.click()}>
                                                                <Replace />
                                                            </Button>
                                                            <Button type='button' size='icon' variant='destructive' onClick={() => field.onChange('')}>
                                                                <Trash2 />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className='flex flex-col items-center justify-center text-muted-foreground text-sm h-full w-full'
                                                    onClick={() => document.getElementById('logoUploadInput')?.click()}
                                                >
                                                    <ImagePlus className='h-6 w-6 mb-1 text-muted-foreground/70' />
                                                    <span className='font-medium'>Upload</span>
                                                    <span className='text-[10px] text-muted-foreground/60 mt-1'>Drag & drop</span>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className='flex-1 flex flex-col md:pt-1'>
                                <FormField control={form.control} name='name' render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name *</FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input placeholder='Form name' {...field} className='pr-14' />
                                                <span className='pointer-events-none select-none absolute top-1/2 -translate-y-1/2 right-2 text-xs text-muted-foreground/60'>{(field.value || '').length}/80</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='description' render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Textarea maxLength={240} placeholder='Short description' {...field} className='pr-16' />
                                                <span className='pointer-events-none select-none absolute top-5 -translate-y-1/2 right-2 text-xs text-muted-foreground/60'>{(field.value || '').length}/240</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className='rounded-xl border border-accent p-4 md:p-5 space-y-4  to-muted/40 bg-background'>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='flex gap-3'>
                                    <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary'><BarChart2 className='h-4 w-4' /></div>
                                    <div>
                                        <h3 className='font-medium'>Analytics</h3>
                                        <p className='text-sm text-muted-foreground'>Enable built-in metrics for this form.</p>
                                    </div>
                                </div>
                                <FormField control={form.control} name='analytics_enabled' render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Screens */}
                        <div className='rounded-xl border border-accent p-4 md:p-5 space-y-6  to-muted/40 bg-background'>
                            <div className='flex items-center gap-3'>
                                <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary'><MonitorSmartphone className='h-4 w-4' /></div>
                                <h3 className='font-medium'>Screens</h3>
                            </div>
                            <div className='grid md:grid-cols-2 gap-6'>
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <FormLabel>Welcome Screen</FormLabel>
                                        <FormField control={form.control} name='welcome_screen_enabled' render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <FormLabel>Thank You Screen</FormLabel>
                                        <FormField control={form.control} name='thank_you_screen_enabled' render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timing */}
                        <div className='rounded-xl border border-accent p-4 md:p-5 space-y-4  to-muted/40 bg-background'>
                            <div className='flex items-center justify-between m-0'>
                                <div className='flex gap-3'>
                                    <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary'><Clock className='h-4 w-4' /></div>
                                    <div>
                                        <h3 className='font-medium'>
                                            <span>Time Bound</span>
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>Restrict submissions to a window.</p>
                                    </div>
                                </div>
                                <FormField control={form.control} name='time_bound' render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
                            <AnimatePresence initial={false}>
                                {
                                    watchTimeBound &&
                                    <motion.div
                                        key='time-bound-fields'
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "80px", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2, }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div className='grid md:grid-cols-2 gap-4 pt-5'>
                                            <DateTimeField form={form} name='open_at' label='Open At' />
                                            <DateTimeField form={form} name='close_at' label='Close At' />
                                        </div>
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div>

                        {/* Submission & Privacy */}
                        <div className='rounded-xl border border-accent p-4 md:p-5 space-y-6  to-muted/40 bg-background'>
                            <div className='flex items-center gap-3'>
                                <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary'><Users2 className='h-4 w-4' /></div>
                                <h3 className='font-medium'>Submission & Privacy</h3>
                            </div>
                            <div className='grid md:grid-cols-2 gap-6'>
                                <FormField control={form.control} name='multiple_submissions' render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-md border-accent border p-3'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-sm'>Multiple Submissions</FormLabel>
                                            <FormDescription>Allow to submit multiple times.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='allow_anonymous' render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-md border-accent border p-3'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-sm'>Allow Anonymous</FormLabel>
                                            <FormDescription>Don&apos;t require authentication.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name='password_protected' render={({ field }) => (
                                    <div className='flex flex-col items-center rounded-md border border-accent col-span-2 bg-background w-full'>
                                        <FormItem className='flex flex-row w-full items-center justify-between p-3 '>
                                            <div className='space-y-0.5 flex items-center gap-2'>
                                                <div className='h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary'><Shield className='h-4 w-4' /></div>
                                                <div>
                                                    <FormLabel className='text-sm'>Password Protected</FormLabel>
                                                    <FormDescription>Require a password for access.</FormDescription>
                                                </div>
                                            </div>
                                            <FormControl>
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </FormItem>
                                        <AnimatePresence initial={false}>
                                            {watchPasswordProtected && (
                                                <motion.div
                                                    key='password-field'
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "80px", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2, }}
                                                    style={{ overflow: 'hidden' }}
                                                    className='col-span-2 w-full p-3 pt-4'
                                                >
                                                    <div className='pt-1'>
                                                        <FormField control={form.control} name='password' render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Password</FormLabel>
                                                                <FormControl>
                                                                    <div className='relative'>
                                                                        <Lock size={16} className='absolute left-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none' />
                                                                        <Input className='pl-10' type={showPassword ? 'text' : 'password'} placeholder='Enter password' {...field} />
                                                                        <Button type='button' variant='ghost' size={'icon'} className='absolute right-0.5 top-1/2 -translate-y-1/2' onClick={() => setShowPassword(!showPassword)}>
                                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                                        </Button>
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )} />
                                <FormField control={form.control} name='require_consent' render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-md border border-accent p-3 md:col-span-2'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-sm'>Require Consent</FormLabel>
                                            <FormDescription>Show consent checkbox before submission.</FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                    </form>
                </Form>
                <DialogFooter className='p-3 pt-4 px-4  border-t bg-background'>
                    <Button type='button' variant='ghost' onClick={() => { setDialogOpen(false); reset(); }} disabled={isSubmitting}>Cancel</Button>
                    <Button type='submit' form='form-settings' loading={isSubmitting}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


function DateTimeField({ form, name, label }: { form: FormSettingsForm; name: 'open_at' | 'close_at'; label: string }) {
    const [open, setOpen] = useState(false);
    const [dateState, setDateState] = useState<Date | undefined>(undefined);
    const [timeState, setTimeState] = useState<string>('');

    // Watch the field value
    const fieldValue = form.watch(name);

    // Sync incoming value
    useEffect(() => {
        if (fieldValue) {
            const d = new Date(fieldValue);
            if (!isNaN(d.getTime())) {
                setDateState(d);
                const hh = String(d.getHours()).padStart(2, '0');
                const mm = String(d.getMinutes()).padStart(2, '0');
                const ss = String(d.getSeconds()).padStart(2, '0');
                setTimeState(`${hh}:${mm}:${ss}`);
            }
        } else {
            setDateState(undefined);
            setTimeState('');
        }
    }, [fieldValue]);

    // helper combine
    const combine = (d?: Date, t?: string) => {
        if (d && t) {
            const [hh, mm, ss = '00'] = t.split(':');
            const composed = new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                parseInt(hh || '0', 10),
                parseInt(mm || '0', 10),
                parseInt(ss || '0', 10)
            );
            return composed.toISOString();
        }
        return '';
    };

    return (
        <FormField control={form.control} name={name} render={({ field }) => {
            const commitDate = (d?: Date) => {
                setDateState(d);
                if (d && timeState) field.onChange(combine(d, timeState));
                else if (!d) field.onChange('');
            };

            const commitTime = (t: string) => {
                setTimeState(t);
                if (dateState && t) field.onChange(combine(dateState, t));
            };

            return (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <div className="flex gap-3 items-start">
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button type="button" variant="outline" className="w-40 justify-between font-normal">
                                        {dateState ? dateState.toLocaleDateString() : 'Select date'}
                                        <ChevronDown className="h-4 w-4 opacity-70" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dateState}
                                        captionLayout="dropdown"
                                        onSelect={(d) => {
                                            commitDate(d);
                                            setOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <Input
                                type="time"
                                step="1"
                                value={timeState}
                                onChange={(e) => commitTime(e.target.value)}
                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                            />
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            );
        }} />
    );
}