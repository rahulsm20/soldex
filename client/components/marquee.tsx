import { ExternalLinks } from "@/lib/pages";
import { TokenPriceResponse } from "@soldex/types";
import { ChevronUp, Ellipsis } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

const MarqueeListItem = ({ token }: { token: TokenPriceResponse }) => {
  const percentagePriceChange = (token: TokenPriceResponse) => {
    if (!token.priceChange24h || !token.price) return 0;
    return (token.priceChange24h / (token.price - token.priceChange24h)) * 100;
  };

  return (
    <Link
      href={ExternalLinks.solscan("account", token.address)}
      key={token.address}
      target="_blank"
      className="flex items-start justify-start p-2 border rounded-md gap-2"
    >
      {token.icon && token.symbol && (
        <Image src={token.icon} alt={token.symbol} width={24} height={24} />
      )}
      <span key={token.address}>
        {token.symbol} $
        {token?.price && token.decimals && token?.price.toFixed(token.decimals)}
      </span>
      <span>
        {token?.priceChange24h && token?.priceChange24h > 0 ? (
          <ChevronUp className="inline-block h-4 w-4 text-green-500" />
        ) : (
          <ChevronUp className="inline-block h-4 w-4 text-red-500 rotate-180" />
        )}
        <span className="text-xs">
          {Math.abs(percentagePriceChange(token)).toFixed(2)}%
        </span>
      </span>
    </Link>
  );
};

const MarqueeComponent = ({
  tokens,
  isLoading,
}: {
  tokens: TokenPriceResponse[] | undefined;
  isLoading: boolean;
}) => {
  return (
    <Marquee
      speed={50}
      pauseOnHover={true}
      gradient={false}
      className="p-4 flex gap-5 border-b"
    >
      <div className="flex gap-2">
        {isLoading ? (
          <Ellipsis className="animate-pulse" />
        ) : (
          tokens &&
          tokens.map((token) => (
            <MarqueeListItem key={token.address} token={token} />
          ))
        )}
      </div>
    </Marquee>
  );
};

export default MarqueeComponent;
