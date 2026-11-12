'use client';

import React from 'react';
import Image from 'next/image';
import HeroAnimation from '../components/HeroAnimation';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white">

      {/* =====================================================
          HERO TEXT
      ===================================================== */}

      <div className="relative z-30 mx-auto flex max-w-[1100px] flex-col items-center px-5 pt-8 text-center">

        {/* Badge */}
        <div
          className="
            mb-4
            rounded-full
            border
            border-gray-200
            bg-white
            px-4
            py-1.5
            text-[11px]
            font-medium
            text-gray-700
            shadow-sm
          "
        >
          Lean Six Sigma + Artificial Intelligence
        </div>


        {/* Heading */}
        <h1
          className="
            max-w-[850px]
            text-[42px]
            leading-[1.08]
            tracking-[-1.8px]
            text-black

            sm:text-[48px]

            md:text-[54px]

            lg:text-[58px]
          "
        >
          When Lean discipline meets{' '}

          <span className="text-[#238ED1]">
            AI
          </span>

          <br />

          <span className="text-[#238ED1]">
            precision
          </span>

          <span className="text-black">
            , transformation sticks.
          </span>
        </h1>


        {/* Description */}
        <p
          className="
            mt-5
            max-w-[610px]
            text-[14px]
            leading-[1.55]
            text-gray-600

            md:text-[15px]
          "
        >
          Most AI programs generate dashboards.{' '}

          <span className="font-semibold text-gray-800">
            Duanamize
          </span>

          {' '}generates operating models with Lean Six Sigma rigor built in from day one.
        </p>


        {/* Buttons */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">

          <button
            className="
              rounded-lg
              bg-[#238ED1]
              px-6
              py-2.5
              text-[11px]
              font-semibold
              text-white
              shadow-md
              shadow-blue-500/20
              transition
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#197dbd]
            "
          >
            Book a 30-Minute Discovery Call
          </button>


          <button
            className="
              rounded-lg
              border
              border-gray-400
              bg-white
              px-6
              py-2.5
              text-[11px]
              font-semibold
              text-gray-700
              transition
              duration-300
              hover:-translate-y-0.5
              hover:bg-gray-50
            "
          >
            Explore Our Approach
          </button>

        </div>

      </div>


      {/* =====================================================
          FLOATING CARDS
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mt-2
          h-[430px]
          w-full
          overflow-hidden
        "
      >
        <HeroAnimation />
      </div>


      {/* =====================================================
          STATS
      ===================================================== */}

      <div
        className="
          relative
          z-40
          mx-auto
          grid
          max-w-[900px]
          grid-cols-2
          gap-y-7
          px-5
          pb-12
          text-center

          md:grid-cols-4
          md:gap-10
        "
      >

        <Stat
          number="300+"
          text="Black Belts certified"
        />

        <Stat
          number="3,000+"
          text="Green Belts certified"
        />

        <Stat
          number="10,000+"
          text="Yellow Belts certified"
        />

        <Stat
          number="27+ yrs"
          text="Fortune 500 delivery"
        />

      </div>

    </section>
  );
};


const Stat = ({
  number,
  text,
}: {
  number: string;
  text: string;
}) => {
  return (
    <div>

      <div
        className="
          text-[20px]
          font-extrabold
          text-[#07548B]

          md:text-[22px]
        "
      >
        {number}
      </div>

      <div className="mt-1 text-[11px] text-gray-600">
        {text}
      </div>

    </div>
  );
};


export default HeroSection;