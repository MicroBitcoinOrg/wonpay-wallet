import {Wallet} from '../../../types/Wallet';
import {MICROBITCOIN} from '../../../utils/constants';

export const getCurrencyIcon = ({currency}: {currency: Wallet.Currency}) => {
    return `${MICROBITCOIN.links.iconsApi.url}/image/${currency.ticker.replace(
        '!',
        '',
    )}?v=${new Date().getTime()}`;
};
