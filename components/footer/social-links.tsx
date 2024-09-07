import { Github, LinkedinIcon } from "lucide-react";
import Link from "next/link";

export default function SocialLinks() {
    return (
      <ul className="flex gap-3 mt-5">
        <li>
          <Link target="_blank" href="https://github.com/Tawfik-Tarek">
            <Github className="transition-all duration-300 ease-in-out hover:text-primary" />
          </Link>
        </li>
        <li>
          <Link target="_blank" href="https://www.linkedin.com/in/tawfiktarek">
            <LinkedinIcon className="transition-all duration-300 ease-in-out hover:text-primary" />
          </Link>
        </li>
      </ul>
    );
  }
