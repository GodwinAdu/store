"use client"

import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { ColDef } from 'ag-grid-community'; // Import the ColDef type
import BrandSelection from '@/components/commons/BrandSelection';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import CategorySelection from '@/components/commons/CategorySelection';
import { toast } from '@/components/ui/use-toast';
import { fetchProductsWithLimit } from '@/lib/actions/product.actions';
import { CellAction } from './cell-action';
import moment from 'moment';
import { calculateQuantity } from '@/lib/utils';

const ProductGrid = ({ brands, categories }: { brands: any[], categories: any[] }) => {
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState([]);

    // Column Definitions: Defines the columns to be displayed.
    const [colDefs, setColDefs] = useState<ColDef[]>([]);
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetchProductsWithLimit();
            const formattedData = response.map((row) => ({
                ...row,
                quantity:calculateQuantity(row.prices),
                createdBy:row.createdBy.username
            }));
            setRowData(formattedData);
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive",
            })

        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        const newColDefs = [
            { field: 'name', headerName: 'Product Name' },
            { field: 'sku', headerName: 'Product SKU' },
            { field: 'barcode', headerName: 'Product Barcode' },
            { field: 'cost', headerName: 'Product Cost' },
            { field: 'quantity', headerName: 'Product Quantity' },
            { field: 'createdBy', headerName: 'Created By' },
            {
                field: "actions",
                headerName: "Actions",
                cellRenderer: CellAction,
            },
        ]
        setColDefs(newColDefs)
        fetchData();
    }, [])


    const onSearchHandler = () => {
        try {
            toast({
                title: "Searching...",
                description: "Please wait...",
            })
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive",
            })
        }
    }


    /**
  * Pagination settings for the grid.
  */
    const pagination = true;
    const paginationPageSize = 200;
    const paginationPageSizeSelector = [200, 500, 1000];
    return (
        <>
            <div className="border py-1 px-4 flex gap-5 items-center my-1">

                <div className="flex gap-4 items-center">
                    <div className="flex gap-4 items-center">
                        <label className="font-bold text-sm hidden lg:block">Brand</label>
                        <BrandSelection SelectedBrand={(value) => setSelectedBrand(value)} brands={brands} />
                    </div>
                    <div className="flex gap-4 items-center">
                        <label className="font-bold text-sm hidden lg:block">Category</label>
                        <CategorySelection SelectedCategory={(value) => setSelectedCategory(value)} categories={categories} />
                    </div>
                </div>
                <Button disabled={isLoading} className="flex" size="sm" onClick={onSearchHandler}>{isLoading ? (<Loader2 className="w-4 h-4 ml-2 animate-spin" />) : "Search"}</Button>
            </div>
            <div className="py-4 mt-2 px-2">

                <div
                    className="ag-theme-quartz" // applying the grid theme
                    style={{ height: 500, width: "100%" }} // the grid will fill the size of the parent container
                >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={colDefs}
                        pagination={pagination}
                        paginationPageSize={paginationPageSize}
                        paginationPageSizeSelector={paginationPageSizeSelector}
                    />
                </div>
            </div>


        </>
    )
}

export default ProductGrid
