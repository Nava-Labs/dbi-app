import {
  ArrowUpTrayIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { getWebsiteContent } from "@/shared/utils/storage/entityActions";
import SubmitReport from "@/components/SubmitReport";
import CustomPushChat from "@/components/CustomPushChat";
import PushSpace from "@/components/PushSpace";

export default async function RequestDetails(params: any) {
  const websiteContent = await getWebsiteContent();
  const orgsName = params.params.organization;
  const orgsData = websiteContent.organisations.filter(
    (item) => item.name === orgsName
  );
  console.log("orgs data ", orgsData);
  console.log("website content ", websiteContent);
  const caseId = params.params.id;
  const caseData = orgsData[0].posts.filter(
    (item) => item.bountyContract === caseId
  );
  const requestDeadline = new Date(
    caseData[0].caseDeadline * 1000
  ).toLocaleDateString();
  const currentEpoch = Math.floor(Date.now() / 1000);

  console.log("caseData", caseData);

  // const groupChatId =
  //   "ca21ff2388999fe0e254248a8a194a8ce98f79ec072c20cf74e5cd016474ca2f"; //BRB group
  const groupChatId =
    "e9e4907d408aa0b330f1d2d9060aad3f76733ad084d13156f0b2c1c6818a2c93"; //gated group

  return (
    <div className="h-full mx-auto px-40 py-10">
      <div className="flex">
        <div className="w-full">
          <div className="flex">
            <div id="Left content" className="w-full lg:w-2/3 lg:pr-5">
              <h1
                id="Request title"
                className="mb-3 break-words text-2xl leading-8 font-bold"
              >
                {caseData[0].title}
              </h1>

              <div
                id="Request status"
                className="flex justify-between items-center mb-5"
              >
                {caseData[0].caseDeadline > currentEpoch && (
                  <div className="text-sm font-medium px-5 py-2 rounded-full align-middle bg-green-500">
                    On Going
                  </div>
                )}
                {caseData[0].caseDeadline < currentEpoch && (
                  <div className="text-sm font-medium px-5 py-2 rounded-full align-middle bg-red-500">
                    Ended
                  </div>
                )}
                <div className="flex items-center">
                  <button
                    // onClick={() =>
                    //   navigator.clipboard.writeText(window.location.toString())
                    // }
                    className="flex justify-center items-center text-neutral-400 hover:text-neutral-300"
                  >
                    <ArrowUpTrayIcon className="h-4 mr-1" />
                    <span className="text-sm font-medium align-middle">
                      Share
                    </span>
                  </button>
                  <EllipsisHorizontalIcon className="h-10 ml-2 text-neutral-400 hover:text-neutral-300 cursor-pointer" />
                </div>
              </div>

              <div className="text-neutral-300 font-medium">
                {caseData[0].description}
              </div>
            </div>
            <div id="Right content" className="w-full lg:w-1/3">
              <div className="mt-4 space-y-4 lg:mt-0">
                <div className="border-y border-neutral-600 text-base md:rounded-xl md:border">
                  <div className="group flex justify-between rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
                    <h4 className="flex items-center font-semibold">
                      Information
                    </h4>
                  </div>

                  <div className="p-4 leading-5 sm:leading-6">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-sm align-middle">
                        <span className="text-neutral-400 font-semibold">
                          Amount stolen
                        </span>
                        <div className="space-x-2">
                          {caseData[0].stolenAmount.map((item, index) => (
                            <span key={index}>{item}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm align-middle">
                        <span className="text-neutral-400 font-semibold">
                          Token stolen
                        </span>
                        <div className="space-x-2">
                          {caseData[0].stolenTokenAddress.map((item, index) => (
                            <span key={index} className="font-medium">
                              {(item ===
                                "0xF03274e634997f108786339cc9679498D323e214" &&
                                "$UNI") ||
                                (item ===
                                  "0xC769E60549E04ceaE55410780f6733eBa0747a33" &&
                                  "$1INCH") ||
                                (item ===
                                  "0xcd65d10926CeA6c0de2F20aa2a175968EB00Bb6b" &&
                                  "$YFI")}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm align-middle">
                        <span className="text-neutral-400 font-semibold">
                          Request deadline
                        </span>
                        <span className="font-medium">{requestDeadline}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm align-middle">
                        <span className="text-neutral-400 font-semibold">
                          Bounty offered
                        </span>
                        <span className="font-medium">
                          {caseData[0].bountyOffered / 100}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <SubmitReport
                organizations={websiteContent.organisations}
                bountyContract={caseData[0].bountyContract as `0x${string}`}
              />
            </div>
          </div>
        </div>
      </div>
      {!!caseData[0].breadcrumbsUrl && (
        <div className="w-full h-full mt-3">
          <div className="border-y border-neutral-600 text-base md:rounded-xl md:border">
            <div className="group flex justify-between rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
              <h4 className="flex items-center font-semibold">Breadcrumbs</h4>
            </div>

            <div className="p-4 leading-5 sm:leading-6">
              <iframe
                src={caseData[0].breadcrumbsUrl}
                title="VB"
                width="250"
                height="100"
                className="h-96 w-full rounded-lg"
              ></iframe>{" "}
            </div>
          </div>
          <CustomPushChat
            groupChatId={caseData[0].pushPublicGroupId}
            organizations={websiteContent.organisations}
            pushSpaceId={caseData[0].pushSpaceId}
            privateChatId={caseData[0].pushPrivateGroupId}
            hackerAddr={caseData[0].hackerAddr}
          />

        </div>
      )}
    </div>
  );
}
