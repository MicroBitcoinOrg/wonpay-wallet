import {MICROBITCOIN} from '../../../../utils/constants';

type Params = {
    id: number;
};

export async function getImageUploadRequestStatus(
    params: Params,
): Promise<MBC.TokenImageRequest> {
    try {
        const response = await fetch(
            `${MICROBITCOIN.links.iconsApi.url}/token/request/${params.id}`,
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: MBC.TokenImageRequest = await response.json();

        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
