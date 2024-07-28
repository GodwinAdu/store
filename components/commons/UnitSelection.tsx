import { CreateUnit } from '../../app/dashboard/products/_components/CreateUnit';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface UnitSelectionProps {
    units: any[],
    SelectedUnit: (value: string) => void;
}
const UnitSelection = ({ SelectedUnit, units }: UnitSelectionProps) => {

    return (
        <>
            <Select
                onValueChange={(value) => SelectedUnit(value)}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={units && units[0]?.name} />
                </SelectTrigger>
                <SelectContent>
                    {units?.map((unit) => (
                        <SelectItem key={unit._id} value={unit._id}>
                            {unit.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


        </>
    )
}

export default UnitSelection