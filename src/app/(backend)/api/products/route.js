import { NextResponse } from "next/server";
import { products } from "./product";
import schema from "./schema";

export async function GET(req,{params}) {

    
    return NextResponse.json(products);
  
}

export async function POST(req){

    const body = await req.json()
    const validation = schema.safeParse(body)
    if(!validation.success){
        return NextResponse.json(validation.error.errors, {status: 400})
    }
return NextResponse.json({id:4, name: body.name, price:body.price}, products)
}