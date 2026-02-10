
import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="container-custom py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>

            <div className="prose prose-slate max-w-none text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Introduction</h3>
                <p>
                    Welcome to NotesBundle ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                    If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information,
                    please contact us at support@notesbundle.com.
                </p>

                <h3>2. Information We Collect</h3>
                <p>
                    We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services,
                    when you participate in activities on the website, or otherwise when you contact us.
                </p>
                <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
                <ul>
                    <li>Personal Usage Data: Name, email address, contact data.</li>
                    <li>Payment Data: We collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by Razorpay. You may find their privacy notice link(s) here: <a href="https://razorpay.com/privacy/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Razorpay Privacy Policy</a>.</li>
                </ul>

                <h3>3. How We Use Your Information</h3>
                <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                <ul>
                    <li>To facilitate account creation and logon process.</li>
                    <li>To send you marketing and promotional communications.</li>
                    <li>To fulfill and manage your orders.</li>
                    <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
                </ul>

                <h3>4. Sharing Your Information</h3>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

                <h3>5. Security of Your Information</h3>
                <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

                <h3>6. Contact Us</h3>
                <p>If you have questions or comments about this policy, you may email us at support@notesbundle.com.</p>
            </div>
        </div>
    );
}
