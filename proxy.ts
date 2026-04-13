import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, request) => {
    const { userId, orgId } = await auth();

    if (request.nextUrl.pathname.startsWith('/org-setup')) {
        return NextResponse.next();
    }

    if (userId && !orgId) {
        try {
            const client = await clerkClient();

            const { data: organizations } = await client.users.getOrganizationMembershipList({
                userId,
            });

            if (organizations && organizations.length > 0) {
                const firstOrgId = organizations[0].organization.id;
                const returnTo = encodeURIComponent(
                    request.nextUrl.pathname + request.nextUrl.search
                );
                return NextResponse.redirect(
                    new URL(`/org-setup?orgId=${firstOrgId}&returnTo=${returnTo}`, request.url)
                );
            }

            const user = await client.users.getUser(userId);

            const orgName = user.fullName
                ? `${user.fullName}'s Organization`
                : user.firstName
                ? `${user.firstName}'s Organization`
                : user.username
                ? `${user.username}'s Organization`
                : user.primaryEmailAddress?.emailAddress
                ? `${user.primaryEmailAddress?.emailAddress}'s Organization`
                : 'My Organization';

            const org = await client.organizations.createOrganization({
                name: orgName,
                createdBy: userId,
            });

            const returnTo = encodeURIComponent(
                request.nextUrl.pathname + request.nextUrl.search
            );
            return NextResponse.redirect(
                new URL(`/org-setup?orgId=${org.id}&returnTo=${returnTo}`, request.url)
            );
        } catch (error) {
            console.error('Error auto-creating organization:', error);
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};