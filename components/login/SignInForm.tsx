"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/app/login/auth.action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export const SignInSchema = z.object({
    username: z.string(),
    password: z.string(),
});

export default function SignInForm() {
    const [error, setError] = useState<string | null>(null);

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignInSchema>) {
        const res = await signIn(values);
        if (res?.error) {
            setError(res.error);
        }
    }

    return (
        <>
            {error && (
                <Alert variant="destructive" className="my-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="space-y-2">
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        autoComplete="username"
                                        placeholder="Enter your username..."
                                        {...field}
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
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="Enter your password..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                        Sign In
                    </Button>
                </form>
            </Form>
        </>
    );
}
