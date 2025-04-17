import { Category } from "@/payload-types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import Footer from "./footer";
import { NavBar } from "./navbar";
import { SearchFilters } from "./search-filters";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = async ({ children }: HomeLayoutProps) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const categories = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = categories.docs.map((doc) => ({
    ...doc,
    subCategories: (doc.subCategories?.docs || []).map((subCategory) => ({
      // Because of "depth: 1" we are confident "doc" will be a type of Category
      ...(subCategory as Category),
      subCategories: undefined,
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <SearchFilters data={formattedData} />
      <main className="flex-1 bg-[#f4f4f0]">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;
