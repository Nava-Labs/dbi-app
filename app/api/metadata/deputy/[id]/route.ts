import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    name: "DBI POAP Deputy",
    description: "The DBI badge is a token of appreciation to contributors and participants that help safeguarding protocols across the web3 space.",
    image: "ipfs://bafybeiaegdmc22rz646yfevgdmiq75p336epfe5ibhgzt77ca26povg7dm"
  })
}