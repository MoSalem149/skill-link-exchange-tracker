import { Link } from 'react-router-dom';
import { Users, Star, Book, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Index = () => {
  const stats = [
    { icon: Book, label: 'Skills Gained', value: '5,000+' },
    { icon: Users, label: 'Active Users', value: '10,000+' },
    { icon: Star, label: 'Average Rating', value: '4.8/5' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Web Developer',
      content: 'SkillLink helped me improve my design skills while teaching coding. The community is amazing!',
      image: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Michael Chen',
      role: 'UX Designer',
      content: 'The platform made it easy to find people to exchange skills with. Highly recommended!',
      image: 'https://i.pravatar.cc/150?img=2',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary to-accent text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeIn">
              Exchange Skills,<br />Grow Together
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join our community of learners and teachers. Share your expertise and learn from others.
            </p>
            <div className="space-x-4">
              <Link to="/signup" className="inline-flex items-center btn-secondary text-lg px-8 py-3">
                Get Started <ArrowRight className="ml-2" />
              </Link>
              <Link to="/about" className="inline-flex items-center bg-white text-primary px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <stat.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-4xl font-bold text-accent mb-2">{stat.value}</h3>
                <p className="text-gray-600 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-accent">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-xl text-accent">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;