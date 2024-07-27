import Header from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import React from 'react'
import CreateUserForm from '../_components/CreateUserForm'
import { DataTable } from '@/components/table/DataTable'
import { columns } from '../_components/column'
import { fetchUser } from '@/lib/actions/user.actions'

const page = async ({ params }: { params: { userId: string } }) => {
    const data = await fetchUser(params.userId as string)
    console.log(data,"user data")
    return (
        <>
            <Header title='Update User' />
            <Separator />
            <div className="py-6">
                <CreateUserForm type='update' initialData={data} />
            </div>
        </>
    )
}

export default page
