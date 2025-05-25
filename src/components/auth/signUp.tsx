"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from "@/core/theme/supabase/supabaseClient"
import { ISignUp } from "@/interfaces/auth"
import { cn } from "@/lib/utils"
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js"
import { EyeClosed, EyeIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { toast } from "sonner"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
    const formMethods = useForm<ISignUp>();
    const { control, handleSubmit, setError } = formMethods;
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (dataSource: ISignUp) => {

        const dto: SignUpWithPasswordCredentials = {
            email: dataSource.email,
            phone: dataSource.phone,
            password: dataSource.password,
        };

        const { data, error } = await supabase.auth.signUp(dto);
        if (error) {
            setError("root", { message: error.message });
            toast.error(error.message, {
                description: "Please check your credentials and try again.",
            });
            return;
        }

        if (data.user) {
            // Make sure field name matches what's expected in the database
            const { error: profileError } = await supabase.from('profiles').insert([
                { id: data.user.id, userName: dataSource.username }
            ]);

            if (profileError) {
                console.error('Error creating profile:', profileError);
                toast.error("Failed to create user profile", {
                    description: profileError.message,
                });
                // Consider how to handle this error - either continue or stop
                return; // Stop the flow if profile creation fails
            }

            toast.success("Account created successfully!", {
                description: "You can now sign in with your credentials.",
            });
            redirect("/dashboard");
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: window.location.origin + "/dashboard",
            },
        });

        if (error) {
            setError("root", { message: error.message });
            return;
        }


    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div>
                        <div className="flex flex-col gap-6 p-6 md:p-8">
                            <FormProvider {...formMethods}>
                                <form onSubmit={handleSubmit(onSubmit)} >
                                    <div className="flex flex-col items-center text-center py-2 pb-4">
                                        <h1 className="text-2xl font-bold">Welcome Back</h1>
                                        <p className="text-balance text-muted-foreground">Sign in to your Escape account</p>
                                    </div>
                                    <FormField
                                        name="email"
                                        control={control}
                                        rules={{ required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } }}
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                {/* <FormLabel>Email</FormLabel> */}
                                                <FormControl>
                                                    <Input id="email" placeholder="Email" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage>{fieldState?.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="phone"
                                        control={control}
                                        rules={{ required: "Phone number is required" }}
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                {/* <FormLabel>Phone</FormLabel> */}
                                                <FormControl>
                                                    <Input id="phone" type="tel" placeholder="Phone Number" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage>{fieldState?.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="username"
                                        control={control}
                                        rules={{ required: "Username is required" }}
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input id="username" placeholder="Username" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage>{fieldState?.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="password"
                                        control={control}
                                        rules={{ required: "Password is required" }}
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                {/* <FormLabel>Password</FormLabel> */}
                                                <div className="flex items-center gap-2">
                                                    <FormControl>
                                                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="Password" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <Button variant="outline" type="button" size="icon" onClick={() => setShowPassword(!showPassword)}>
                                                        {
                                                            showPassword ? <EyeClosed /> : <EyeIcon />
                                                        }
                                                    </Button>
                                                </div>
                                                <FormMessage>{fieldState?.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        name="confirmPassword"
                                        control={control}
                                        rules={{
                                            required: "Confirm Password is required",
                                            validate: (value) => value === formMethods.getValues("password") || "Passwords do not match",
                                        }}
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input id="confirmPassword" type="password" placeholder="Confirm Password" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage>{fieldState?.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">
                                        Sign Up
                                    </Button>
                                </form>
                            </FormProvider>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 px-3 bg-card">Or continue with</span>
                            </div>
                            <div >
                                <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span >Login with Google</span>
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Already have an account?{" "}
                                <Link href="sign-in" className="underline underline-offset-4">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden bg-muted md:block">
                        <Image src="/images/placeholder.svg" alt="Image" width={100} height={100}
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
                    </div>
                </CardContent>
            </Card>
            <div
                className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy
                    Policy</a>.
            </div>
        </div>
    )
}
