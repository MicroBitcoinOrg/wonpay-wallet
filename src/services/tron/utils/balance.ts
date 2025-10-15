import {Wallet} from '../../../types/Wallet';
import {TRON} from '../../../utils/constants';
import {getAddressTokens} from '../api/getBalance';

const getTokenType = (tokenType: number) => {
    switch (tokenType) {
        case 10:
            return 'TRC10';
        case 20:
            return 'TRC20';
        default:
            return undefined;
    }
};

export const getBalance = async ({
    addresses,
}: {
    addresses: Wallet.Address[];
}): Promise<Wallet.Balance[]> => {
    const result: Wallet.Balance[] = [];
    const address = addresses[0];

    const response = await getAddressTokens(address.address);

    // Access the tokens from the data property of the response
    const tokens = response.data || [];

    for (const token of tokens) {
        const isTRX =
            token.token_abbr?.toLowerCase() ===
            TRON.currency.ticker.toLowerCase();

        result.push({
            balance: Number(token.balance) * 10 ** token.token_decimal,
            currency: {
                ticker: token.token_abbr.toUpperCase(),
                units: token.token_decimal,
                contract: !isTRX ? token.token_id : undefined,
                iconLink: token.token_url,
                type: getTokenType(token.token_type),
            },
            main: isTRX,
        });
    }

    return result;
};

export const getCurrencyIcon = ({currency}: {currency: Wallet.Currency}) => {
    return currency.iconLink;
};
