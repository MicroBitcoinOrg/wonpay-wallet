declare namespace MBC {
    type UTXO = {
        txid: string;
        script: string | Buffer;
        index: number;
        address: string;
        value: number | string;
        spent?: boolean;
    };

    type AddedUTXO = {
        utxos: MBC.UTXO[];
        amount: number;
        address: string;
    };

    type MempoolUTXO = {
        index: number;
        script: string;
        txid: string;
    };

    type TokenImage = {
        url: string;
        token: string;
    };

    type TokenImageRequest = {
        id: number;
        token: string;
        status: string;
        address: string;
        amount: number;
    };

    type ApiError = {
        [category: string]: {
            [code: string]: [string, number];
        };
    };
}
