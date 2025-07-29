import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Image
                src="/logo.png"
                alt="TradeSmart Logo"
                width={32}
                height={32}
              />
              <span className="text-2xl font-bold font-heading">
                Trade<span className="text-primary">Smart</span>
              </span>
            </Link>
            <p className="text-white/70 mb-4">
              Making learning magical for children around the world with
              AI-powered education.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white/70 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-all"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-white/70 hover:text-white transition-all"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Links column 1 */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">
              For Children
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/chat"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Games
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Characters
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Achievements
                </Link>
              </li>
            </ul>
          </div>

          {/* Links column 2 */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">For Parents</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Parent Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Track Progress
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Child Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Links column 3 */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-white/70 hover:text-white transition-all"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © {currentYear} TradeSmart. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm transition-all"
            >
              Privacy
            </Link>
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm transition-all"
            >
              Terms
            </Link>
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm transition-all"
            >
              Cookies
            </Link>
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm transition-all"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
