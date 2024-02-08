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