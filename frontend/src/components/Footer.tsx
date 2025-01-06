import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-accent text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SkillLink</h3>
              <p className="text-sm">Connect, Learn, and Grow Together</p>
              <div className='flex felx-start pt-4 space-x-4'>
                <a href='/' className='text-xl pr-5 focus:outline-none focus:ring'><i className="fa-brands fa-facebook hover:bg-slate-400 rounded-full"></i></a>
                <a href='/'className='text-xl pr-5'><i className="fa-brands fa-linkedin hover:bg-slate-400 rounded"></i></a>
                <a href='/' className='text-xl pr-5'> <i className="fa-brands fa-twitter twitter-icon hover:bg-slate-500 hover:text-white hover:rounded-lg"></i></a>
              </div>
            </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link to="/terms" className="block text-sm hover:text-secondary">Terms of Use</Link>
              <Link to="/privacy-policy" className="block text-sm hover:text-secondary">Privacy Policy</Link>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Site Map</h4>
            <div className="space-y-2">
              <a href="/" className="block text-sm hover:text-secondary">
                Home
              </a>
              <a href="/about" className="block text-sm hover:text-secondary">About Us</a>
              <a href='/contact' className="block text-sm hover:text-secondary">Contact Us</a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <a href="mailto:contact@skilllink.com" className="flex items-center text-sm hover:text-secondary" target='_blank'>
                <Mail size={16} className="mr-2" />
                contact@skilllink.com
              </a>
              <a href="tel:+1234567890" className="flex items-center text-sm hover:text-secondary">
                <Phone size={16} className="mr-2" />
                (123) 456-7890
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-sm">© {new Date().getFullYear()} SkillLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
