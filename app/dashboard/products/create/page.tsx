import Header from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import ProductForm from '../_components/ProductForm'
import { fetchAllCategories } from '@/lib/actions/category.actions'
import { fetchAllBrands } from '@/lib/actions/brand.actions'



const page = async () => {

    const categories = await fetchAllCategories() || [];
    const brands = await fetchAllBrands() || [];

    return (
        <>
            <Header title='Create Product' />
            <Separator />
            <div className="py-6">
                <ProductForm type='create' categories={categories} brands={brands}  />
            </div>

        </>
    )
}

export default page
