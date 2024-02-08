## install
- npm i clsx tailwind-merge
- npx create-next-app@latest ecommerce-store --typescript --tailwind --eslint
- npm i lucide-react

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

## 8:00:40

