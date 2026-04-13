import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center py-24 min-h-[calc(100vh-8rem)]">
            <Suspense fallback={null}>
                <SignIn />
            </Suspense>
        </div>
    );
}
