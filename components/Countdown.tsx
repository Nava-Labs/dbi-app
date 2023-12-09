"use client";

import React, { useState, useEffect } from "react";

interface CountdownProps {
  epochInSeconds: number;
}

const Countdown: React.FC<CountdownProps> = ({ epochInSeconds }) => {
  const calculateTimeLeft = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    const difference = epochInSeconds - currentTime;

    // Convert seconds to days
    const timeLeft = Math.floor(difference / (60 * 60 * 24));

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 86400000);

    return () => clearTimeout(timer);
  }, [timeLeft, epochInSeconds]);

  if (timeLeft <= 0) {
    return <span>Ended</span>;
  }

  return (
    <span>
      Ends in {timeLeft} day{timeLeft !== 1 ? "s" : ""}
    </span>
  );
};

export default Countdown;
