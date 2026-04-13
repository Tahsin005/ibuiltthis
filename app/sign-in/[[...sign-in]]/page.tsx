import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex justify-center items-center py-24 min-h-[calc(100vh-8rem)]">
            <SignIn />
        </div>
    );
}
