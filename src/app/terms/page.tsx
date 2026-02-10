
import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="container-custom py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Terms and Conditions</h1>

            <div className="prose prose-slate max-w-none text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Agreement to Terms</h3>
                <p>
                    These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and NotesBundle ("we," "us" or "our"),
                    concerning your access to and use of the NotesBundle website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
                </p>

                <h3>2. Intellectual Property Rights</h3>
                <p>
                    Unless otherwise indicated, the Site and the notes, study materials, source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”)
                    and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights.
                </p>
                <p>
                    The Content and the Marks are provided on the Site “AS IS” for your information and personal use only. Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be copied, reproduced,
                    aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                </p>

                <h3>3. User Representations</h3>
                <p>By using the Site, you represent and warrant that:</p>
                <ul>
                    <li>All registration information you submit will be true, accurate, current, and complete.</li>
                    <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                    <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                    <li>You are not a minor in the jurisdiction in which you reside.</li>
                </ul>

                <h3>4. Purchases and Payment</h3>
                <p>
                    We accept the following forms of payment:
                </p>
                <ul>
                    <li>Razorpay (UPI, Credit/Debit Cards, Net Banking)</li>
                </ul>
                <p>
                    You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
                    Sales tax will be added to the price of purchases as deemed required by us. We may change prices at any time. All payments shall be in INR.
                </p>

                <h3>5. Digital Products</h3>
                <p>
                    Since our products are digital goods (PDF notes, study materials), they are deemed "used" after download or opening. strict refund policies apply. Please review our <Link href="/refund" className="text-primary hover:underline">Refund Policy</Link> before purchasing.
                </p>

                <h3>6. Contact Us</h3>
                <p>
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                    <br />
                    <strong>NotesBundle</strong>
                    <br />
                    support@notesbundle.com
                </p>
            </div>
        </div>
    );
}
