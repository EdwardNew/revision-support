import { UserContextProvider } from "@/components/context/UserContextProvider";
import PanelManager from "@/components/PanelManager";
import { validateRequest } from "@/lib/lucia";
import { redirect } from "next/navigation";
import Test from "./test";

export default async function page() {
    const { user } = await validateRequest();
    if (!user) {
        return redirect("/login");
    }
    return (
        <UserContextProvider
            username={user.username}
            treatment={user.treatment}
            papers={user.papers}
        >
            {/* <Test db_paper_id={user.papers[0]}></Test> */}
            <PanelManager />
        </UserContextProvider>
    );
}
