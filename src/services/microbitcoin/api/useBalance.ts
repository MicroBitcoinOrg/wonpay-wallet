import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import {MICROBITCOIN} from '../../../utils/constants';
import {Wallet} from '../../../types/Wallet';

type Params = {
    addresses: Wallet.Address[];
};

export async function getBalance(params: Params) {
    try {
        let tokens: Wallet.Balance[] = [];
        let balance: Wallet.Balance = {
            balance: 0,
            currency: MICROBITCOIN.currency,
            main: true,
        };

        for (let i = 0; i < params.addresses.length; i++) {
            const {
                data: {result, error},
            } = await axios.get(
                `${MICROBITCOIN.links.api.url}/balance/${params.addresses[i].address}`,
            );

            if (result === null && error) {
                console.error({error});

                throw Error(error.message);
            }

            balance = {
                ...balance,
                balance: balance.balance + result.balance,
            };
        }

        for (let i = 0; i < params.addresses.length; i++) {
            const {
                data: {balances, stats},
            } = await axios.get(
                `${MICROBITCOIN.links.tokensApi!.url}/layer/address/${
                    params.addresses[i].address
                }`,
            );

            for (let k = 0; k < balances.length; k++) {
                const tokenIndex = tokens.findIndex(
                    t => t.currency.ticker === balances[k].ticker,
                );

                if (tokenIndex !== -1) {
                    tokens = [
                        ...tokens.filter(
                            t => t.currency.ticker !== balances[i].ticker,
                        ),
                        {
                            ...tokens[tokenIndex],
                            balance:
                                balances[k].value + tokens[tokenIndex].balance,
                        },
                    ];
                } else {
                    tokens.push({
                        currency: {
                            units: balances[k].decimals,
                            ticker: balances[k].ticker,
                        },
                        balance: balances[k].value,
                        main: false,
                    });
                }
            }
        }

        return [balance, ...tokens];
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export default function (params: Params, options?: Record<string, any>) {
    return useQuery<Wallet.Balance[], Error>({
        queryKey: ['balance', params],
        queryFn: () => getBalance(params),
        ...options,
    });
}
