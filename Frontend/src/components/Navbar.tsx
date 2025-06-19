import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { SiGithub } from "react-icons/si";
import { useNavigate } from "react-router";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi"; // Hamburger icons

export default function MenubarDemo() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full px-4 py-2 text-gray-300 bg-gray-900">
      {/* Main container */}
      <div className="flex items-center justify-between md:justify-between">
        {/* Logo */}
        <a href="/" className="font-bold text-xl flex items-center gap-1">
          DevLaunchPad <span className="rocket">🚀</span>
        </a>

        {/* Hamburger toggle (mobile only) */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* Desktop Menubar */}
        <Menubar className="hidden md:flex gap-4">
          <MenubarMenu>
            <MenubarTrigger>
              <div onClick={() => navigate("/")} className="cursor-pointer">Home</div>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              <a href="/#tools" className="cursor-pointer">Get Tools</a>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              <a href="/#about" className="cursor-pointer">About</a>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              <a
                href="https://github.com/akmroyal/Dev-Launch-Pad-Tools-App"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                Source Code <SiGithub />
              </a>
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-3 flex flex-col gap-2 md:hidden transition-all duration-300">
          <div onClick={() => navigate("/")} className="cursor-pointer">Home</div>
          <a href="/#tools" className="cursor-pointer">Get Tools</a>
          <a href="/#about" className="cursor-pointer">About</a>
          <a
            href="https://github.com/akmroyal/Dev-Launch-Pad-Tools-App"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            Source Code <SiGithub />
          </a>
        </div>
      )}
    </div>
  );
}
