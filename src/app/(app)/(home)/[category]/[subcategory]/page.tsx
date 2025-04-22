interface SubcategoryPageProps {
  params: Promise<{ category: string; subcategory: string }>;
}

const SubcategoryPage = async ({ params }: SubcategoryPageProps) => {
  const { category, subcategory } = await params;

  return (
    <div>
      {category} | {subcategory}
    </div>
  );
};

export default SubcategoryPage;
