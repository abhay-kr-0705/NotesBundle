
import React from 'react';

export default function RefundPage() {
    return (
        <div className="container-custom py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Refund and Cancellation Policy</h1>

            <div className="prose prose-slate max-w-none text-muted-foreground">
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h3>1. Digital Products Policy</h3>
                <p>
                    At NotesBundle, we specialize in high-quality digital study materials and notes. Due to the nature of digital goods, which can be downloaded and saved immediately after purchase,
                    we generally <strong>do not offer refunds or cancellations</strong> once a purchase is completed and the download link has been accessed.
                </p>

                <h3>2. Exceptions for Refunds</h3>
                <p>
                    We may offer a refund or exchange under the following specific circumstances:
                </p>
                <ul>
                    <li><strong>Defective File:</strong> If the file you downloaded is corrupt, incomplete, or technically unusable, and we are unable to provide a working replacement within 48 hours.</li>
                    <li><strong>Duplicate Purchase:</strong> If you accidentally purchased the same product twice, we will refund the duplicate transaction.</li>
                    <li><strong>Misrepresentation:</strong> If the content of the product completely differs from the description provided on the product page.</li>
                </ul>

                <h3>3. How to Request a Refund</h3>
                <p>
                    To request a refund under the above exceptions, please contact us at <a href="mailto:notesbundle@outlook.com" className="text-primary hover:underline">notesbundle@outlook.com</a> within 7 days of purchase.
                    Please include:
                </p>
                <ul>
                    <li>Your Order ID</li>
                    <li>The email address used for purchase</li>
                    <li>A detailed description of the issue (and screenshots if applicable)</li>
                </ul>

                <h3>4. Processing Timeline</h3>
                <p>
                    If your refund request is approved, the refund will be processed to your original method of payment within 5-7 business days.
                </p>
            </div>
        </div>
    );
}
