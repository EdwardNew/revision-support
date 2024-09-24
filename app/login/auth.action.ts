"use server";
import { usersCollection } from "@/lib/mongodb";
import { SignUpSchema } from "@/components/SignUpForm";
import { z } from "zod";
import { Argon2id } from "oslo/password";
import { lucia, validateRequest } from "@/lib/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignInSchema } from "@/components/SignInForm";
import { ObjectId } from "mongodb";

export async function signUp(values: z.infer<typeof SignUpSchema>) {
    const existingUser = await usersCollection.findOne({
        username: values.username,
    });

    if (existingUser) {
        return { error: "User already exists" };
    }

    const hashedPassword = await new Argon2id().hash(values.password);
    const user_id = new ObjectId().toString();

    const user = await usersCollection.insertOne({
        _id: user_id,
        username: values.username,
        hashed_password: hashedPassword,
        treatment: "Full-AI", // TODO: Remove when fully deployed
        papers: [],
    });

    const session = await lucia.createSession(user.insertedId, {});
    const sessionCookie = await lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
    return redirect("/dashboard");
}

export async function signIn(values: z.infer<typeof SignInSchema>) {
    const existingUser = await usersCollection.findOne({
        username: values.username,
    });

    if (!existingUser) {
        return { error: "Username does not exist" };
    }

    const validPassword = await new Argon2id().verify(
        existingUser.hashed_password,
        values.password
    );

    if (!validPassword) {
        return { error: "Incorrect username or password" };
    }

    const session = await lucia.createSession(existingUser._id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );

    return redirect("/dashboard");
}

export async function logout() {
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: "Unauthorized",
        };
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
    );
    return redirect("/login");
}
