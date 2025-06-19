import { Menubar, MenubarMenu, MenubarTrigger } from "@radix-ui/react-menubar";
import { SiGithub } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="bg-[#131212] text-[#cccccc] border-t-2 py-8 mt-12">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">

                {/* Left: Branding */}
                <div className="text-center md:text-left">
                    <p className="font-semibold text-white text-base">DevLaunchPad 🚀</p>
                    <p className="text-xs mt-1">© {new Date().getFullYear()} All rights reserved.</p>
                </div>

                {/* Center: Quick Links */}
                <div className="flex gap-6">
                    {/* <a href="/" className="hover:text-white transition">Home</a>
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="https://github.com/your-username/devlaunchpad" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a> */}
                    <Menubar className="flex gap-1 md:gap-9.5 font-semibold flex-col md:flex-row ">
                        <MenubarMenu >
                            <MenubarTrigger>
                                <a href="/" className="text-2xl">Home</a>
                            </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>
                                <a href="#tools" className="text-2xl">Get Tools</a>
                            </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>
                                <a href="#about" className="text-2xl">About</a>
                            </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger>
                                <a href="https://github.com/akmroyal/Dev-Launch-Pad-Tools-App" target="_blank" className="flex items-center justify-between gap-2 text-2xl">
                                    Source Code
                                    <span><SiGithub /></span>
                                </a>
                            </MenubarTrigger>
                        </MenubarMenu>
                    </Menubar>
                </div>

                {/* Right: Message */}
                <div className="text-center md:text-right">
                    <p>Made with ❤️ in TypeScript</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
