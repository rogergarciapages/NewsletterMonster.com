import grainImage from "@/assets/grain.jpg";
import { Button } from "@nextui-org/react";
import { IconRobot, IconRocket } from "@tabler/icons-react";

export const HeroSection = () => {
    return (
    <div className="py-32 md:py-48 lg:py-60 relative z-0">
        <div className="absolute inset-0 -z-30 opacity-5" style={{
            backgroundImage: `url(${grainImage.src})`
        }}></div>
        <div className="absolute inset-0 size-[620px] border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:border-torch-500/10 dark:shadow-[0_0_80px_inset] dark:shadow-torch-500/10 border-torch-900/25 shadow-[0_0_80px_inset] shadow-torch-900/45"></div>
        <div className="absolute inset-0 size-[820px] border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:border-torch-500/10 dark:shadow-[0_0_80px_inset] dark:shadow-torch-500/10 border-torch-900/25 shadow-[0_0_80px_inset] shadow-torch-900/45"></div>
        <div className="absolute inset-0 size-[1020px] border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:border-torch-500/10 dark:shadow-[0_0_80px_inset] dark:shadow-torch-500/10 border-torch-900/25 shadow-[0_0_80px_inset] shadow-torch-900/45"></div>
        <div className="absolute inset-0 size-[1220px] border-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full dark:border-torch-500/10 dark:shadow-[0_0_80px_inset] dark:shadow-torch-500/10 border-torch-900/25 shadow-[0_0_80px_inset] shadow-torch-900/45"></div>

        <div className="container">
            <div className="flex flex-col items-center">
                
                <div className="bg-gray-950 border rounded-sm border-gray-800 px-4 py-1.5 inline-flex gap-4 mx-auto">
                    <div className="bg-green-500 size-2.5 rounded-full"><div/>
                    <div className="text-sm font-medium">
                        Online
                    </div>
                </div>
            </div>
            <div className="max-w-lg mx-auto">    
                <h1 className="font-bold tracking-tight text-3xl md:text-4xl text-center mt-8">
                    Newsletters into SEO Powerhouses
                </h1>
                <p className="mt-4 text-center text-[#2e2e2e] dark:text-[#ccc] md:text-lg">
                    Newslettermonster makes your newsletters go into next level SEO
                </p>
            </div> 
            <div className="flex flex-row md:flex-row justify-center items-center gap-2 mt-4">
                <Button radius="md" variant="shadow" className="bg-torch-600 text-white inline-flex items-center gap-2 px-6" endContent={<IconRocket/>}>
                SignUp Now
                </Button>
                <Button radius="md" variant="bordered" className="dark:text-[#ccc] text-[#2e2e2e]/70 border-[#2e2e2e]/70 text-bold" endContent={<IconRobot className="dark:text-color[#ccc] text-[#2e2e2e]/70"/>}>
                SignUp Now
                </Button>
            </div>
        </div>
    </div>

    </div>
);
};