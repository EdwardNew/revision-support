"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

type Props = {
    SignInTab: React.ReactNode;
    SignUpTab: React.ReactNode;
};

export default function LoginTabs({ SignInTab, SignUpTab }: Props) {
    return (
        <Tabs defaultValue="sign-in">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">{SignInTab}</TabsContent>
            <TabsContent value="sign-up">{SignUpTab}</TabsContent>
        </Tabs>
    );
}
