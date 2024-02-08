import { ContainerEl } from "./ui/container-el";
import { NavbarActions } from "./navbar-actions";
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
