"use client";

import React from "react";

function PolygonIdButton() {
  return (
    <>
      <div className="flex w-full bg-[#562ef4] justify-center items-center text-base font-medium px-5 py-2 border rounded-full border-neutral-600 hover:border-neutral-300 align-middle cursor-pointer">
        <button type="button">Polygon ID</button>
        <img src="/polygon-logo.png" alt="Polygon logo" className="h-5 ml-2" />
      </div>
    </>
  );
}

export default PolygonIdButton;
