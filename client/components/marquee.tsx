import { TokenPriceResponse } from "@/types";
import { ChevronUp } from "lucide-react";
import Marquee from "react-fast-marquee";

const MarqueeComponent = ({
  tokens,
  isLoading,
}: {
  tokens: TokenPriceResponse[] | undefined;
  isLoading: boolean;
}) => {
  const percentagePriceChange = (token: TokenPriceResponse) => {
    if (!token.priceChange24h || !token.price) return 0;
    return (token.priceChange24h / (token.price - token.priceChange24h)) * 100;
  };
  return (
    <Marquee
      speed={100}
      pauseOnHover={true}
      gradient={false}
      className="border p-4"
    >
      {isLoading ? (
        <span>Loading token prices...</span>
      ) : (
        tokens &&
        tokens.map((token) => (
          <div key={token.address} className="flex items-center p-2">
            <span key={token.address} className="mx-4">
              {token.symbol}:${token?.price && token?.price.toFixed(2)}
            </span>
            <span>
              {token?.priceChange24h && token?.priceChange24h > 0 ? (
                <ChevronUp className="inline-block h-4 w-4 text-green-500" />
              ) : (
                <ChevronUp className="inline-block h-4 w-4 text-red-500 rotate-180" />
              )}
              {Math.abs(percentagePriceChange(token)).toFixed(2)}%
            </span>
          </div>
        ))
      )}
      {/* Add more items */}
    </Marquee>
  );
};

export default MarqueeComponent;
