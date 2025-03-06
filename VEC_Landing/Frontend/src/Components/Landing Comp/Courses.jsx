import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';

const CourseCarousel = ({ courses }) => {
  const [pos, setPos] = useState(3);
  const [clr, setClr] = useState("");
  const [pause, setPause] = useState(false);

  const rdb = [
    {name: "AI&DS", clr: "#be3531"},
    {name: "AUTO", clr: "#f6a664"},
    {name: "CIVIL", clr: "#5e84a0"},
    {name: "CSE", clr: "#01a302"},
    {name: "CSE(CS)", clr: "#114738"},
    {name: "EEE", clr: "#ce8143"},
    {name: "ECE", clr: "#0226c4"},
    {name: "EIE", clr: "#ca4121"},
    {name: "IT", clr: "#a982b4"},
    {name: "MECH", clr: "#896a21"},
    {name: "MBA", clr: "#14254f"},
  ];

  const pos_hdl = (pvl) => {
    if (pvl !== 0 && pvl <= courses.length) {
      const videoElement = document.getElementById(`Cor${pvl}`);
      if (videoElement && videoElement.paused) {
        // Ensure video is muted before playing
        videoElement.muted = true;
        videoElement.play().catch((err) => {
          console.error("Error playing video:", err);
        });
      }
      setPos(pvl);
    }
  };

  const handleNext = useCallback(() => {
    if (pos !== courses.length) pos_hdl(pos + 1);
    else pos_hdl(1);
  }, [pos]);

  useEffect(() => {
    if (!pause) {
      const interval = setInterval(() => {
        if (document.getElementById(`Cor${pos}`) && document.getElementById(`Cor${pos}`).paused) {
          document.getElementById(`Cor${pos}`).play().catch((err) => {
            console.error("Error playing video:", err);
          });
        }
        handleNext();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [handleNext, pause, pos]);

  return (
    <div>
      <div className="grid w-full relative h-fit z-10 lg:py-8">
        <div className="font-comf row-[1/2] col-[1/8] w-screen z-1 h-[300px] items-center
          flex justify-center mb-1"
          style={{ transformStyle: 'preserve-3d', perspective: '600px' }}>

          {/* Left Arrow Button */}
          <button
            className="rounded-full absolute top-[50%] left-[2vw] transform -translate-y-1/2 w-[3vmax] z-[500]
              outline outline-offset-2 h-[7.5vmax] ease-in transition-colors duration-300
              outline-[color-mix(in_srgb,theme(colors.accn)_70%,black)]
              bg-[color-mix(in_srgb,theme(colors.accn)_70%,black)]
              dark:outline-[color-mix(in_srgb,theme(colors.drka)_70%,black)]
              dark:bg-[color-mix(in_srgb,theme(colors.drka)_70%,black)]"
            // style={{ outlineColor: `${rdb[pos - 1].clr}`, backgroundColor: `${rdb[pos - 1].clr}` }}
            onClick={() => pos_hdl(pos - 1)}>
            <ChevronLeftIcon className="size-max text-white"></ChevronLeftIcon>
          </button>

          {courses.map((cur, i) => (
            <div key={i} className="group absolute overflow-hidden transition-all duration-[0.25s] ease
              rounded-xl hover:[transform:rotateY(90deg)]"
              style={{
                transform: `rotateY(${-10 * (pos - (i + 1))}deg) translateX(${-20 * (pos - (i + 1))}vmax)`,
                zIndex: `${Math.max(((pos - (i + 1)) * -1), (pos - (i + 1))) + 10}`
              }}
              onMouseEnter={() => setPause(true)} onMouseLeave={() => setPause(false)}>

              <div className={`relative text-center w-[30vmax] h-[17.5vmax] bg-cover bg-center transition-all duration-[2s]
                ${(pos === i + 1) ? 'focs' : ''} rounded-[20px] overflow-y-hidden group`} onClick={() => pos_hdl(i + 1)}>
                <div className="absolute bg-black z-[-10] w-[30vmax] h-[17.5vmax] [transform:rotateY(180deg),translateZ(-10px)]">
                </div>

                <video className="absolute w-full h-fit" id={`Cor${i + 1}`} muted playsInline loop>
                  <source src={cur.image} />
                </video>

                <div className={`${(pos === i + 1) ? "hidden" : "block"} z-[50] w-full h-full bg-[#0000001a] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-[5px]`}></div>

                <div className="grid content-end w-full h-full z-[40] text-white text-[2vmax] group-hover:[transform:translateZ(500px)]
                  translate-y-[20vmax] delay-200 group-[.focs]:translate-y-0 duration-300 ease transition-all p-2
                  bg-gradient-to-t from-[color-mix(in_srgb,theme(colors.accn)_69%,black)]
                  dark:from-[color-mix(in_srgb,theme(colors.drka)_50%,black)] via-transparent via-35 to-transparent"
                  // style={{ background: `linear-gradient(to top, ${cur.clr}, ${cur.clr}00 55%)` }}
                >{cur.name}
                </div>
              </div>
            </div>
          ))}

          {/* Right Arrow Button */}
          <button
            className="rounded-full absolute top-[50%]  z-[50] right-[2vw] transform -translate-y-1/2 w-[3vmax]
            outline outline-offset-2 h-[7.5vmax] ease-in transition-colors duration-300
            outline-[color-mix(in_srgb,theme(colors.accn)_70%,black)]
            bg-[color-mix(in_srgb,theme(colors.accn)_70%,black)]
            dark:outline-[color-mix(in_srgb,theme(colors.drka)_70%,black)]
            dark:bg-[color-mix(in_srgb,theme(colors.drka)_70%,black)]"
            // style={{ outlineColor: `${rdb[pos - 1].clr}`, backgroundColor: `${rdb[pos - 1].clr}` }}
            onClick={() => pos_hdl(pos + 1)}>
            <ChevronRightIcon className="size-max text-white"></ChevronRightIcon>
          </button>
        </div>

        <div className="flex flex-wrap px-12 mb-4 justify-center gap-4 w-screen lg:mt-2">
          {rdb.map((btn, i) => (
            <button key={i} className={`font-comf text-[1.25rem] px-2 
              text-[color-mix(in_srgb,theme(colors.accn)_70%,black)] font-bold   
              border-[color-mix(in_srgb,theme(colors.accn)_70%,black)]
              dark:text-[color-mix(in_srgb,theme(colors.drka)_70%,black)]
              dark:border-[color-mix(in_srgb,theme(colors.drka)_70%,black)] ${(pos === i + 1) ? 'border-b-2' 
                : ''}`}
              // style={{ color: btn.clr, borderBottomColor: btn.clr }}
              type="button" name="pos" onClick={() => { pos_hdl(i + 1) }}>
              {btn.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
