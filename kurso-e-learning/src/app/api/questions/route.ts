import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    const reponse = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")

    const data = await reponse.json();

    return NextResponse.json(data);
}