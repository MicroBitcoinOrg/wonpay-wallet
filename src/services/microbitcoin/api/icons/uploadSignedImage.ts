import {MICROBITCOIN} from '../../../../utils/constants';

type Params = {
    token: string;
    message: string;
    signature: string;
    address: string;
    image: {
        uri: string;
        type: string;
        name: string;
    };
};

export async function uploadSignedImage(
    params: Params,
): Promise<MBC.TokenImage> {
    try {
        const formData = new FormData();

        formData.append('message', params.message);
        formData.append('signature', params.signature);
        formData.append('address', params.address);
        formData.append('image', {
            uri: params.image.uri,
            type: params.image.type,
            name: params.image.name,
        } as any);

        const response = await fetch(
            `${MICROBITCOIN.links.iconsApi.url}/token/${params.token}/image-signed`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            },
        );

        if (!response.ok) {
            const error = await response.json();

            throw new Error(error.message);
        }

        const result: MBC.TokenImage = await response.json();

        return result;
    } catch (e) {
        console.error(e);
        throw e;
    }
}
