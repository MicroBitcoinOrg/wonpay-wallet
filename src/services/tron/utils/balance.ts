import {Wallet} from '../../../types/Wallet';
import {TRON} from '../../../utils/constants';
import {getAddressTokens} from '../api/getBalance';

export const getBalance = async ({
    addresses,
}: {
    addresses: Wallet.Address[];
}): Promise<Wallet.Balance[]> => {
    const result: Wallet.Balance[] = [];
    const address = addresses[0];

    const tokens = await getAddressTokens(address.address);

    let trxFound = false;

    for (const token of tokens) {
        const isTRX =
            token.tokenAbbr?.toLowerCase() ===
            TRON.currency.ticker.toLowerCase();

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
                ticker: TRON.currency.ticker,
                units: TRON.currency.units,
            },
            main: true,
        });
    }

    return result;
};
