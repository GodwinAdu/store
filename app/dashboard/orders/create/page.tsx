import Header from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import OrderForm from '../_components/OrderForm'



const page = async () => {

   
    return (
        <>
            <Header title='New Sale' />
            <Separator />
            <div className="py-6">
                <OrderForm />
            </div>

        </>
    )
}

export default page
