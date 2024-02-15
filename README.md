## install
- npm i clsx tailwind-merge
- npx create-next-app@latest ecommerce-store --typescript --tailwind --eslint
- npm i lucide-react
- npm i @headlessui/react
- npm install zustand

## Environment setup & featured products (Store) 07:26:15
- npx create-next-app@latest ecommerce-store --typescript --tailwind --eslint
- css
```css
html, 
body, 
:root{
  height: 100%; 
}
```
- remove page.tsx
- create routes folder -> page.tsx
- in layout.tsx
```tsx
import type { Metadata } from "next";
import { Urbanist} from "next/font/google";
import "./globals.css";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Store",
  description: "yay~~~ store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
        <Footer />
    </body>
    </html>
  );
}

```
- create Footer component
- create Navbar
- create ContainerEl
- create Navbar & MainNav components

## MainNav
- npm i clsx tailwind-merge
- create lib->utils.ts
```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```
- create a file -> types.ts
```ts

export interface Billboard{
    id: string;
    label: string;
    imageUrl:string
}

export interface Category{
    id: string;
    name:string;
    billboard:string;
}
```
```tsx main-nav
"use client";
import { cn } from "@/lib/utils";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { Category } from "@/types";

interface MainNavProps {
  data: Category[];
}

export const MainNav = ({ data }: MainNavProps) => {
  const pathName = usePathname();
  const routes = data.map((item) => ({
    href: `/category/${item.id}`,
    label: item.name,
    active: pathName === `/category/${item.id}`,
  }));
  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6 ">
      {routes.map((route) => (
        <Link key={route.href} href={route.href}
        className={cn('text-sm font-medium transition-colors hover:text-black', 
        route.active ? 'text-black' : 'text-neutral-5--')}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

```
## create .env
- go to sever side project - copy API url
```.env
NEXT_PUBLIC_API_URL = http://localhost:3000/api/20dc6aa5-41ea-4241-8f3f-8593d148f03f
```

## create an actions folder
- get-categories.ts
```ts
import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`

export const getCategories = async ():Promise<Category[]> =>{
    const res = await fetch(URL)
    return res.json();
}
```
## in Navbar
```tsx

import { ContainerEl } from "./container-el";
import { MainNav } from "./main-nav";
import Link from "next/link";
import { getCategories } from "@/actions/get-categories";


export const Navbar = async() => {
    const categories = await getCategories()
  return (
    <div className="border-b">
      <ContainerEl>
        <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0 ">
            <p className="font-bold text-xl">Store</p>
          </Link>
          <MainNav data={categories}/>
          <NavbarActions/>
        </div>
      </ContainerEl>
    </div>
  );
};
```
- hard refresh cmd+shift+r

## create Navbar actions
- npm i lucide-react
- create Button component

```tsx ButtonEl
"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ButtonEl = forwardRef<HTMLButtonElement, ButtonProps>(
   ({
    className, 
    children,
    disabled, 
    type="button",
    ...props
   }, ref)=>{
    return(
        <button ref={ref} className={cn(`
        w-auto rounded-full bg-black border-transparent px-5 py-3 
        disabled:cursor-not-allowed disabled:opacity-50 
        text-white font-semibold hover:opacity-75 transition
        `,
        className)}>
            {children}
        </button>
    )
   } 
);

```
import { forwardRef } from "react";: This imports the forwardRef function from the React library. forwardRef is used to forward refs to a child component.

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}: This declares an interface named ButtonProps that extends React.ButtonHTMLAttributes<HTMLButtonElement>. 
This interface inherits all properties from React.ButtonHTMLAttributes<HTMLButtonElement>, which are the standard HTML button attributes, such as className, disabled, type, etc.

https://pjchender.blogspot.com/2021/03/react-dom-forwardref.html

({ className, children, disabled, type="button", ...props }, ref) => { ... }: This is a destructuring assignment of the props passed to the ButtonEl component. It extracts className, children, disabled, and type from the props object. It also uses the spread operator (...props) to collect any additional props passed to the component. ref is also destructured from the parameters, representing the ref forwarded to the underlying <button> element.

## use Button in navbar actions
```tsx
"use client";
import { ButtonEl } from "@/components/ui/button-el";
import { ShoppingBag } from "lucide-react";

export const NavbarActions = () => {
  return (
    <div className="ml-auto flex items-center gap-x-4">
      <ButtonEl className="flex items-center rounded-full bg-black px-4 py-2">
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">0</span>
      </ButtonEl>
    </div>
  );
};

```
## due to cart will use localstorage which will cause hydration 
```tsx
export const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(()=>{
    setIsMounted(true)
  }, [])
  
  if(!isMounted) return null;
  
  return (
   ...
  );
};
```

## back to Home page
```tsx
import { ContainerEl } from "@/components/ui/container-el";

const HomePage = ()=>{
    return(
        <ContainerEl>
            <div className="space-y-10 pb-10">
                <Billboard />
            </div>
        </ContainerEl>
    )
}

export default HomePage;
```
## create Billboard component
```tsx
import { Billboard } from "@/types";

interface BillboardProps {
  data: Billboard;
}

export const BillboardEl = ({ data }: BillboardProps) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 rounded-x overflow-hidden">
      <div
        className="rounded-xl relative 
              aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover"
        style={{ backgroundImage: `url(${data?.imageUrl})` }}
      >
        <div className="h-4 w-full 
        flex flex-col justify-center items-center text-center gap-y-8">
            <div className="font-bold text-3xl sm:text-5xl lg:text-6xl
              sm:max-w-xl max-w-xs">
                {data.label}
            </div>
        </div>
      </div>
    </div>
  );
};

```

## in HomePage
```tsx
export const revalidate = 0
```

## actions -> get-billboard.ts
```ts
import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`

export const getBillboard = async(id:string):Promise<Billboard>=>{
    const res = await fetch(`${URL}/${id}`);
    return res.json()
}
```

## HomePage
```tsx
import { ContainerEl } from "@/components/ui/container-el";
import { BillboardEl } from "@/components/billboard";
import { getBillboard } from "@/actions/get-billboard";

export const revalidate = 0

const HomePage = async()=>{
    const billboard = await getBillboard('7bc3010b-3ff8-4927-9da7-79d2108fe217')
    return(
        <ContainerEl>
            <div className="space-y-10 pb-10">
                <BillboardEl data={billboard}/>
            </div>
        </ContainerEl>
    )
}

export default HomePage;
```

## 8:00:40 add featured products
- add interfaces into type
```ts
export interface Product{
    id:string;
    category:Category;
    name:string;
    price:string;
    isFeatured: boolean;
    size: Size;
    color: Color;
    images: Image[];
}

export interface Image{
    id: string;
    url:string;

}

export interface Size{
    id: string;
    name:string;
    value:string;
}

export interface Color{
    id: string;
    name:string;
    value:string;
}
```
- actions -> getProducts.ts
- npm i query-string
```ts
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
```
## go to Homepage
```tsx
const products = await getProducts({isFeatured:true})
...
 <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
                <ProductList />
            </div>
            ...
```
- create ProductList component
```tsx
import { Product } from "@/types"
import { NoResult } from "./ui/no-result"

interface ProductListProps{
    title:string,
    items: Product[]
}

export const ProductList = ({
    title,
    items
}:ProductListProps)=>{
    return(
        <div className="space-y-4">
            <h3 className="font-bold text-3xl">{title}</h3>
            {items.length === 0 && <NoResult/>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
            lg:grid-cols-4 gap-4">
                {items.map(item=>(
                    <div key={item.id}>{item.name}</div>
                ))}
            </div>
        </div>
    )
}
```
## create Product Card component
```tsx
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
```

- next.config.mjs
```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:[
            "res.cloudinary.com"
        ]
    }
};

export default nextConfig;

```
- create no results component
```tsx
'use client'
export const NoResult = () => {
  return (
    <div className="flex items-center justify-center 
        h-full w-full text-neutral-500">
        No results found.
    </div>
  );
};

```
- create IconButton component
```tsx

import { cn } from "@/lib/utils"
import { MouseEventHandler } from "react";

interface IconButtonProps{
    onClickHandler?: MouseEventHandler<HTMLButtonElement> | undefined;
    className?:string;
    icon:React.ReactElement;
}

export const IconButton = ({
    onClickHandler, 
    className,
    icon
}:IconButtonProps)=>{
    return (
        <button onClick={onClickHandler} 
        className={cn('rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition', 
        className)}>
            {icon}
        </button>
    )
}
```

- create currency component
```tsx

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency', 
    currency: 'USD'
})

interface CurrencyProps{
    value?:String | number;
}

export const Currency = ({value}:CurrencyProps)=>{
    return (
        <div className="font-semibold">
            {formatter.format(Number(value))}
        </div>
    )
}
```
## 08:22:14 Individual product screen (Store)
- handle click
- router - router.push(`/product/${data?.id}`)
- create page 
- getProduct action

```ts getProduct
import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`

export const getProduct = async(id:string):Promise<Product>=>{
    const res = await fetch(`${URL}/${id}`);
    return res.json()
}
```
- Gallery component
- npm i @headlessui/react

```tsx gallery
'use client'
import { Image as ImageType } from "@/types"
import { Tab } from "@headlessui/react"
import Image from "next/image"
import { GalleryTab } from "./gallery-tab"

interface GalleryProps{
    images: ImageType[]
}


export const Gallery = ({images}:GalleryProps)=>{
    return(
       <Tab.Group as='div' className="flex flex-col-reverse ">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl 
            sm:block lg:max-w-none">
                <Tab.List className='grid grid-cols-4 gap-6'>
                    {images.map(image=>(
                        <GalleryTab key={image.id} image={image}/>
                    ))}
                </Tab.List>
            </div>
            <Tab.Panels className="aspect-square w-full">
                {images.map(image=>(
                    <Tab.Panel key={image.id}>
                        <div className="aspect-square relative h-full w-full 
                        sm:rounded-lg overflow-hidden">
                            <Image fill src={image.url} alt="gallery-img" 
                            className="object-cover object-center"/>
                        </div>
                    </Tab.Panel>
                ))}
            </Tab.Panels>
       </Tab.Group>
    )
}
```

- gallery-tab component

For example, the Tab component exposes a selected state, which tells you if the tab is currently selected.

```tsx
'use client'

import { Image as ImageType } from "@/types"
import Image from "next/image"
import { Tab } from "@headlessui/react"
import { cn } from "@/lib/utils"

interface GalleryTabProps{
    image: ImageType
}

export const GalleryTab = ({image}: GalleryTabProps)=>{
    return(
        <Tab className='relative flex aspect-square cursor-pointer items-center
        justify-center rounded-md bg-white'>
            {({selected})=>(
                <div >
                    <span className="absolute h-full w-full aspect-square
                    inset-0 overflow-hidden rounded-md">
                        <Image fill src={image.url} alt='gallery-tab-img' 
                        className="object-cover object-center"/>
                    </span>
                    <span className={cn(
                        "absolute inset-0 rounded-md ring-2 ring-offset-2",
                        selected ? 'ring-black' : 'ring-transparent'
                    )}/>
                </div>
            )}
        </Tab>
    )
}
```
- info component
```tsx
"use client";
import { Product } from "@/types";
import { Currency } from "./ui/currency";
import { useState, useEffect } from "react";
import { ButtonEl } from "./ui/button-el";
import { ShoppingCart } from "lucide-react";

interface InfoProps {
  data: Product;
}

export const Info = ({ data }: InfoProps) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <div className="text-2xl text-gray-900">
          <Currency value={data?.price} />
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Size:</h3>
          <div>{data?.size?.value}</div>
        </div>
        <div className="flex items-center gap-x-4">
          <h3 className="font-semibold text-black">Color:</h3>
          <div
            className="h-6 w-6 rounded-full border border-gray-600"
            style={{ backgroundColor: data?.color?.value }}
          />
        </div>
      </div>
      <div className="mt-10 flex items-center gap-x-3">
        <ButtonEl className="flex items-center gap-x-2">
          Add To Cart
          <ShoppingCart/>
        </ButtonEl>
      </div>
    </div>
  );
};

```
## category
- export const revalidate = 0; //no cache
- actions -> getSizes/getColors/getCategory

```tsx page
import { getProducts } from "@/actions/get-products";
import { getSizes } from "@/actions/get-sizes";
import { getColors } from "@/actions/get-colors";
import { getCategory } from "@/actions/get-category";
import { ContainerEl } from "@/components/ui/container-el";
import BillboardEl from "@/components/billboard";

export const revalidate = 0; //no cache

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    colorId: string;
    sizeId: string;
  };
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const products = await getProducts({
    categoryId: params.categoryId,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
  });

  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(params.categoryId);

  return (
    <div className="bg-white">
      <ContainerEl>
        <BillboardEl data={category.billboard} />
        <div className="px-4 sm:px-6 lg:px-8 pb-24">
          {/* mobile:filters */}
          <div className="hidden lg:block">
            <Filter />

          </div>
        </div>
      </ContainerEl>
    </div>
  );
};

export default CategoryPage;

```
- filter component

```tsx
"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import { ButtonEl } from "../ui/button-el";
import { cn } from "@/lib/utils";
import { Color, Size } from "@/types";

interface FilterProps {
  data: (Size | Color)[];
  name: string;
  valueKey: string;
}

const Filter: React.FC<FilterProps> = ({ data, name, valueKey }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id,
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">{name}</h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data.map((filter) => (
          <div key={filter.id} className="flex items-center">
            <ButtonEl
              className={cn(
                "rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300",
                selectedValue === filter.id && "bg-black text-white"
              )}
              onClick={() => onClick(filter.id)}
            >
              {filter.name}
            </ButtonEl>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
```

- buttonEl needs props...
```tsx
"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ButtonEl = forwardRef<HTMLButtonElement, ButtonProps>(
   ({
    className, 
    children,
    disabled, 
    type="button",
    ...props
   }, ref)=>{
    return(
        <button ref={ref} className={cn(`
        w-auto rounded-full bg-black border-transparent px-5 py-3 
        disabled:cursor-not-allowed disabled:opacity-50 
        text-white font-semibold hover:opacity-75 transition
        `,
        className)}
        {...props}
        >
            {children}
        </button>
    )
   } 
);

```

## mobile filter
- import { Dialog } from "@headlessui/react";
```tsx
"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Dialog } from "@headlessui/react";

import { IconButton } from "../ui/icon-button";
import { ButtonEl } from "../ui/button-el";
import { Color, Size } from "@/types";

import Filter from "./filter";

interface MobileFiltersProps {
  sizes: Size[],
  colors: Color[],
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({
  sizes,
  colors
}) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <ButtonEl
        onClick={onOpen}
        className="flex items-center gap-x-2 lg:hidden"
      >
        Filters
        <Plus size={20} />
      </ButtonEl>

      <Dialog open={open} as="div" className="relative z-40 lg:hidden" onClose={onClose}>
        
        {/* Background color and opacity */}
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        
        {/* Dialog position */}
        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative ml-auto flex h-full 
          w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
            
            {/* Close button */}
            <div className="flex items-center justify-end px-4">
              <IconButton icon={<X size={15} />} onClickHandler={onClose} />
            </div>

            <div className="p-4">
              <Filter
                valueKey="sizeId" 
                name="Sizes" 
                data={sizes}
              />
              <Filter 
                valueKey="colorId" 
                name="Colors" 
                data={colors}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

```
## create pop-up model 9:07:29
- npm install zustand

