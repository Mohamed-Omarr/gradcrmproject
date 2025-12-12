import Link from "next/link";
import { Facebook, Instagram, Twitter, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-muted py-12 md:py-20">
      <div className="container px-40 grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
        {/* Brand/Logo and Social Media */}
        <div className="flex flex-col items-start col-span-1 md:col-span-2 lg:col-span-2">
          <Link href="/" className="text-2xl font-semibold text-foreground">
            FashionHub
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Your trusted partner for innovative solutions.
          </p>
          <div className="flex gap-4 mt-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Navigation Links - Pages */}
        <nav className="flex flex-col gap-4">
          <h3 className="text-base font-medium text-foreground">Pages</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:underline underline-offset-4">
                Home
              </Link>
            </li>
            <li>
              <Link href="/shop/products" className="hover:underline underline-offset-4">
                Shop
              </Link>
            </li>
          </ul>
        </nav>

        {/* Navigation Links - Info */}
        <nav className="flex flex-col gap-4">
          <h3 className="text-base font-medium text-foreground">Info</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="#" className="hover:underline underline-offset-4">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline underline-offset-4">
                Return & Refund
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline underline-offset-4">
                Support
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline underline-offset-4">
                FAQs
              </Link>
            </li>
          </ul>
        </nav>

        {/* Newsletter Signup */}
        <div className="flex flex-col gap-4 col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="text-base font-medium text-foreground">
            Join Newsletter
          </h3>
          <p className="text-sm text-muted-foreground">
            Subscribe to our newsletter to get more deals, new products, and
            promotions.
          </p>
          <form className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-5 w-5" />
              <span className="sr-only">Subscribe</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Section: Copyright and Payment Methods */}
      <div className="container mt-12 pt-8  px-40 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div>
            &copy; {new Date().getFullYear()} FashionHub. All rights reserved.
          </div>
          <div className="flex gap-4 pl-4 border-l border-border max-md:border-l-0 max-md:pt-4 max-md:pl-0 max-md:border-t">
            <Link href="#" className="hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:underline underline-offset-4">
              Terms & Conditions
            </Link>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {/* image for payment only put stripe */}
        </div>
      </div>
    </footer>
  );
}
