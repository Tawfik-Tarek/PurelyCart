import Link from "next/link";

export default function FooterSection({ title, links }: { title: string, links: { href: string, label: string }[] }) {
    return (
      <div>
        <h2 className="text-center text-primary font-semibold mb-3 lg:text-start">{title}</h2>
        <ul className="dark:text-gray-300 text-center lg:text-start text-gray-600 space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }