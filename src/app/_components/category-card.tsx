import Link from "next/link";
import { Badge } from "~/components/ui/badge";

export type Category = {
  name: string;
  description: string;
  count: number;
};

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      href={`/kategori/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
      className="block transition-transform duration-200 hover:translate-y-[-2px]"
    >
      <div className="border-accent-300 hover:border-primary-400 hover:bg-primary-50 flex items-center justify-between rounded-md border p-3">
        <span className="text-secondary-800">{category.name}</span>
        <Badge variant="secondary" className="text-xs">
          {category.count}
        </Badge>
      </div>
    </Link>
  );
};

export default CategoryCard;
