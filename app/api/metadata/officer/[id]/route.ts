import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    name: "DBI POAP Officer",
    description: "The DBI badge is a token of appreciation to contributors and participants that help safeguarding protocols across the web3 space.",
    image: "ipfs://bafkreicrvhwbmzidjoc6tcoaj5aqdemouyjxlkpx4zwtd3hqkznpvyc3na",
  })
}