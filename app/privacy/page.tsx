import SectionHeader from "@/components/common/section-header";
import { ShieldCheckIcon } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="py-20">
            <div className="wrapper max-w-4xl px-4 md:px-12">
                <SectionHeader
                    title="Privacy Policy"
                    description="How we collect, use, and protect your data."
                    icon={ShieldCheckIcon}
                />
                
                <div className="mt-12 space-y-8 text-muted-foreground leading-relaxed">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, avatar, and other information you choose to provide.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">2. Use of Information</h2>
                        <p>
                            We may use the information we collect about you to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Provide and deliver the products and services you request, process transactions, and send you related information.</li>
                            <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
                            <li>Respond to your comments, questions, and requests, and provide customer service.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-foreground">3. Sharing of Information</h2>
                        <p>
                            We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:
                        </p>
                        <p>
                            With third-party service providers; in response to a request for information by a competent authority if we believe disclosure is in accordance with, or is otherwise required by, any applicable law, regulation, or legal process.
                        </p>
                    </section>
                    
                    <p className="pt-8 text-sm border-t">
                        Last updated: April 14, 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
