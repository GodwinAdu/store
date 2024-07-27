import Nav from "@/components/pos/Nav";
import PosContent from "@/components/pos/PosContent";
import { fetchAllBrands } from "@/lib/actions/brand.actions";
import { fetchAllCategories } from "@/lib/actions/category.actions";


const page = async () => {
  const brands = await fetchAllBrands() || [];
  const categories = await fetchAllCategories() || [];
  return (
    <main className="h-screen w-full flex flex-col">
      <Nav />
     <PosContent brands={brands} categories={categories} />
    </main>
  );
};

export default page;
