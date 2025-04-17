import CategoryDropdown from "./category-dropdown";

interface CategoriesProps {
  data: any;
}

const Categories = ({ data }: CategoriesProps) => {
  return (
    <div className="relative w-full">
      <div className="flex flex-nowrap items-center gap-6">
        {data.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Categories;
