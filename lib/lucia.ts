import { Lucia, Session, User } from "lucia";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import { cookies } from "next/headers";
import { sessionsCollection, UserDoc, usersCollection } from "./mongodb";
import { cache } from "react";
const adapter = new MongodbAdapter(sessionsCollection, usersCollection);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        name: "test-auth-cookie",
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes(databaseUserAttributes) {
        return {
            username: databaseUserAttributes.username,
            papers: databaseUserAttributes.papers,
            treatment: databaseUserAttributes.treatment,
        };
    },
});

export const validateRequest = cache(
    async (): Promise<{ user: User | null; session: Session | null }> => {
        const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
        if (!sessionId) {
            return {
                user: null,
                session: null,
            };
        }

        const result = await lucia.validateSession(sessionId);

        try {
            if (result.session && result.session.fresh) {
                const sessionCookie = lucia.createSessionCookie(
                    result.session.id
                );
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );
            }
            if (!result.session) {
                const sessionCookie = lucia.createBlankSessionCookie();
                cookies().set(
                    sessionCookie.name,
                    sessionCookie.value,
                    sessionCookie.attributes
                );
            }
        } catch (error) {}

        return result;
    }
);

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<UserDoc, "_id">;
    }
}
