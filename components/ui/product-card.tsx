'use client'
import { Product } from "@/types"
import Image from "next/image"
import { IconButton } from "./icon-button"
import { Expand, ShoppingCart } from "lucide-react"
import { Currency } from "./currency"

interface ProduceCardProps{
    data:Product
}

export const ProductCard = ({data}:ProduceCardProps)=>{
    return(
        <div className="bg-white group cursor-pointer
          rounded-xl border p-3 space-y-4">
            {/* images and actions */}
            <div className="aspect-square rounded-xl bg-gray-100 relative">
                <Image src={data?.images?.[0]?.url} alt='product-card-img' fill
                className="aspect-square object-cover rounded-md"/>
                <div className="opacity-0 group-hover:opacity-100
                transition absolute w-full px-6 bottom-5">
                    <div className="flex gap-x-6 justify-center">
                        <IconButton onClickHandler={()=>{}}
                        icon={<Expand size={20} className="text-gray-600"/>}
                        />
                        <IconButton onClickHandler={()=>{}}
                        icon={<ShoppingCart size={20} className="text-gray-600"/>}
                        />
                    </div>
                </div>
            </div>
            {/* description */}
            <div className="font-semibold text-lg">
                <p>{data.name}</p>
                <p className="text-sm text-gray-500">
                    {data.category?.name}
                </p>
            </div>
            {/* price */}
            <div className="flex items-center justify-between">
                <Currency value={data?.price}/>
            </div>
        </div>
    )
}