import {MICROBITCOIN} from '../../../../utils/constants';

export async function getAuthMessage(): Promise<{message: string}> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.iconsApi.url}/auth/message`,
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
