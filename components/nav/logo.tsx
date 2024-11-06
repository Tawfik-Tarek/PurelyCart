import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";

const Logo = ({style , size} : {style?:string , size?:number}) => {
  return (
    <div className="flex items-center gap-1">
      <ShoppingCartIcon className="text-primary" size={size || 20} />
      <h2 className={cn(`text-primary font-extrabold italic text-xl gap-2 $`, style)}>PurelyCart</h2>
    </div>
  );
};

export default Logo;
