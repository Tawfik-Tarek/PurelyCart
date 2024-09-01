import Link from "next/link";
import { Button } from "../ui/button";

type BackButtonProps = {
  href: string;
  label: string;
};

const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button className="font-medium w-full" variant={"link"} asChild>
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
};

export default BackButton;
