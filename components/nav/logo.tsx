import { ShoppingCartIcon } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-1">
      <ShoppingCartIcon className="text-primary" size={20} />
      <h2 className="text-primary font-extrabold text-xl gap-2">ShopSphere</h2>
    </div>
  );
};

export default Logo;
