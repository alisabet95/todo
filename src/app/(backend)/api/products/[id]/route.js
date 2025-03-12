import { NextResponse } from "next/server";
import {prisma} from "@/app/lib/prisma/client";


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