import { appConfig } from "@/utils/config";
import axios, { AxiosInstance } from "axios";
import { Request, Response } from "express";

/**
  *
  *
  *
  *
**/
class IndexerClientClass {
  constructor() {
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
    this.client = axios.create({
      baseURL: appConfig.INDEXER_URL,
      headers: this.defaultHeaders,
    });
  }

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

  async createWebhook({ assetType, assetId }: { assetType: string, assetId: string }) {
    try {
      const webhook = await this.client.post("/webhook", {
        data: {
          assetType,
          assetId
        }
      })
      return webhook
    }
    catch (e) {
      console.error(e)
      return null
    }
  }
}

const indexerApiClient = new IndexerClientClass();

//----------------------------------------------------------------------------

export const createAlert = async (req: Request, res: Response) => {
  try {
    const { assetType, assetId } = req.body
    const hook = await indexerApiClient.createWebhook({ assetType, assetId })
    if (!hook) {
      throw new Error(`Couldn't create webhook`)
    }
    return res.status(204).json({ hook })
  }
  catch (err) {
    console.log(err)
    return res.status(500).json({ message: err })
  }
}
