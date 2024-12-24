import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-primary">About SkillLink</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Our Mission</h2>
            <p className="text-lg mb-6 text-gray-700">
              SkillLink is dedicated to creating a collaborative learning environment where individuals can exchange skills and knowledge. We believe in the power of peer-to-peer learning and aim to make skill development accessible to everyone.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-accent">What We Offer</h2>
            <ul className="space-y-4 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Direct skill exchange between users</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Community-driven learning environment</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Verified user profiles and ratings</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Secure messaging system</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-accent">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-primary">Community</h3>
                <p className="text-gray-700">Building strong connections through shared learning experiences.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-primary">Innovation</h3>
                <p className="text-gray-700">Embracing new ways of learning and sharing knowledge.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-primary">Trust</h3>
                <p className="text-gray-700">Maintaining a safe and reliable platform for all users.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;