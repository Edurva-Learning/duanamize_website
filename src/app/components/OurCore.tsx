// "use client";

// import Image from "next/image";
// import { Brain, CheckCircle2, Database, Server, Cpu } from "lucide-react";

// const services = [
//   {
//     name: "AI & Machine Learning",
//     icon: Brain,
//     color: "bg-blue-600",
//     image: "/images/ai-machine-learning.jpg",
//   },
//   {
//     name: "Data Engineering",
//     icon: Database,
//     color: "bg-purple-600",
//     image: "/images/data-engineering.jpg",
//   },
//   {
//     name: "Industry 4.0",
//     icon: Cpu,
//     color: "bg-yellow-500",
//     image: "/images/industry-4.jpg",
//   },
//   {
//     name: "Technology",
//     icon: Server,
//     color: "bg-blue-500",
//     image: "/images/technology.jpg",
//   },
// ];

// export default function ServicesSection() {
//   return (
//     <section className="w-full bg-[#f8fafc] py-16">

//       {/* MAIN CONTAINER */}
//       <div className="mx-auto w-full max-w-[1060px] px-5">

//         {/* =====================================================
//             SERVICE ICON NAVIGATION
//         ====================================================== */}

//         <div className="mb-3 flex items-end justify-center gap-8">

//           {services.map((service, index) => {
//             const Icon = service.icon;
//             const active = index === 0;

//             return (
//               <div
//                 key={service.name}
//                 className="flex flex-col items-center"
//               >

//                 {/* Active label */}
//                 {active && (
//                   <div
//                     className="
//                       mb-1
//                       rounded-md
//                       border
//                       border-gray-300
//                       bg-white
//                       px-2
//                       py-1
//                       text-[11px]
//                       font-medium
//                       text-gray-700
//                       shadow-sm
//                     "
//                   >
//                     Advertiser Tracker
//                   </div>
//                 )}

//                 {/* Icon */}
//                 <div
//                   className={`
//                     flex
//                     items-center
//                     justify-center
//                     rounded-2xl
//                     ${service.color}
//                     ${
//                       active
//                         ? "h-[66px] w-[66px] shadow-lg"
//                         : "h-[42px] w-[42px]"
//                     }
//                   `}
//                 >
//                   <Icon
//                     className={
//                       active
//                         ? "h-8 w-8 text-white"
//                         : "h-5 w-5 text-white"
//                     }
//                   />
//                 </div>

//               </div>
//             );
//           })}

//         </div>


//         {/* =====================================================
//             MAIN SERVICE CARD
//         ====================================================== */}

//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-slate-200
//             bg-white
//             p-3
//             shadow-[0_8px_30px_rgba(15,23,42,0.08)]
//           "
//         >

//           <div
//             className="
//               grid
//               min-h-[405px]
//               grid-cols-1
//               gap-3

//               md:grid-cols-[34%_66%]
//             "
//           >

//             {/* =================================================
//                 LEFT CONTENT
//             ================================================= */}

//             <div
//               className="
//                 flex
//                 flex-col
//                 rounded-lg
//                 bg-white
//                 p-5
//                 shadow-[0_6px_20px_rgba(15,23,42,0.12)]
//               "
//             >

//               {/* Icon + Price */}
//               <div className="flex items-start justify-between">

//                 <div
//                   className="
//                     flex
//                     h-[38px]
//                     w-[38px]
//                     items-center
//                     justify-center
//                     rounded-lg
//                     bg-blue-600
//                   "
//                 >
//                   <Brain className="h-5 w-5 text-white" />
//                 </div>

//                 <span
//                   className="
//                     rounded-full
//                     bg-blue-50
//                     px-2.5
//                     py-1
//                     text-[10px]
//                     font-medium
//                     text-blue-600
//                   "
//                 >
//                   From $15K/month
//                 </span>

//               </div>


//               {/* Title */}
//               <h3
//                 className="
//                   mt-5
//                   text-[17px]
//                   font-semibold
//                   tracking-tight
//                   text-slate-900
//                 "
//               >
//                 AI & Machine Learning
//               </h3>


//               {/* Description */}
//               <p
//                 className="
//                   mt-1.5
//                   text-[12px]
//                   leading-[1.5]
//                   text-slate-500
//                 "
//               >
//                 Complete AI lifecycle management from data curation to
//                 model deployment and scaling.
//               </p>


//               {/* Key Capabilities */}
//               <div className="mt-5">

//                 <div
//                   className="
//                     mb-2
//                     flex
//                     items-center
//                     gap-1.5
//                     text-[12px]
//                     font-semibold
//                     text-slate-700
//                   "
//                 >
//                   <span className="text-blue-500">◎</span>
//                   Key Capabilities
//                 </div>

//                 <div className="space-y-1.5">

//                   {[
//                     "Data set gathering & curation",
//                     "AI model training & optimization",
//                     "Backend operations & infrastructure",
//                     "MLOps & automated pipelines",
//                   ].map((item) => (
//                     <div
//                       key={item}
//                       className="
//                         flex
//                         items-center
//                         gap-2
//                         text-[11px]
//                         text-slate-500
//                       "
//                     >
//                       <CheckCircle2
//                         className="h-3.5 w-3.5 shrink-0 text-green-500"
//                       />

//                       {item}
//                     </div>
//                   ))}

//                 </div>

//               </div>


//               {/* Technologies */}
//               <div className="mt-4">

//                 <div
//                   className="
//                     mb-2
//                     flex
//                     items-center
//                     gap-1.5
//                     text-[12px]
//                     font-semibold
//                     text-slate-700
//                   "
//                 >
//                   <span className="text-blue-500">ϟ</span>
//                   Technologies
//                 </div>


//                 <div className="flex flex-wrap gap-1.5">

//                   {[
//                     "TensorFlow",
//                     "PyTorch",
//                     "Kubernetes",
//                     "AWS SageMaker",
//                   ].map((tech) => (
//                     <span
//                       key={tech}
//                       className="
//                         rounded-full
//                         border
//                         border-slate-200
//                         bg-white
//                         px-2
//                         py-0.5
//                         text-[9px]
//                         font-medium
//                         text-slate-700
//                       "
//                     >
//                       {tech}
//                     </span>
//                   ))}

//                 </div>

//               </div>


//               {/* Learn More */}
//               <button
//                 className="
//                   mt-auto
//                   flex
//                   h-[34px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-md
//                   bg-gradient-to-r
//                   from-[#238ED1]
//                   to-[#07548B]
//                   text-[11px]
//                   font-medium
//                   text-white
//                   transition
//                   hover:opacity-90
//                 "
//               >
//                 Learn More

//                 <span className="text-sm">
//                   →
//                 </span>
//               </button>

//             </div>


//             {/* =================================================
//                 RIGHT IMAGE
//             ================================================= */}

//             <div
//               className="
//                 relative
//                 min-h-[405px]
//                 overflow-hidden
//                 rounded-lg
//                 bg-slate-100
//               "
//             >

//               <Image
//                 src="/logos/image.jpg"
//                 alt="AI and Machine Learning"
//                 fill
//                 className="object-cover"
//               />

//             </div>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// }

"use client";

import Image from "next/image";
import { Brain, CheckCircle2, Database, Server, Cpu } from "lucide-react";

const services = [
  {
    name: "AI & Machine Learning",
    icon: Brain,
    color: "bg-blue-600",
    image: "/images/ai-machine-learning.jpg",
  },
  {
    name: "Data Engineering",
    icon: Database,
    color: "bg-purple-600",
    image: "/images/data-engineering.jpg",
  },
  {
    name: "Industry 4.0",
    icon: Cpu,
    color: "bg-yellow-500",
    image: "/images/industry-4.jpg",
  },
  {
    name: "Technology",
    icon: Server,
    color: "bg-blue-500",
    image: "/images/technology.jpg",
  },
];

export default function ServicesSection() {
  return (
    <section className="w-full bg-[#f8fafc] py-16">

      {/* MAIN CONTAINER */}
      <div className="mx-auto w-full max-w-[1060px] px-5">

        {/* =====================================================
            SERVICE ICON NAVIGATION
        ====================================================== */}

        <div className="mb-3 flex items-end justify-center gap-8">

          {services.map((service, index) => {
            const Icon = service.icon;
            const active = index === 0;

            return (
              <div
                key={service.name}
                className="flex flex-col items-center"
              >

                {/* Active label */}
                {active && (
                  <div
                    className="
                      mb-1
                      rounded-md
                      border
                      border-gray-300
                      bg-white
                      px-2
                      py-1
                      text-[11px]
                      font-medium
                      text-gray-700
                      shadow-sm
                    "
                  >
                    Advertiser Tracker
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    ${service.color}
                    ${
                      active
                        ? "h-[66px] w-[66px] shadow-lg"
                        : "h-[42px] w-[42px]"
                    }
                  `}
                >
                  <Icon
                    className={
                      active
                        ? "h-8 w-8 text-white"
                        : "h-5 w-5 text-white"
                    }
                  />
                </div>

              </div>
            );
          })}

        </div>


        {/* =====================================================
            MAIN SERVICE CARD
        ====================================================== */}

        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            p-3
            shadow-[0_8px_30px_rgba(15,23,42,0.08)]
          "
        >

          <div
            className="
              grid
              min-h-[405px]
              grid-cols-1
              gap-3

              md:grid-cols-[34%_66%]
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div
              className="
                flex
                flex-col
                rounded-lg
                bg-white
                p-5
                shadow-[0_6px_20px_rgba(15,23,42,0.12)]
              "
            >

              {/* Icon + Price */}
              <div className="flex items-start justify-between">

                <div
                  className="
                    flex
                    h-[38px]
                    w-[38px]
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-600
                  "
                >
                  <Brain className="h-5 w-5 text-white" />
                </div>

                <span
                  className="
                    rounded-full
                    bg-blue-50
                    px-2.5
                    py-1
                    text-[10px]
                    font-medium
                    text-blue-600
                  "
                >
                  From $15K/month
                </span>

              </div>


              {/* Title */}
              <h3
                className="
                  mt-5
                  text-[17px]
                  font-semibold
                  tracking-tight
                  text-slate-900
                "
              >
                AI & Machine Learning
              </h3>


              {/* Description */}
              <p
                className="
                  mt-1.5
                  text-[12px]
                  leading-[1.5]
                  text-slate-500
                "
              >
                Complete AI lifecycle management from data curation to
                model deployment and scaling.
              </p>


              {/* Key Capabilities */}
              <div className="mt-5">

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-1.5
                    text-[12px]
                    font-semibold
                    text-slate-700
                  "
                >
                  <span className="text-blue-500">◎</span>
                  Key Capabilities
                </div>

                <div className="space-y-1.5">

                  {[
                    "Data set gathering & curation",
                    "AI model training & optimization",
                    "Backend operations & infrastructure",
                    "MLOps & automated pipelines",
                  ].map((item) => (
                    <div
                      key={item}
                      className="
                        flex
                        items-center
                        gap-2
                        text-[11px]
                        text-slate-500
                      "
                    >
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 text-green-500"
                      />

                      {item}
                    </div>
                  ))}

                </div>

              </div>


              {/* Technologies */}
              <div className="mt-4">

                <div
                  className="
                    mb-2
                    flex
                    items-center
                    gap-1.5
                    text-[12px]
                    font-semibold
                    text-slate-700
                  "
                >
                  <span className="text-blue-500">ϟ</span>
                  Technologies
                </div>


                <div className="flex flex-wrap gap-1.5">

                  {[
                    "TensorFlow",
                    "PyTorch",
                    "Kubernetes",
                    "AWS SageMaker",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="
                        rounded-full
                        border
                        border-slate-200
                        bg-white
                        px-2
                        py-0.5
                        text-[9px]
                        font-medium
                        text-slate-700
                      "
                    >
                      {tech}
                    </span>
                  ))}

                </div>

              </div>


              {/* Learn More */}
              <button
                className="
                  mt-auto
                  flex
                  h-[34px]
                  items-center
                  justify-center
                  gap-2
                  rounded-md
                  bg-gradient-to-r
                  from-[#238ED1]
                  to-[#07548B]
                  text-[11px]
                  font-medium
                  text-white
                  transition
                  hover:opacity-90
                "
              >
                Learn More

                <span className="text-sm">
                  →
                </span>
              </button>

            </div>


            {/* =================================================
                RIGHT IMAGE
            ================================================= */}

            <div
              className="
                relative
                min-h-[405px]
                overflow-hidden
                rounded-lg
                bg-slate-100
              "
            >

              <Image
                src="/logos/image.jpg"
                alt="AI and Machine Learning"
                fill
                className="object-cover"
                loading="eager"
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}