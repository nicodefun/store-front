
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