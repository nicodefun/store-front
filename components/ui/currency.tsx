'use client'

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