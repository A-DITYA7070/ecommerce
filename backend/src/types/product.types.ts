
export interface NewProductRequestBody {
    name:string;
    price:number;
    stock:number;
    category:string;
}


export type SearchRequestQuery = {
    search ?: string;
    price ?: string;
    category ?: string;
    sort ?: string;
    page ?: string;
}


export interface baseQuery {
    name ?: {
        $regex:string;
        $options:string;
    };
    price ?: {
        $lte:number;
    };
    category ?: string;
}


