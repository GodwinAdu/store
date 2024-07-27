import Header from '@/components/Header'
import { DataTable } from '@/components/table/DataTable'

import { Separator } from '@/components/ui/separator'
import { fetchAllUsers } from '@/lib/actions/user.actions'
import { CategoryModal } from './_components/CategoryModal'
import { columns } from './_components/column'
import { fetchAllCategories } from '@/lib/actions/category.actions'

const page = async () => {
    const data = await fetchAllCategories() || [];
    return (
        <>
            <div className="flex justify-between items-center px-3">
                <Header title="Manage Categories" />
                <div className="flex gap-4">
                    <CategoryModal />
                </div>
            </div>
            <Separator />
            <DataTable searchKey='name' data={data} columns={columns} />
        </>
    )
}

export default page
