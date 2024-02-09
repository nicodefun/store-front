import { ContainerEl } from "@/components/ui/container-el";
import { BillboardEl } from "@/components/billboard";
import { getBillboard } from "@/actions/get-billboard";
import { getProducts } from "@/actions/get-products";
import { ProductList } from "@/components/product-list";

export const revalidate = 0;

const HomePage = async () => {
  const billboard = await getBillboard("7bc3010b-3ff8-4927-9da7-79d2108fe217");
  const products = await getProducts({ isFeatured: true });
  return (
    <ContainerEl>
      <div className="space-y-10 pb-10">
        <BillboardEl data={billboard} />

        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </ContainerEl>
  );
};

export default HomePage;
