// @ts-nocheck

import { useState, useEffect, Fragment } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";

import { io } from "socket.io-client";
import { Dialog, Transition } from "@headlessui/react";

const linkDownloadPolygonIDWalletApp =
  "https://0xpolygonid.github.io/tutorials/wallet/wallet-overview/#quick-start";

function PolygonIDVerifier({
  credentialType,
  issuerOrHowToLink,
  onVerificationResult,
  publicServerURL,
  localServerURL,
}: any) {
  console.log("hi inised");
  // const {isOpen, onOpen, onClose } = useDisclosure();

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  const [sessionId, setSessionId] = useState("");
  const [qrCodeData, setQrCodeData] = useState<any>();
  const [isHandlingVerification, setIsHandlingVerification] = useState(false);
  const [verificationCheckComplete, setVerificationCheckComplete] =
    useState(false);
  const [verificationMessage, setVerfificationMessage] = useState("");
  const [socketEvents, setSocketEvents] = useState([]);

  // serverUrl is localServerURL if not running in prod
  // Note: the verification callback will always come from the publicServerURL
  const serverUrl = window.location.href.startsWith("https")
    ? publicServerURL
    : localServerURL;

  const getQrCodeApi = (sessionId: any) =>
    serverUrl + `/api/get-auth-qr?sessionId=${sessionId}`;

  const socket = io(serverUrl);
  console.log(socket);

  useEffect(() => {
    socket.on("connect", () => {
      setSessionId(socket.id);

      // only watch this session's events
      socket.on(socket.id, (arg) => {
        setSocketEvents((socketEvents: any[]) => [...socketEvents, arg]);
      });
    });
  }, []);

  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetch(getQrCodeApi(sessionId));
      const data = await response.text();
      return JSON.parse(data);
    };

    if (sessionId) {
      fetchQrCode().then(setQrCodeData).catch(console.error);
    }
  }, [sessionId]);

  // socket event side effects
  useEffect(() => {
    if (socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];

      if (currentSocketEvent.fn === "handleVerification") {
        if (currentSocketEvent.status === "IN_PROGRESS") {
          setIsHandlingVerification(true);
        } else {
          setIsHandlingVerification(false);
          setVerificationCheckComplete(true);
          if (currentSocketEvent.status === "DONE") {
            setVerfificationMessage("✅ Verified proof");
            setTimeout(() => {
              reportVerificationResult(true);
            }, 2000);
            socket.close();
          } else {
            setVerfificationMessage("❌ Error verifying VC");
          }
        }
      }
    }
  }, [socketEvents]);

  // callback, send verification result back to app
  const reportVerificationResult = (result: any) => {
    onVerificationResult(result);
  };

  function openInNewTab(url: any) {
    var win = window.open(url, "_blank");
    win!.focus();
  }

  return (
    <>
      <div className="inset-0 flex items-center justify-center">
        {sessionId ? (
          <Button
            colorScheme="purple"
            onClick={() => setIsOpen(true)}
            margin={4}
          >
            {verificationMessage === "✅ Verified proof"
              ? "Verified"
              : "Polygon ID"}
          </Button>
        ) : (
          <Spinner />
        )}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {qrCodeData && (
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-900 p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Scan this QR code from your{" "}
                      <a
                        href={linkDownloadPolygonIDWalletApp}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Polygon ID Wallet App to prove access rights
                      </a>{" "}
                    </Dialog.Title>

                    <div className="mt-4">
                      {isHandlingVerification && (
                        <div>
                          <p>Authenticating...</p>
                          <Spinner size={"xl"} colorScheme="purple" my={2} />
                        </div>
                      )}
                      <div className="flex justify-center items-center text-xl py-5">
                        {verificationMessage}
                      </div>
                      {qrCodeData &&
                        !isHandlingVerification &&
                        !verificationCheckComplete && (
                          <Center marginBottom={1}>
                            <div className="p-2 bg-white">
                              <QRCode value={JSON.stringify(qrCodeData)} />
                            </div>
                          </Center>
                        )}

                      {qrCodeData.body?.scope[0].query && (
                        <p className="flex justify-center text-sm">
                          Type: {qrCodeData.body?.scope[0].query.type}
                        </p>
                      )}

                      {qrCodeData.body.message && (
                        <p className="flex justify-center text-sm">
                          {qrCodeData.body.message}
                        </p>
                      )}

                      {qrCodeData.body.reason && (
                        <p className="flex justify-center text-sm">
                          Reason: {qrCodeData.body.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex mt-2">
                      <button
                        className="text-xs font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit"
                        onClick={() =>
                          openInNewTab(linkDownloadPolygonIDWalletApp)
                        }
                      >
                        Download the Polygon ID Wallet App{" "}
                        <ExternalLinkIcon marginLeft={2} />
                      </button>
                      <button
                        className="text-xs font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit"
                        onClick={() => openInNewTab(issuerOrHowToLink)}
                      >
                        Get a {credentialType} VC{" "}
                        <ExternalLinkIcon marginLeft={2} />
                      </button>
                    </div>
                  </Dialog.Panel>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default PolygonIDVerifier;
