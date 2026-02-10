
import React from 'react';

export default function ShippingPolicyPage() {
    return (
        <div className="container-custom py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Shipping and Delivery Policy</h1>

            <div className="prose prose-slate max-w-none text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Digital Delivery</h3>
                <p>
                    NotesBundle deals exclusively in digital products (PDF notes, e-books, and study materials). <strong>We do not ship physical products.</strong>
                </p>

                <h3>2. Delivery Timeline</h3>
                <p>
                    <strong>Instant Delivery:</strong> Upon successful payment, you will receive immediate access to your purchased files.
                </p>
                <ul>
                    <li><strong>On Website:</strong> You will be redirected to an order confirmation page where you can download your files instantly.</li>
                    <li><strong>Via Email:</strong> An email containing the download links and invoice will be sent to your registered email address within 5-10 minutes.</li>
                    <li><strong>In Account:</strong> Registered users can access their purchased notes anytime from the "My Orders" section of their dashboard.</li>
                </ul>

                <h3>3. Troubleshooting Delivery Issues</h3>
                <p>
                    If you do not receive the email or cannot download the files after payment:
                </p>
                <ul>
                    <li>Check your Spam/Junk folder.</li>
                    <li>Verify that the payment was successfully deducted.</li>
                    <li>Contact our support team at <a href="mailto:support@notesbundle.com" className="text-primary hover:underline">support@notesbundle.com</a> with your transaction details. We will manually send the files within 24 hours.</li>
                </ul>
            </div>
        </div>
    );
}
