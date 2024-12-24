import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-3">1. Data Collection</h2>
                <p className="text-gray-700">
                  We collect information that you provide directly to us, including:
                  name, email address, profile information, and skills data. We also
                  automatically collect certain information about your device when you
                  use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Use of Data</h2>
                <p className="text-gray-700">
                  We use the collected data to:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Provide and maintain our services</li>
                  <li>Improve user experience</li>
                  <li>Send important notifications</li>
                  <li>Prevent fraud and abuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. Data Protection</h2>
                <p className="text-gray-700">
                  We implement appropriate technical and organizational measures to
                  protect your personal data against unauthorized access,
                  modification, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. User Rights</h2>
                <p className="text-gray-700">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 mt-2 text-gray-700">
                  <li>Access your personal data</li>
                  <li>Request data correction</li>
                  <li>Request data deletion</li>
                  <li>Object to data processing</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please contact
                  us through our Contact page.
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

export default PrivacyPolicy;