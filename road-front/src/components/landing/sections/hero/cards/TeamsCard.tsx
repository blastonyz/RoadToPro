"use client";

import { ArrowDownRight, ArrowUpRight, UsersRound } from "lucide-react";
import { ReactElement, useState } from "react";

interface Step {
  number: number;
  title: string;
  description?: string;
  icon: ReactElement;
}

export function TeamsCard() {
  const [activeStep, setActiveStep] = useState(2);

  const steps: Step[] = [
    {
      number: 1,
      title: "SIGN UP",
      description: "Visit our site to join, select your squad",
      icon: <ArrowUpRight />,
    },
    {
      number: 2,
      title: "PICK A TEAM",
      description: "Visit our site to join, select your squad",
      icon: <UsersRound />,
    },
    {
      number: 3,
      title: "PASS A TEST",
      description: "Visit our site to join, select your squad",
      icon: <ArrowDownRight />,
    },
  ];

  const goUp = () => {
    setActiveStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const goDown = () => {
    setActiveStep((prev) => (prev < steps.length ? prev + 1 : prev));
  };

  return (
    <div className="col-span-2 sm:col-span-1 relative w-full max-w-md h-full bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-8 overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        id="visual"
        viewBox="0 0 200 400"
        width="200"
        height="400"
        version="1.1"
      >
        <g className="fill-gray-100/60">
          <circle r="240" cx="280" cy="200" />
          <circle
            className="stroke-gray-200"
            r="240"
            cx="280"
            cy="200"
            fill="none"
            strokeWidth="2"
            strokeDasharray="10 5"
          />

          <circle
            className="stroke-gray-200"
            r="300"
            cx="280"
            cy="200"
            fill="none"
            strokeWidth="2"
          />
        </g>
      </svg>

      <div className="relative z-10 flex flex-col justify-between ">
        <div className="flex justify-center mb-8">
          <button
            onClick={goUp}
            className="cursor-pointer w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center transition duration-200 hover:bg-gray-200"
          >
            <span className="text-xl">
              <ArrowUpRight />
            </span>
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`transition-all duration-300 ${
                activeStep === step.number ? "scale-100" : "scale-95"
              }`}
              onClick={() => setActiveStep(step.number)}
            >
              <div className="flex items-start gap-4">
                {activeStep === step.number && (
                  <div className="rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xl">{step.icon}</span>
                  </div>
                )}

                <div className="flex-1">
                  <h3
                    className={`font-bold tracking-tight ${
                      activeStep === step.number
                        ? "text-xl text-black"
                        : "text-lg text-gray-300 text-right"
                    }`}
                  >
                    {step.number}. {step.title}
                  </h3>
                  {activeStep === step.number && step.description && (
                    <p className="text-gray-500 text-sm">{step.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={goDown}
            className="cursor-pointer w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center transition duration-200 hover:bg-gray-200"
          >
            <span className="text-xl">
              <ArrowDownRight />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
