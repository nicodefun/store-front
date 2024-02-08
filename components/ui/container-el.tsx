

interface ContainerElProps{
    children: React.ReactNode
}

export const ContainerEl = ({children}:ContainerElProps)=>{
    return(
        <div className="mx-auto max-w-7xl">
            {children}
        </div>
    )
}