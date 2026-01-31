import { Download } from "lucide-react";
import { Button } from "./ui/button";

/**
 * generic download button component
 * @param loading - boolean to indicate if the download is in progress
 * @param disabled - boolean to indicate if the button is disabled
 * @param onClick - function to handle the click event
 * @param loadingTitle - optional string to display when loading
 * @param buttonVariant - optional variant for the button style
 * @returns JSX.Element
 */
const DownloadButton = ({
  loading,
  disabled,
  onClick,
  loadingTitle,
  buttonVariant,
}: {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  loadingTitle?: string;
  buttonVariant?:
    | "outline"
    | "default"
    | "link"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}) => {
  return (
    <Button
      variant={buttonVariant || "outline"}
      disabled={disabled}
      onClick={() => {
        onClick();
      }}
    >
      <Download />
      <span>{loading ? loadingTitle || "Downloading..." : "Download"}</span>
    </Button>
  );
};

export default DownloadButton;
