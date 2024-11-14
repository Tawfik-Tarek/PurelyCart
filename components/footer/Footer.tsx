import Logo from "../nav/logo";
import SocialLinks from "./social-links";
import FooterSection from "./footer-section";

export default function Footer() {
  const unifiedHref = "/info"; // Set this as the single destination page

  const shoppingCategories = [
    { href: unifiedHref, label: "Electronics" },
    { href: unifiedHref, label: "Fashion" },
    { href: unifiedHref, label: "Home Appliances" },
    { href: unifiedHref, label: "Beauty & Health" },
    { href: unifiedHref, label: "Sports & Outdoors" },
  ];

  const customerServices = [
    { href: unifiedHref, label: "Shipping Information" },
    { href: unifiedHref, label: "Returns & Refunds" },
    { href: unifiedHref, label: "FAQs" },
    { href: unifiedHref, label: "Customer Support" },
    { href: unifiedHref, label: "Order Tracking" },
  ];

  const companyInfo = [
    { href: unifiedHref, label: "About Us" },
    { href: unifiedHref, label: "Meet the Team" },
    { href: unifiedHref, label: "Careers" },
    { href: unifiedHref, label: "Blog" },
    { href: unifiedHref, label: "Press Releases" },
  ];

  const legalInfo = [
    { href: unifiedHref, label: "Terms of Service" },
    { href: unifiedHref, label: "Privacy Policy" },
    { href: unifiedHref, label: "Cookie Policy" },
    { href: unifiedHref, label: "Disclaimer" },
    { href: unifiedHref, label: "Accessibility" },
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
