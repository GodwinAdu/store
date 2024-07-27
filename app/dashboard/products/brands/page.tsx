import Header from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import { fetchAllUsers } from '@/lib/actions/user.actions'
import { BrandModal } from './_components/BrandModal'
import { columns } from './_components/column'
import { DataTable } from '@/components/table/DataTable'
import { fetchAllBrands } from '@/lib/actions/brand.actions'

const page = async () => {
    const data = await fetchAllBrands() || [];
    return (
        <>
            <div className="flex justify-between items-center px-3">
                <Header title="Manage Brands" />
                <div className="flex gap-4">
                    <BrandModal />
                </div>
            </div>
            <Separator />
            <DataTable searchKey='name' data={data} columns={columns} />
        </>
    )
}

export default page
