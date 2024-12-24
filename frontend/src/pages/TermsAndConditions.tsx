import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using this platform, you accept and agree to be
                bound by the terms and conditions outlined here. If you do not
                agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Permitted Use</h2>
              <p className="text-gray-700">
                You agree to use the platform only for lawful purposes and in a way
                that does not infringe upon the rights of others. Prohibited
                activities include:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Posting inappropriate or offensive content</li>
                <li>Attempting to gain unauthorized access</li>
                <li>Interfering with platform functionality</li>
                <li>Engaging in fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. Intellectual Property Rights
              </h2>
              <p className="text-gray-700">
                All content on this platform, including but not limited to text,
                graphics, logos, and software, is the property of our company and
                is protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                4. User Responsibilities
              </h2>
              <p className="text-gray-700">
                Users are responsible for:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Maintaining account security</li>
                <li>Providing accurate information</li>
                <li>Respecting other users</li>
                <li>Complying with all applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                5. Account Termination
              </h2>
              <p className="text-gray-700">
                We reserve the right to terminate or suspend accounts for:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Violation of these terms</li>
                <li>Fraudulent activities</li>
                <li>Inappropriate behavior</li>
                <li>Extended periods of inactivity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                6. Modifications to Terms
              </h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Continued
                use of the platform after changes constitutes acceptance of the new
                terms.
              </p>
            </section>
          </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
