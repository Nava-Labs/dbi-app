"use client";

import { cn } from "@/lib/utils";
import { useSession, signIn, signOut } from "next-auth/react";
import { useAccount } from "wagmi";

export function TwitterLogin() {
  const { data: session, status } = useSession();
  const { isConnected } = useAccount();

  return (
    <>
      {status !== "authenticated" && (
        <div
          className={cn(
            "flex w-full justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer",
            !isConnected && "greyscale"
          )}
        >
          <button
            type="button"
            onClick={() => signIn()}
            disabled={!isConnected}
          >
            Sign in with
          </button>
          <img src="/logo-white.png" alt="X logo" className="h-3 ml-2" />
        </div>
      )}
      {status === "authenticated" && (
        <>
          <div
            onClick={() => signOut()}
            className="flex w-full justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer"
          >
            <img
              src={session.user?.image as string}
              className="h-5 mr-1 rounded-full"
            />
            {session.user?.name}
          </div>
        </>
      )}
    </>
  );
}
