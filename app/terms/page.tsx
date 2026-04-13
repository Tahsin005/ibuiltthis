import SectionHeader from "@/components/common/section-header";
import { FileTextIcon } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="py-20">
            <div className="wrapper max-w-4xl px-4 md:px-12">
                <SectionHeader
                    title="Terms of Service"
                    description="Please read these terms carefully before using our platform."
                    icon={FileTextIcon}
                />

                <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using iBuiltThis, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">2. User Accounts</h2>
                        <p>
                            When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">3. User Submissions</h2>
                        <p>
                            Our platform allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                        </p>
                        <p>
                            By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">4. Termination</h2>
                        <p>
                            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                        </p>
                    </section>

                    <p className="pt-8 text-sm border-t">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>
        </div>
    );
}
