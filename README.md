## install
- npm i clsx tailwind-merge
- npx create-next-app@latest ecommerce-store --typescript --tailwind --eslint
- npm i lucide-react
- npm i @headlessui/react
- npm install zustand
- npm i react-hot-toast
- npm i axios

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
- hooks -> usePreviewModal
```ts
import {create} from 'zustand'
import { Product } from '@/types'

interface PreviewModalStore{
    isOpen:boolean;
    data?:Product;
    onOpen: (data:Product)=>void;
    onClose:()=>void;
}

const usePreviewModal = create<PreviewModalStore>(set=>({
    isOpen:false,
    data:undefined,
    onOpen:(data:Product) =>set({
        data:data, 
        isOpen:true
    }),
    onClose:()=>set({
        isOpen:false
    })
}))

export default usePreviewModal;
```
- create ui -> modal.tsx
- import { Transition } from "@headlessui/react"
```tsx
"use client";

import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import { IconButton } from "./icon-button";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
  return (
    <Transition show={open} appear as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 overflow-auto">
          <div
            className="flex min-h-full items-center justify-center
                    p-4 text-center"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-50 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl overflow-hidden rounded-lg text-left align-middle">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <div className="absolute right-4 top-4">
                    <IconButton onClickHandler={onClose} icon={<X size={15} />} />
                  </div>
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

```
## create preview-modal 
```tsx
import usePreviewModal from "@/hooks/use-preview-modal";
import { Modal } from "./ui/modal";
import { Gallery } from "./gallery";
import { Info } from "./info";

export const PreviewModal = () => {
  const previewModal = usePreviewModal();
  const product = usePreviewModal((state) => state.data);
  if (!product) return null;
  return (
    <Modal 
    open={previewModal.isOpen} 
    onClose={previewModal.onClose}>
        <div className="grid w-full grid-cols-1 items-start 
        gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
            <div className="sm:col-span-4 lg:col-span-5">
                <Gallery images={product.images}/>
            </div>
            <div className="sm:col-span-8 lg:col-span-7">
                <Info data={product}/>
            </div>
        </div>
    </Modal>
  );
};

```
- create Modal Provider 
```tsx
"use client";
import { PreviewModal } from "@/components/preview-modal";
import { useState, useEffect } from "react";

const ModalProvider = () => {
  const [mounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!mounted) return null;
  return <>
  <PreviewModal/>
  </>;
};

export default ModalProvider;

```
- add modalProvider into root layout
```tsx
 return (
    <html lang="en">
      <body className={font.className}  suppressHydrationWarning={true}>
        <ModalProvider/>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
```
- go to ProductCard
```tsx
import usePreviewModal from "@/hooks/use-preview-modal"
import { MouseEventHandler } from "react"
...
 const previewModal = usePreviewModal();

    const onPreview:MouseEventHandler<HTMLButtonElement> = (event)=>{
        event.stopPropagation(); //overwrite the main div's onClick
        previewModal.onOpen(data);
    }
    ...
 <IconButton onClickHandler={onPreview}
                        icon={<Expand size={20} className="text-gray-600"/>}
                        />
...
```
## 09:20:29 Add to Cart functionality (Store)
- npm i react-hot-toast
```tsx toast-provider
'use client'

import { Toaster } from "react-hot-toast"

const ToastProvider = () => {
  return (
   <Toaster/>
  )
}

export default ToastProvider

```
- add this into layout
- create hooks -> use-cart.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

```ts
import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from "zustand/middleware"; 

import { Product } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>((set, get) => ({
  items: [],
  addItem: (data: Product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.id === data.id);
    
    if (existingItem) {
      return toast('Item already in cart.');
    }

    set({ items: [...get().items, data] });
    toast.success('Item added to cart.');
  },
  removeItem: (id: string) => {
    set({ items: [...get().items.filter((item) => item.id !== id)] });
    toast.success('Item removed from cart.');
  },
  removeAll: () => set({ items: [] }),
}), {
  name: 'cart-storage',
  storage: createJSONStorage(() => localStorage)
}));

export default useCart;

```
- use this in navbar-actions
```tsx
...
const cart = useCart();
...
  <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
```
- use it in product-card 
```tsx
 const onAddToCart:MouseEventHandler<HTMLButtonElement> = (event)=>{
        event.stopPropagation(); //overwrite the main div's onClick
        cart.addItem(data);
    }
```

- back to navbar-action -> router
```tsx
  <ButtonEl onClick={()=>router.push('/cart')} className="flex items-center rounded-full bg-black px-4 py-2">
        <ShoppingBag size={20} color="white" />
```
## create cart page
```tsx
"use client";
import React from "react";
import { useState, useEffect } from "react";
import { ContainerEl } from "@/components/ui/container-el";
import useCart from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";


const CartPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();

  if (!isMounted) return null;
  return (
    <div className="bg-white">
      <ContainerEl>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Shopping Cart</h1>
          <div className="mt-12 lg:grid w-full lg:items-start gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && <p className="text-neutral-500">No items added to cart.</p>}
              <ul>
                {cart.items.map((item) => (
                  <CartItem key={item.id} data={item} />
                ))}
              </ul>
            </div>
            <Summary />
          </div>
        </div>
      </ContainerEl>
    </div>
  );
};

export default CartPage;

```
- create summary component
- npm i axios
```tsx
"use client";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonEl } from "./ui/button-el";
import { Currency } from "./ui/currency";
import toast from "react-hot-toast";
import useCart from "@/hooks/use-cart";

interface SummaryProps {}

const Summary = () => {
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const searchParams = useSearchParams();

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`, 
      {productIds: items.map(item=> item.id)} //pass data
    );
    window.location = response.data.url
  };

  return (
    <div
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 
      sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <ButtonEl
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </ButtonEl>
    </div>
  );
};

export default Summary;

```
So, in summary, if the URL contains a query parameter named 'success', the useEffect hook will trigger, and the toast.success('payment completed') function will be called, displaying a success message to the user. This mechanism could be used to provide feedback to the user after a successful action, such as completing a payment or submitting a form.
```tsx
"use client";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonEl } from "./ui/button-el";
import { Currency } from "./ui/currency";
import toast from "react-hot-toast";
import useCart from "@/hooks/use-cart";

interface SummaryProps {}

const Summary = () => {
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const searchParams = useSearchParams();

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price);
  }, 0);

  useEffect(()=>{
    if(searchParams.get('success')) {
        toast.success('payment completed')
        removeAll();
    }
    if(searchParams.get('canceled')){
        toast.error('Something went wrong')
    }
  }, [searchParams, removeAll])

  const onCheckout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/checkout`, 
      {productIds: items.map(item=> item.id)} //pass data
    );
    window.location = response.data.url
  };

  return (
    <div
      className="mt-16 rounded-lg bg-gray-50 px-4 py-6 
      sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <ButtonEl
        onClick={onCheckout}
        disabled={items.length === 0}
        className="w-full mt-6"
      >
        Checkout
      </ButtonEl>
    </div>
  );
};

export default Summary;

```
## 9:46:14 Stripe Setup & Checkout finalization (Admin, Store)  