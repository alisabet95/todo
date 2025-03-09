import { NextResponse, NextRequest } from "next/server";
import { photos } from "../photos";

export async function GET(req, { params }) {
    const { id } = await params;
    if (id > 5 || id < 1) {
        return NextResponse.json({error:"not found"},{status: 404});
    }
    const photo = photos.find(photo => photo.id === parseInt(id));
    return NextResponse.json(photo);
}

export async function POST(req, {params}) {

    const body = await req.json()
    const {id} = await params;
   
    
    
    return NextResponse.json({body, id})

  }