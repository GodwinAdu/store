import Header from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import ProductForm from '../_components/ProductForm'
import { fetchAllCategories } from '@/lib/actions/category.actions'
import { fetchAllBrands } from '@/lib/actions/brand.actions'
import { fetchProductById } from '@/lib/actions/product.actions'


    ;
const page = async ({ params }: { params: { productId: string } }) => {
    const initialData = await fetchProductById(params.productId as string)
    const categories = await fetchAllCategories() || [];
    const brands = await fetchAllBrands() || [];

    return (
        <>
            <Header title='Create Product' />
            <Separator />
            <div className="py-6">
                <ProductForm type='update' initialData={initialData} categories={categories} brands={brands} />
            </div>

        </>
    )
}

export default page
