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
}
