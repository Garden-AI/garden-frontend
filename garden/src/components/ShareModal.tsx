import { Copy, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import WithTooltip from "./WithTooltip";
import { toast } from "sonner";

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-1 text-gray-700">
          <Share2 className="h-8 w-8 p-1 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[540px]">
        <h2 className="mb-4 text-2xl font-semibold">Share</h2>
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
          <div className="mb-2 font-semibold">Copy Link</div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">{window.location.href}</span>
            <CopyButton content={window.location.href} className="ml-2" />
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-2 font-semibold">Copy DOI</div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">{doi}</span>
            <CopyButton content={doi} className="ml-2" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;

const CopyButton = ({ content }: { content: any; className?: string }) => {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!");
      }}
      variant="outline"
      size="icon"
      className={
        "border-none text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
      }
    >
      <Copy className="h-8 w-8 p-1.5" />
    </Button>
  );
};
