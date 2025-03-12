import { NextResponse } from "next/server";
import { z } from "zod";
import schema from "./schema";
import { prisma } from "@/app/lib/prisma/client";

const ValidatedZod = z.object({
    title: z.string().min(2,"title is required").max(50,"too long")
})


export async function GET(req) {
    try{
   const pros = await prisma.pros.findMany()
   return NextResponse.json(pros)
    }catch(error){
        return NextResponse.json({error: "wrong and failed"})
    }
   
  
}

export async function POST(req){
    try{
    const body = await req.json()
    const parsed = ValidatedZod.safeParse(body)
    if (!parsed.success){
        return NextResponse.json({ error: "Invalid data.", details: parsed.error.errors }, { status: 400 });

    }
    const {title} = parsed.data
    const newPro = await prisma.pros.create({
        data: {title} 
    })
    return NextResponse.json(newPro,{status: 201})}
    catch(error){
       return NextResponse.json({error:"Failed to create"})
    }

}

export async function DELETE(req){
   try{
    const {id} = await req.json()
    if (!id){
        return NextResponse.json({error:"ID required"},{status: 400})
    }
    const product = await prisma.pros.findUnique({where: {id}})
    if(!product){
        return NextResponse.json({error:"not found"},{status: 401})
    }
    await prisma.pros.delete({where: {id}})
    return NextResponse.json({message:"Deleted :)"},{status:200})

   }catch(error){
    return NextResponse.json({error:"Failed to delete"},{status:500})
   }

}