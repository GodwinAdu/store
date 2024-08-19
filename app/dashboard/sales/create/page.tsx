import Header from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import SalesForm from '../_components/SalesForm'



const page = async () => {

   
    return (
        <>
            <Header title='New Sale' />
            <Separator />
            <div className="py-6">
                <SalesForm />
            </div>

        </>
    )
}

export default page
