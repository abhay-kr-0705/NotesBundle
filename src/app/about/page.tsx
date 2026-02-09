import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="container-custom py-12 md:py-24">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="h1">About NotesBundle</h1>
                    <p className="text-xl text-muted-foreground">
                        Empowering students with high-quality, accessible study materials.
                    </p>
                </div>

                <div className="prose prose-lg mx-auto">
                    <p>
                        NotesBundle is a dedicated platform designed to help students ace their exams.
                        Whether you are preparing for GATE, semester exams, or competitive tests,
                        we provide comprehensive, handwritten, and digital notes curated by toppers and experts.
                    </p>

                    <h3>Our Mission</h3>
                    <p>
                        Our mission is to democratize education by making high-quality study resources
                        affordable and accessible to every student in India. We believe that lack of
                        resources should never be a barrier to success.
                    </p>

                    <h3>Why Choose Us?</h3>
                    <ul>
                        <li><strong>Standardized Quality:</strong> All notes are verified for accuracy and clarity.</li>
                        <li><strong>Affordable Pricing:</strong> Premium content at student-friendly prices.</li>
                        <li><strong>Wide Coverage:</strong> From engineering subjects to competitive exams like GATE and SSC.</li>
                        <li><strong>Instant Access:</strong> Digital downloads mean you can start studying seconds after purchase.</li>
                    </ul>

                    <h3>Contact Us</h3>
                    <p>
                        Have questions or suggestions? We'd love to hear from you.
                        <br />
                        Email: <a href="mailto:support@notesbundle.com" className="text-primary hover:underline">support@notesbundle.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
