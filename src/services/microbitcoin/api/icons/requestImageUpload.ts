import {MICROBITCOIN} from '../../../../utils/constants';

type Params = {
    token: string;
    image: {
        uri: string;
        type: string;
        name: string;
    };
};

export async function requestImageUpload(
    params: Params,
): Promise<MBC.TokenImageRequest> {
    try {
        const formData = new FormData();
        formData.append('image', {
            uri: params.image.uri,
            type: params.image.type,
            name: params.image.name,
        } as any);

        const response = await fetch(
            `${MICROBITCOIN.links.iconsApi.url}/token/${params.token}/image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            },
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
