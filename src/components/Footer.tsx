// components/Footer.tsx

import { Mail, Instagram, Twitter, Linkedin } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo & Project name */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-white mb-2">
            IELTS Spelling Coach
          </h2>
          <p className="text-sm text-gray-400">
            Helping students master spelling in IELTS listening.
          </p>
        </div>

        {/* Contact and social */}
        <div className="flex flex-col md:items-end text-center md:text-right">
          <p className="text-sm font-medium mb-2">Contact us:</p>
          <div className="flex justify-center md:justify-end gap-4 mb-3">
            <a
              href="mailto:hello@ieltscoach.com"
              className="hover:text-white flex items-center gap-1"
            >
              <Mail size={18} /> hello@ieltscoach.com
            </a>
          </div>
          <div className="flex justify-center md:justify-end gap-5">
            <a
              href="https://t.me/vsa_010"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaTelegramPlane size={20} />
            </a>
            <a
              href="https://instagram.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://twitter.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://linkedin.com/in/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} IELTS Spelling Coach. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
