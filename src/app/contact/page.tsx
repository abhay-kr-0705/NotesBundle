
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="container-custom py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground text-center">Contact Us</h1>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
                Have questions or need assistance? We're here to help! Reach out to us through any of the channels below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Email */}
                <div className="card p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                    <p className="text-muted-foreground mb-4">For general queries and support</p>
                    <a href="mailto:support@notesbundle.com" className="text-primary font-medium hover:underline">
                        support@notesbundle.com
                    </a>
                </div>

                {/* Phone */}
                <div className="card p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                        <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                    <p className="text-muted-foreground mb-4">Mon-Fri from 9am to 6pm</p>
                    <a href="tel:+919876543210" className="text-primary font-medium hover:underline">
                        +91 98765 43210
                    </a>
                </div>

                {/* Address */}
                <div className="card p-8 flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                    <p className="text-muted-foreground mb-4">Our Head Office</p>
                    <p className="text-foreground font-medium">
                        NotesBundle HQ<br />
                        Patna, Bihar, India
                    </p>
                </div>
            </div>

            <div className="mt-16 card p-8 md:p-12 max-w-3xl mx-auto bg-slate-50 border-slate-200">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                        <p className="text-muted-foreground">
                            We aim to respond to all inquiries within <strong>24 hours</strong>. For urgent issues regarding payments or downloads, please use the subject line "URGENT" in your email.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
