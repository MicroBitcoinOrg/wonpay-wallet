import axios from 'axios';
import Config from 'react-native-config';
import {MICROBITCOIN} from '../../../utils/constants';

type Params = {
    address: string;
    currency?: string;
};

export default async function req(params: Params) {
    try {
        const {
            data: {list, pagination},
        } = await axios.get(
            `${MICROBITCOIN.tokensApiLink}/layer/address/${
                params.address
            }/transfers${params.currency ? `/${params.currency}` : ''}`,
        );

        return list;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
