import { Copy, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useState } from "react";
import CopyButton from "./CopyButton";

const socialMediaItems = [
  {
    href: "https://www.facebook.com/",
    src: "img/facebook-logo.png",
    alt: "Facebook logo",
  },
  {
    href: "https://twitter.com/",
    src: "img/twitter-logo.png",
    alt: "Twitter logo",
  },
  {
    href: "https://www.linkedin.com/",
    src: "img/LinkedIn-logo.png",
    alt: "LinkedIn logo",
  },
  {
    href: "https://www.reddit.com/",
    src: "img/reddit-logo.png",
    alt: "Reddit logo",
  },
  {
    href: "https://github.com/",
    src: "img/github-logo.png",
    alt: "Github logo",
  },
  {
    href: "https://discord.com/",
    src: "img/discord-logo.png",
    alt: "Discord logo",
  },
];

const ShareModal = ({ doi }: { doi: string }) => {
  const doiURL = "https://doi.org/" + doi
  console.log(doiURL)
  const [isTooltipAllowed, setIsTooltipAllowed] = useState(true);
  return (
    <Dialog onOpenChange={() => setIsTooltipAllowed(false)}>
      <TooltipProvider>
        <Tooltip defaultOpen={false} delayDuration={40}>
          <TooltipTrigger
            asChild
            onMouseEnter={() => setIsTooltipAllowed(true)}
          >
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="border-none bg-transparent text-gray-700 hover:border-none hover:bg-transparent hover:text-gray-500"
              >
                <Share2 width={24} height={24} className="" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          {isTooltipAllowed && (
            <TooltipContent>
              <p>Share</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[540px]">
        <DialogTitle>Share</DialogTitle>
        <DialogDescription className="mb-4">
          Share this garden with others
        </DialogDescription>
        <div className="mb-8 flex justify-evenly">
          {socialMediaItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <img src={item.src} alt={item.alt} className="w-6 sm:w-10" />
            </a>
          ))}
        </div>
        <div className="mb-4">
          <div className="mb-2 font-semibold">Copy DOI Link</div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">{doiURL}</span>
            <CopyButton hint="Copy DOI URL" content={doiURL} className="ml-2" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
