import LoginTabs from "@/components/LoginTabs";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";

export default async function page() {
    const { user } = await validateRequest();
    if (user) {
        return redirect("/dashboard");
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Welcome
                    </CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your account or create a new one
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginTabs
                        SignInTab={<SignInForm />}
                        SignUpTab={<SignUpForm />}
                    ></LoginTabs>
                </CardContent>
            </Card>
        </div>
    );
}
