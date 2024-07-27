import Header from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import { UnitModal } from './_components/UnitModal'
import { columns } from './_components/column'
import { DataTable } from '@/components/table/DataTable'
import { fetchAllUnits } from '@/lib/actions/unit.actions'

const page = async () => {
    const data = await fetchAllUnits() || [];
    return (
        <>
            <div className="flex justify-between items-center px-3">
                <Header title="Manage Units" />
                <div className="flex gap-4">
                    <UnitModal />
                </div>
            </div>
            <Separator />
            <DataTable searchKey='name' data={data} columns={columns} />
        </>
    )
}

export default page
