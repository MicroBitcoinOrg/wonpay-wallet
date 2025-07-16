import {MICROBITCOIN} from '../../../../utils/constants';

type Params = {
    token: string;
};

export async function getImage(params: Params): Promise<MBC.TokenImage> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.iconsApi.url}/token/${params.token}/image`,
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: MBC.TokenImage = await response.json();

        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
