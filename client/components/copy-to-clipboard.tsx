import { Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

/**
 * Component to copy text to clipboard with a popover confirmation.
 * @param text Text to be copied
 * @param title (Optional) Title for the copy button
 * @returns
 */
const CopyToClipboard = ({ text, title }: { text: string; title?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Popover open={copied}>
      <PopoverTrigger asChild title={title || "Copy to clipboard"}>
        <Button
          variant="outline"
          size="icon"
          className="p-0.5"
          onClick={handleCopy}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="center"
        className="w-20 h-10 text-sm flex justify-center items-center p-0"
      >
        Copied!
      </PopoverContent>
    </Popover>
  );
};

export default CopyToClipboard;
