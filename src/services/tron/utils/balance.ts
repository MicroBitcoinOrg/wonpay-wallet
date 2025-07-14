import {Wallet} from '../../../types/Wallet';
import {CHAINS} from '../../../utils/constants';

export const getBalance = async ({
    addresses,
}: {
    addresses: Wallet.Address[];
}): Promise<Wallet.Balance[]> => {
    const result: Wallet.Balance[] = [];
    const address = addresses[0];

    const res = await fetch(
        `${CHAINS.tron.links.tronscanApi.url}/api/account/tokens/v2?address=${address.address}&start=0&limit=50&hidden=1&show=0&showAvailable=0`,
    );
    const data = await res.json();
    const tokens = data?.data || [];

    let trxFound = false;

    for (const token of tokens) {
        const isTRX =
            token.tokenAbbr?.toLowerCase() ===
            CHAINS.tron.currency.ticker.toLowerCase();

        if (isTRX) {
            trxFound = true;
        }

        result.push({
            balance: Number(token.balance) * 10 ** token.tokenDecimal,
            currency: {
                ticker: token.tokenAbbr.toUpperCase(),
                units: token.tokenDecimal,
                contract: !isTRX ? token.tokenId : undefined,
            },
            main: isTRX,
        });
    }

    if (!trxFound) {
        result.push({
            balance: 0,
            currency: {
                ticker: CHAINS.tron.currency.ticker,
                units: CHAINS.tron.currency.units,
            },
            main: true,
        });
    }

    console.log('result', result);
    return result;
};
