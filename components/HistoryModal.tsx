import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import moment from "moment"

const HistoryModal = ({ history }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex gap-2 items-center">
                    <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                            {history?.user?.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {moment(history?.timestamp).fromNow()}
                        </p>
                    </div>
                    <p className="text-sm font-medium text-green-600 truncate w-36">{history?.action}</p>
                </div>
            </DialogTrigger>
            <DialogContent className="w-[96%] max-w-4xl">
                <div className="py-4 px-4">
                    <div className="w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-700">Action Details</h2>
                            {/* <p className="text-sm text-gray-500">ID: {id}</p> */}
                            <p className="text-sm text-gray-500">Created By: {history.user.username}</p>
                            <p className="text-sm text-gray-500 pl-4">{moment(history.timestamp).fromNow()}</p>
                        </div>
                        <div className="p-4 space-y-4">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Action:</span> {history?.action}
                            </p>
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Browser:</span> {history?.details.browserName}
                            </p>
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Machine Type:</span> {history?.details?.machineType}
                            </p>
                            <div className="mt-4 space-y-4">
                                <h3 className="text-md font-semibold text-gray-700">Location</h3>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">City:</span> {history?.details?.location?.city}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Region:</span> {history?.details?.location?.region}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Country:</span> {history?.details?.location?.country}
                                </p>
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">IP:</span> {history?.details?.location?.ip}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}


export default HistoryModal