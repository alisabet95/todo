import { NextResponse } from "next/server";
import {prisma} from "@/app/lib/prisma/client";
import schema from "../schema";



export async function GET(req, {params}) {
    const { id } = await params;
    try {
        const pro = await prisma.pros.findUnique({ where: { id: parseInt(id, 10) } });
        if (!pro) return NextResponse.json({ error: "Pro not found" });
        return NextResponse.json(pro);
    } catch (error) {
        return NextResponse.json({ error: "wrong and failed" });
    }
}


export async function PUT(req, {params}){
   try{ const body = await req.json();
    const parsed = schema.safeParse(body)

    if(!parsed.success){
        return NextResponse.json(parsed.error.errors,{status:400})
    }
   const {id} = await params;
   const proId = parseInt(id,  10)
   if(isNaN(proId)){
    return NextResponse.json({error:"invalid number"}, {status: 400})
   }
   const existingPro = await prisma.pros.findUnique({where:{id: proId}})
   if(!existingPro){
    return NextResponse.json({error:"not in database"}, {status:404})
   }
   const updatedPro = await prisma.pros.update({where:{
    id:proId
   }, data: parsed.data}) 

   return NextResponse.json(updatedPro, {status: 201})

} catch(error){
    return NextResponse.json({ error: "Failed to update product", details: error.message },
        { status: 500 })
   }
}