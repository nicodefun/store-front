'use client'
import { Product } from "@/types"
import Image from "next/image"
import { IconButton } from "./icon-button"
import { Expand, ShoppingCart } from "lucide-react"
import { Currency } from "./currency"
import { useRouter } from "next/navigation"
import usePreviewModal from "@/hooks/use-preview-modal"
import { MouseEventHandler } from "react"

interface ProduceCardProps{
    data:Product
}

export const ProductCard = ({data}:ProduceCardProps)=>{
    const router = useRouter();
    const previewModal = usePreviewModal();

    const onPreview:MouseEventHandler<HTMLButtonElement> = (event)=>{
        event.stopPropagation(); //overwrite the main div's onClick
        console.log('hey')
        previewModal.onOpen(data);
    }

    const handleClick = ()=>{
        router.push(`/product/${data?.id}`)
    }
    return(
        <div onClick={handleClick} className="bg-white group cursor-pointer
          rounded-xl border p-3 space-y-4">
            {/* images and actions */}
            <div className="aspect-square rounded-xl bg-gray-100 relative">
                <Image src={data?.images?.[0]?.url} alt='product-card-img' fill
                className="aspect-square object-cover rounded-md"/>
                <div className="opacity-0 group-hover:opacity-100
                transition absolute w-full px-6 bottom-5">
                    <div className="flex gap-x-6 justify-center">
                        <IconButton onClickHandler={onPreview}
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