"use client";

import React, { useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { ConnectButton } from "./button/ConnectButton";
import { cn } from "@/lib/utils";
import { getSignature } from "@/shared/utils/signatures/sign";
import useConfig from "@/shared/hooks/useConfig";
import { DBI_OFFICER_ABI } from "@/lib/abis/dbi-officer.abi";

const quiz = {
  questions: [
    {
      question: "1. Crypto hack is",
      choices: [
        "A. technique that takes advantage of a flaw or vulnerability within a system to gain unauthorized access, execute malicious code, or cause other undesirable effects. Such occurrence often lead to the theft of coins or tokens, resulting in financial losses",
        "B. With unauthorized acces, hackers pilfer digital treasures from exchanges and wallets,  capitalizing on system vulnerabilities and even social engineering tactics.",
        "C. Through phishing emails, fake projects, and enticing promises, scammers cunningly pilfer assets and sensitive information.",
      ],
      correctAnswer:
        "B. With unauthorized acces, hackers pilfer digital treasures from exchanges and wallets,  capitalizing on system vulnerabilities and even social engineering tactics.",
    },
    {
      question: "2. Crypto scam is",
      choices: [
        "A. technique that takes advantage of a flaw or vulnerability within a system to gain unauthorized access, execute malicious code, or cause other undesirable effects. Such occurrence often lead to the theft of coins or tokens, resulting in financial losses",
        "B. With unauthorized acces, hackers pilfer digital treasures from exchanges and wallets,  capitalizing on system vulnerabilities and even social engineering tactics.",
        "C. Through phishing emails, fake projects, and enticing promises, scammers cunningly pilfer assets and sensitive information.",
      ],
      correctAnswer:
        "C. Through phishing emails, fake projects, and enticing promises, scammers cunningly pilfer assets and sensitive information.",
    },
    {
      question: "3. Crypto exploit is",
      choices: [
        "A. technique that takes advantage of a flaw or vulnerability within a system to gain unauthorized access, execute malicious code, or cause other undesirable effects. Such occurrence often lead to the theft of coins or tokens, resulting in financial losses",
        "B. With unauthorized acces, hackers pilfer digital treasures from exchanges and wallets,  capitalizing on system vulnerabilities and even social engineering tactics.",
        "C. Through phishing emails, fake projects, and enticing promises, scammers cunningly pilfer assets and sensitive information.",
      ],
      correctAnswer:
        "A. technique that takes advantage of a flaw or vulnerability within a system to gain unauthorized access, execute malicious code, or cause other undesirable effects. Such occurrence often lead to the theft of coins or tokens, resulting in financial losses",
    },
  ],
};

export default function Quiz() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { DBI_CONTRACT, DBI_OFFICER, DBI_DEPUTY } = useConfig(chain!);

  const [accountNonce, setAccountNonce] = useState<bigint>();
  const [signature, setSignature] = useState("");

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean>();
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<
    number | null
  >();

  const { questions } = quiz;
  const { question, choices, correctAnswer } = questions[activeQuestion];

  const onClickNext = () => {
    setActiveQuestion((prev) => prev + 1);
    setSelectedAnswerIndex(null);
  };

  const onAnswerSelected = (answer: string, index: number) => {
    setSelectedAnswerIndex(index);
    if (answer === correctAnswer) {
      setSelectedAnswer(true);
    } else {
      setSelectedAnswer(false);
    }
  };

  const getUserSignature = async () => {
    const userSignature = await getSignature(
      DBI_OFFICER,
      address as `0x${string}`,
      accountNonce as bigint
    );
    setSignature(userSignature);
  };
  console.log("signature ", signature)

  const { data } = useContractRead({
    address: DBI_OFFICER as `0x${string}`,
    abi: DBI_OFFICER_ABI,
    functionName: "accountNonce",
    args: [address as `0x${string}`],
    onSuccess: async (result) => {
      setAccountNonce(result);
      await getUserSignature();
    },
  });

  const { config: mintOfficerBadgeConfig } = usePrepareContractWrite({
    address: DBI_OFFICER as `0x${string}`,
    abi: DBI_OFFICER_ABI,
    functionName: "mint",
    value: BigInt(0),
    args: [signature as `0x${string}`],
  });
  const { write: mintOfficerBadge } = useContractWrite({
    ...mintOfficerBadgeConfig,
  });

  return (
    <div className="h-full w-full justify-center items-center mx-auto inset-0">
      {!isConnected && <ConnectButton />}
      {!!isConnected && (
        <div className="w-full mt-4 space-y-4 lg:mt-0">
          <div className="border-y border-neutral-600 text-base md:rounded-xl md:border">
            <div className="group flex justify-between rounded-t-none border-b border-neutral-600 px-4 pb-[12px] pt-3 md:rounded-t-lg">
              <h4 className="flex items-center font-semibold">Quiz</h4>
            </div>
            <div className="p-4 leading-5 sm:leading-6">
              <div>
                <h2 className="text-base font-medium">{question}</h2>
                <ul className="flex flex-col w-full space-y-2 justify-center items-center cursor-pointer my-2">
                  {choices.map((answer, index) => (
                    <li
                      onClick={() => onAnswerSelected(answer, index)}
                      key={answer}
                      className={cn(
                        "w-full text-md text-center font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit",
                        selectedAnswerIndex === index && selectedAnswer === true
                          ? "bg-green-500"
                          : ""
                      )}
                    >
                      {answer}
                    </li>
                  ))}
                </ul>
                {activeQuestion !== questions.length - 1 && (
                  <button
                    onClick={onClickNext}
                    disabled={selectedAnswer === false}
                    className="right-0 text-sm font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit"
                  >
                    Next
                  </button>
                )}
                {activeQuestion === questions.length - 1 && (
                  <button
                    onClick={() => mintOfficerBadge?.()}
                    disabled={selectedAnswer === false && !mintOfficerBadge}
                    className="right-0 text-sm font-medium px-5 py-3 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle bg-inherit"
                  >
                    Mint an Officer Badge
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
