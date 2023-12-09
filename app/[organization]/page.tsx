import SearchForm from "@/components/SearchForm";
import React from "react";
import Link from "next/link";
import RequestCard from "@/components/RequestCard";
import { getWebsiteContent } from "@/shared/utils/storage/entityActions";
// import { useRouter } from "next/navigation";

type Params = {
  params: {
    organization: string;
  };
};

export default async function OrganizationPortal({ params }: Params) {
  let websiteContent = await getWebsiteContent();
  console.log("website content org.page", websiteContent)
  let filteredWebsiteContent: any = websiteContent.organisations.filter(
    (item) => item.name === params.organization
  );
  console.log("filtereed website content ", filteredWebsiteContent)
  let organizationData = filteredWebsiteContent[0];

  return (
    <div className="w-full h-full mx-auto px-40 py-5">
      <div className="flex items-center space-x-2 my-5">
        <img
          src={organizationData?.logoUrl}
          alt="Organization Logo"
          className="h-10 rounded-full"
        />
        <div className="text-2xl font-semibold">{organizationData?.name}</div>
      </div>
      <div className="flex justify-between">
        <SearchForm />
        <Link href={`/${params.organization}/create`}>
          <button
            type="button"
            className="text-sm font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit"
          >
            Open a Case
          </button>
        </Link>
      </div>
      <div className="flex flex-col space-y-3 my-5 w-full">
        {organizationData?.posts.map((item: any) => (
          <Link
            key={item.bountyContract}
            href={`/${params.organization}/${item.bountyContract}`}
          >
            <RequestCard
              title={item.title}
              description={item.description}
              caseDeadline={item.caseDeadline}
              caseCreator={item.caseCreator}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
