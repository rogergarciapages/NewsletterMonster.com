import grainImage from "@/assets/grain.jpg";
import { Button } from "@nextui-org/react";
import { IconAsterisk, IconCircleDotFilled, IconMail, IconMailBolt, IconMailbox, IconMailCheck, IconMailDollar, IconRobot, IconRocket } from "@tabler/icons-react";
import { HeroOrbit } from "./hero-orbit";

export const HeroSection = () => {
    return (
    <div className="py-32 md:py-48 lg:py-60 relative z-0 overflow-x-clip">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_70%,transparent)]">
        <div className="absolute inset-0 -z-30 opacity-5" style={{
            backgroundImage: `url(${grainImage.src})`
        }}></div>
        <div className="absolute inset-0 size-[620px] border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:border-torch-500/10 dark:shadow-[0_0_80px_inset] dark:shadow-torch-500/10 border-torch-900/25 shadow-[0_0_80px_inset] shadow-torch-900/45"></div>
        <div className="absolute inset-0 size-[820px] border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:border-torch-500/10 dark:shadow-[0_0_80px_inset] dark:shadow-torch-500/10 border-torch-900/25 shadow-[0_0_80px_inset] shadow-torch-900/45"></div>
        <div className="absolute inset-0 size-[1020px] border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:border-torch-500/10 dark:shadow-[0_0_80px_inset] dark:shadow-torch-500/10 border-torch-900/25 shadow-[0_0_80px_inset] shadow-torch-900/45"></div>
        <div className="absolute inset-0 size-[1220px] border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:border-torch-500/10 dark:shadow-[0_0_80px_inset] dark:shadow-torch-500/10 border-torch-900/25 shadow-[0_0_80px_inset] shadow-torch-900/45"></div>
            <HeroOrbit size={800} rotation={-72}>
                <IconMail className="size-28 text-torch-600/80" />
            </HeroOrbit>
            <HeroOrbit size={550} rotation={-172}>
                <IconMailbox className="size-16 text-torch-600/80" />
            </HeroOrbit>
            <HeroOrbit size={550} rotation={-17}>
                <IconMailBolt className="size-12 text-torch-600/80" />
            </HeroOrbit>
            <HeroOrbit size={750} rotation={97}>
                <IconAsterisk className="size-8 text-torch-600/80" />
            </HeroOrbit>
            <HeroOrbit size={750} rotation={140}>
                <IconMailDollar className="size-8 text-torch-600/80" />
            </HeroOrbit>
            <HeroOrbit size={910} rotation={-50}>
                <IconMailCheck className="size-12 text-torch-600/80" />
            </HeroOrbit>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[430px] ">
                <div className="animate-spin size-[430px] [animation-duration:150s]">
                    <div className="inline-flex animate-spin [animation-duration:3s]">
                        <IconMail className="size-8 text-torch-600/80"/>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[680px] ">
                <div className="animate-spin size-[680px] [animation-duration:30s]">
                    <div className="inline-flex animate-spin [animation-duration:4s]">
                        <IconMail className="size-16 text-torch-600/80"/>
                    </div>
                </div>
            </div>   
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[850px] ">
                <div className="animate-spin size-[850px] [animation-duration:50s]">
                    <div className="inline-flex animate-spin [animation-duration:10s]">
                        <div className="size-4 rounded-full bg-torch-900/80"/>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[710px] ">
                <div className="animate-spin size-[710px] [animation-duration:20s]">
                    <div className="inline-flex animate-spin [animation-duration:12s]">
                        <div className="size-3 rounded-full bg-torch-900/80"/>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[550px] ">
                <div className="animate-spin size-[550px] [animation-duration:50s]">
                    <div className="inline-flex animate-spin [animation-duration:10s]">
                        <div className="size-4 rounded-full bg-torch-900/80"/>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] ">
                <div className="animate-spin size-[650px] [animation-duration:10s]">
                    <div className="inline-flex animate-spin [animation-duration:10s]">
                        <div className="size-6 rounded-full bg-torch-900/80"/>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[455px] ">
                <div className="animate-spin size-[455px] [animation-duration:20s]">
                    <div className="inline-flex animate-spin [animation-duration:10s]">
                        <div className="size-2 rounded-full bg-torch-900/80"/>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[880px] ">
                <div className="animate-spin size-[880px] [animation-duration:20s]">
                    <div className="inline-flex animate-spin [animation-duration:10s]">
                        <div className="size-5 rounded-full bg-torch-900/80"/>
                    </div>
                </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[730px] ">
                <div className="animate-spin size-[730px] [animation-duration:150s]">
                    <div className="inline-flex animate-spin [animation-duration:8s]">
                        <IconMailbox className="size-12 text-torch-600/80"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="container mx-auto">

        <div className="flex flex-col items-center mx-auto">
        <div className="bg-gray-950/80 border w-30 rounded-md border-gray-800 px-3 py-1.5 flex items-center mx-auto">
          <IconCircleDotFilled className="text-green-600 size-3 animate-pulse" />
          <div className="text-xs font-medium text-[#ccc] px-2">
            Systems Online
          </div>
        </div>
      </div>
            <div className="max-w-lg mx-auto">    
                <h1 className="font-bold tracking-tight leading-[2.90rem] text-5xl md:text-4xl text-center mt-8">
                    Turn your Newsletters into SEO Powerhouses.
                </h1>
                <p className="mt-4 text-center leading-snug text-[#2e2e2e] dark:text-[#ccc] text-lg md:text-lg lg:base sm:base">
                    Newslettermonster makes your newsletters go into next level SEO
                </p>
            </div> 
            <div className="flex flex-row md:flex-row justify-center items-center gap-2 mt-4">
                <Button radius="md" variant="shadow" className="bg-torch-600 text-white inline-flex items-center gap-2 px-6" endContent={<IconRocket/>}>
                SignUp Now
                </Button>
                <Button radius="md" variant="bordered" className="dark:text-[#ccc] text-[#2e2e2e]/70 dark:border-[#ccc]/80 border-[#2e2e2e]/70 text-bold" endContent={<IconRobot className="text-[#2e2e2e]/70 dark:text-[#ccc]/80"/>}>
                Find out more
                </Button>
            </div>
        </div>
    </div>
);
};