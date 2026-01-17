import Link from "next/link";
import { ReactNode } from "react";

const ExternalLink = ({
  title,
  url,
  extra,
}: {
  title: ReactNode;
  url: string;
  extra?: ReactNode;
}) => {
  return (
    <div className="flex w-42 items-center justify-between underline">
      {title ? (
        <>
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {title}
          </Link>
          {extra}
        </>
      ) : (
        <span>N/A</span>
      )}
    </div>
  );
};

export default ExternalLink;
