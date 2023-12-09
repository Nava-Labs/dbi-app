"use client";

import CreateOrganizationDialog from "@/components/CreateOrganizationDialog";
import SearchForm from "@/components/SearchForm";
import { getWebsiteContent } from "@/shared/utils/storage/entityActions";
import { useState, useEffect } from "react";
import Link from "next/link";
import Quiz from "@/components/Quiz";
import useConfig from "@/shared/hooks/useConfig";
import { DBI_OFFICER_ABI } from "@/lib/abis/dbi-officer.abi";
import { useAccount, useContractRead, useNetwork } from "wagmi";

export default function Home() {
  let { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { DBI_CONTRACT, DBI_OFFICER, DBI_DEPUTY } = useConfig(chain!);

  let [websiteContent, setWebsiteContent] = useState<any>();
  let [filteredWebsiteContent, setfilteredWebsiteContent] = useState<any>();
  const [isOfficer, setIsOfficer] = useState<boolean>();

  useEffect(() => {
    let fetchWebsiteContent = async () => {
      try {
        let websiteContent = await getWebsiteContent();
        let orgByChainId = websiteContent.organisations.filter(
          (item) => +item.chainId === chain?.id
        );
        setfilteredWebsiteContent(orgByChainId);
        setWebsiteContent(websiteContent);

        console.log("websiteContent", websiteContent);
        console.log("filteredWebsiteContent", filteredWebsiteContent);
      } catch (error) {
        console.error("Failed to fetch website content:", error);
      }
    };

    fetchWebsiteContent();
  }, []);

  const {} = useContractRead({
    address: DBI_OFFICER as `0x${string}`,
    abi: DBI_OFFICER_ABI,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
    onSuccess(result) {
      if (result > BigInt(0)) {
        setIsOfficer(true);
      } else setIsOfficer(false);
    },
  });

  return (
    <div className="h-full mx-auto px-40 py-10">
      {!isOfficer && <Quiz />}
      {!!isOfficer && (
        <>
          <div className="flex justify-between items-center pb-5">
            <SearchForm />
            <CreateOrganizationDialog websiteContent={websiteContent} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredWebsiteContent?.map((item: any, index: any) => (
              <Link key={index} href={`/${item.name}`}>
                <div className="flex flex-col items-center justify-center h-64 w-[190px] transition-all p-2 border-[1px] rounded-xl border-neutral-600 hover:border-neutral-400 cursor-pointer text-base shadow-md shadow-neutral-700">
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
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
