import Logo from "../nav/logo";
import SocialLinks from "./social-links";
import FooterSection from "./footer-section";

export default function Footer() {
  const shoppingCategories = [
    { href: "/category/electronics", label: "Electronics" },
    { href: "/category/fashion", label: "Fashion" },
    { href: "/category/home-appliances", label: "Home Appliances" },
    { href: "/category/beauty", label: "Beauty & Health" },
    { href: "/category/sports", label: "Sports & Outdoors" },
  ];

  const customerServices = [
    { href: "/help/shipping", label: "Shipping Information" },
    { href: "/help/returns", label: "Returns & Refunds" },
    { href: "/help/faqs", label: "FAQs" },
    { href: "/help/contact", label: "Customer Support" },
    { href: "/help/tracking", label: "Order Tracking" },
  ];

  const companyInfo = [
    { href: "/about", label: "About Us" },
    { href: "/team", label: "Meet the Team" },
    { href: "/careers", label: "Careers" },
    { href: "/blog", label: "Blog" },
    { href: "/press", label: "Press Releases" },
  ];

  const legalInfo = [
    { href: "/terms-of-service", label: "Terms of Service" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/cookie-policy", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/accessibility", label: "Accessibility" },
  ];

  return (
    <footer className="py-20">
      <div className="xl:grid xl:grid-cols-3 gap-8">
        <div className="flex flex-col justify-center items-center lg:block">
          <Logo style="text-3xl text-center xl:text-start" size={30} />
          <p className="mt-5 text-gray-600 dark:text-gray-300 text-center lg:text-start">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla tincidunt, nunc nec ultricies.
          </p>
          <SocialLinks />
        </div>
        <div className="mt-16 md:grid md:grid-cols-2 xl:mt-0 xl:col-span-2">
          <div className="grid grid-cols-2">
            <FooterSection title="Shopping Categories" links={shoppingCategories} />
            <FooterSection title="Customer Services" links={customerServices} />
          </div>
          <div className="mt-10 md:mt-0 grid grid-cols-2">
            <FooterSection title="Company Info" links={companyInfo} />
            <FooterSection title="Legal" links={legalInfo} />
          </div>
        </div>
      </div>
    </footer>
  );
}
