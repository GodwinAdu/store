import Nav from "@/components/pos/Nav";
import PosContent from "@/components/pos/PosContent";
import { getAllAccounts } from "@/lib/actions/account.actions";
import { fetchAllBrands } from "@/lib/actions/brand.actions";
import { fetchAllCategories } from "@/lib/actions/category.actions";
import { currentProfile } from "@/lib/helpers/current-user";


const page = async () => {
  const brands = await fetchAllBrands() || [];
  const categories = await fetchAllCategories() || [];
  const user = await currentProfile()
  const accounts = await getAllAccounts() || [];
  return (
    <main className="h-screen w-full flex flex-col">
      <Nav user={user} />
     <PosContent accounts={accounts}  brands={brands} categories={categories} />
    </main>
  );
};

export default page;
