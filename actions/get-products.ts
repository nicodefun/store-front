import { Product } from "@/types";
import qs from 'query-string'

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

interface Query{
    categoryId?:string;
    colorId?:string;
    sizeId?: string;
    isFeatured?:boolean;
}

export const getProducts = async (query: Query):Promise<Product[]> =>{
    const url = qs.stringifyUrl({
        url:URL,
        query:{
            colorId: query.colorId,
            sizeId: query.sizeId,
            isFeatured: query.isFeatured,
            categoryId: query.categoryId
        }
    })
    const res = await fetch(url)
    return res.json();
}