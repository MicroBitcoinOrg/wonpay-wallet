import {MICROBITCOIN} from '../../../../utils/constants';

export async function listErrors(): Promise<MBC.ApiError> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.iconsApi.url}/errors`,
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: MBC.ApiError = await response.json();

        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
