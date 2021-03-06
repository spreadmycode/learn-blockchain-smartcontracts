import {
  PolygonQueryResponse,
  PolygonQueryErrorResponse,
} from '@figment-polygon/types';
import type {NextApiRequest, NextApiResponse} from 'next';
import {getNodeURL} from '@figment-polygon/lib';
import {ethers} from 'ethers';

export default async function query(
  _req: NextApiRequest,
  res: NextApiResponse<PolygonQueryResponse | PolygonQueryErrorResponse>,
) {
  const url = getNodeURL();
  const provider = new ethers.providers.JsonRpcProvider(url, 'any');

  try {
    const networkName = await provider.getNetwork().then((res) => {
      return res.name;
    });

    // TODO: Define the variables below
    const chainId = provider.network.chainId;
    const blockHeight = await provider.getBlockNumber();
    const gasPriceAsGwei = await provider.getGasPrice().then((res) => {
      return ethers.utils.formatUnits(res, 'gwei');
    });
    const blockInfo = await provider.getBlockWithTransactions(blockHeight);

    if (!chainId || !blockHeight || !gasPriceAsGwei || !blockInfo) {
      throw new Error('Please complete the code');
    }

    res.status(200).json({
      networkName,
      chainId,
      blockHeight,
      gasPriceAsGwei,
      blockInfo,
    });
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json({
      message: errorMessage,
    });
  }
}
