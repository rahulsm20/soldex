import { ReactNode } from "react";
import CopyToClipboard from "./copy-to-clipboard";
import ExternalLink from "./external-link";

const TxLink = ({
  title,
  url,
  text,
}: {
  title: ReactNode;
  url: string;
  text: string | undefined;
}) => {
  return (
    <ExternalLink
      title={title}
      url={url}
      extra={<CopyToClipboard text={text} title={"Copy transaction link"} />}
    />
  );
};

export default TxLink;
