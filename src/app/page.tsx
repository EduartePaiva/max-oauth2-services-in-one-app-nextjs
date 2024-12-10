import { redirect } from "next/navigation";

import { getCurrentSession } from "@/auth/session";
import LogoutBtn from "@/components/logout-btn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Home() {
    const { user } = await getCurrentSession();
    if (!user) return redirect("/login");
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
            <Avatar className="size-20 transition hover:scale-110">
                <AvatarImage src={user.avatarUrl ?? undefined} />
                <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <h1 className="text-wrap text-2xl font-bold text-slate-700">
                Welcome back {user.username}
            </h1>
            <LogoutBtn />
        </div>
    );
}
