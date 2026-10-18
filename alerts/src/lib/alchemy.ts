import { appConfig } from "@/utils/config";
import axios, { AxiosInstance } from "axios";
import { Request, Response } from "express";

class AlchemyApiClientClass {
  constructor(apiKey: string, authToken: string) {
    this.apiKey = apiKey;
    this.authToken = authToken;
    this.defaultHeaders = {
      "X-Alchemy-Token": this.authToken,
      "Content-Type": "application/json",
    }
    this.client = axios.create({
      baseURL: "https://eth-mainnet.alchemyapi.io/v2",
      headers: this.defaultHeaders,
    });
  }

  apiKey: string;
  authToken: string;
  defaultHeaders: Record<string, string>;
  client: AxiosInstance;

  // async getTokenPrice(tokenAddress: string, blockNumber: number) {
  //   const url = `https://eth-mainnet.alchemyapi.io/v2/${this.apiKey}/getTokenPrice/${tokenAddress}/${blockNumber}`;
  //   const response = await fetch(url);
  //   const data = await response.json();
  //   return data;
  // }

  // const options = {
  //   method: 'POST',
  //   headers: {'Content-Type': 'application/json', 'X-Alchemy-Token': 'your-X-Alchemy-Token'},
  //   body: JSON.stringify({
  //     network: 'ETH_MAINNET',
  //     webhook_type: 'GRAPHQL',
  //     webhook_url: 'string',
  //     name: 'string',
  //     graphql_query: 'string',
  //     addresses: ['string'],
  //     nft_filters: [{contract_address: 'string', token_id: 'string'}]
  //   })
  // };
  //
  // fetch('https://dashboard.alchemy.com/api/create-webhook', options)
  //   .then(res => res.json())
  //   .then(res => console.log(res))
  //   .catch(err => console.error(err));

  async createWebhook(webhookUrl: string) {

    const url = `https://dashboard.alchemy.com/api/create-webhook`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Alchemy-Token": this.apiKey,
      },
      body: JSON.stringify({
        url: webhookUrl,
      }),
    });
    const data = await response.json();
    return data;
  }
}

const alchemyApiClient = new AlchemyApiClientClass(appConfig.ALCHEMY_API_KEY, appConfig.ALCHEMY_AUTH_TOKEN);

//----------------------------------------------------------------------------

export const createAlert = async (req: Request, res: Response) => {
  try {
    const alert = await alchemyApiClient.createWebhook()
  }
  catch (err) {

  }
}
