import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const number = searchParams.get("num");

    if (!number) {
        return NextResponse.json({ error: "Number parameter is missing" }, { status: 400 });
    }

    const parsed = parseInt(number);

    if (isNaN(parsed)) {
        return NextResponse.json({ error: "Invalid number" }, { status: 400 });
    }

    const isPrime = (num) => {
        if (num <= 1) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    };

    const result = parsed % 2 === 0 ? "even" : "odd";
    const prime = isPrime(parsed) ? "Prime" : "Not Prime";

    return NextResponse.json({ result: result, prime: prime });
}
