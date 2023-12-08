"use client";

const organization = [
  {
    name: "Aave",
    logoUrl: "https://cdn.stamp.fyi/space/aave.eth?s=96&cb=c1026072cf0a6c54",
  },
  {
    name: "Shell Protocol",
    logoUrl:
      "https://cdn.stamp.fyi/space/shellprotocol.eth?s=96&cb=b632534a322a3596",
  },
  {
    name: "Sushi",
    logoUrl:
      "https://cdn.stamp.fyi/space/sushigov.eth?s=96&cb=aeaf858103dbc634",
  },
  {
    name: "Balancer",
    logoUrl:
      "https://cdn.stamp.fyi/space/balancer.eth?s=96&cb=f07b6ca4e700c150",
  },
  {
    name: "Radiant Capital",
    logoUrl:
      "https://cdn.stamp.fyi/space/radiantcapital.eth?s=96&cb=12927c90168b0f87",
  },
  {
    name: "Hop Protocol",
    logoUrl: "https://cdn.stamp.fyi/space/hop.eth?s=96&cb=0a687c9504ef864b",
  },
  {
    name: "1Inch Network",
    logoUrl: "https://cdn.stamp.fyi/space/1inch.eth?s=96&cb=d3a5b0a6de310910",
  },
  {
    name: "Lido DAO",
    logoUrl:
      "https://cdn.stamp.fyi/space/lido-snapshot.eth?s=96&cb=59735609c15c8638",
  },
];

export default function Home() {
  return (
    <div className="h-full mx-auto px-40 py-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {organization.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center h-64 w-[190px] transition-all p-2 border-[1px] rounded-xl border-neutral-600 hover:border-neutral-400 cursor-pointer text-base shadow-md shadow-neutral-700"
          >
            <div className="w-full p-4 leading-5 sm:leading-6">
              <div className="flex items-center justify-center mb-2">
                <img
                  src={item.logoUrl}
                  alt="Organization Logo"
                  className="rounded-full bg-neutral-900 object-cover h-20 w-20 mb-1"
                />
              </div>
              <div className="flex flex-col items-center justify-center truncate">
                <div className="mb-0 mt-0 h-[32px] overflow-hidden pb-0 text-lg font-medium">
                  {item.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
