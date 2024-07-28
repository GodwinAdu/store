import Nav from "@/components/pos/Nav";
import PosContent from "@/components/pos/PosContent";
import { fetchAllBrands } from "@/lib/actions/brand.actions";
import { fetchAllCategories } from "@/lib/actions/category.actions";
import { fetchAllUnits } from "@/lib/actions/unit.actions";
import { currentProfile } from "@/lib/helpers/current-user";


const page = async () => {
  const brands = await fetchAllBrands() || [];
  const categories = await fetchAllCategories() || [];
  const units = await fetchAllUnits() || [];
  const user = await currentProfile()
  return (
    <main className="h-screen w-full flex flex-col">
      <Nav user={user} />
     <PosContent  brands={brands} categories={categories} units={units} />
    </main>
  );
};

export default page;
