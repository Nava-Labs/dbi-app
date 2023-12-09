import { ConnectButton } from "@/components/button/ConnectButton";
import { TwitterLogin } from "@/components/button/TwitterLoginButton";
import OpenCaseForm from "@/components/OpenCaseForm";
import {
  getWebsiteContent,
  purgeCurrentIpnsData,
} from "@/shared/utils/storage/entityActions";

export default async function CreateCase(params: any) {
  let websiteContent = await getWebsiteContent();

  return (
    <div className="h-full w-full mx-auto px-40 py-10">
      <div className="flex">
        <div className="w-full">
          <div className="flex">
            <OpenCaseForm
              websiteContent={websiteContent}
              orgName={params.params.organization}
            />
            <div id="Right content" className="w-full lg:w-1/3">
              <div className="mt-4 space-y-4 lg:mt-0">
                <div className="border-y border-neutral-600 text-base md:rounded-xl md:border">
                  <div className="group flex justify-between rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
                    <h4 className="flex items-center font-semibold">
                      Connect & Authenticate
                    </h4>
                  </div>

                  <div className="p-4 leading-5 sm:leading-6 space-y-2">
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
