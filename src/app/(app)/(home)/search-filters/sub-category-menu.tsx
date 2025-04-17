import { Category } from "@/payload-types";
import Link from "next/link";

interface SubCategoryMenuProps {
  category: Category;
  isOpen: boolean;
  position: { top: number; left: number };
}

const SubCategoryMenu = ({
  category,
  isOpen,
  position,
}: SubCategoryMenuProps) => {
  if (
    !isOpen ||
    !category.subCategories ||
    category.subCategories.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#f5f5f5 ";

  return (
    <div
      className="fixed z-100"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <div className="h-3 w-60" />
      <div
        className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0_0_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]"
        style={{
          backgroundColor,
        }}
      >
        <div>
          {category.subCategories?.map((subCategory: Category) => (
            <Link
              key={subCategory.slug}
              href={`/categories/${subCategory.slug}`}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium"
            >
              {subCategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryMenu;
