import * as bitcoin from 'bitcoinjs-lib';
import {decryptData} from '../../../utils/common';
import {broadcast, getUTXO} from '../../microbitcoin/api';
import {MICROBITCOIN} from '../../../utils/constants';
import axios from 'axios';

const addUnspentAndSign = (data: {
    withdrawAddress: string;
    amount: number;
    fee: number;
    unspent: MBC.UTXO[];
    txb: bitcoin.TransactionBuilder;
    wallet: Wallet.Wallet;
    password: string;
}) => {
    data.txb.addOutput(data.withdrawAddress, data.amount);

    const unspentSum = data.unspent.reduce((sum, curr) => {
        return sum + Number(curr.value);
    }, 0);

    for (let i = 0; i < data.unspent.length; i++) {
        data.txb.addInput(data.unspent[i].txid, data.unspent[i].index);
    }

    if (unspentSum > data.fee + data.amount) {
        data.txb.addOutput(
            data.wallet.depositAddress!,
            unspentSum - data.fee - data.amount,
        );
    }

    const wif = decryptData(
        data.wallet!.addresses.find(
            a => a.address === data.wallet?.depositAddress!,
        )!.wif,
        data.password,
    );
    const key = bitcoin.ECPair.fromWIF(wif, MICROBITCOIN.network);

    for (let i = 0; i < data.unspent.length; i++) {
        data.txb.sign(i, key);
    }
};

export const sendTokenTransaction =
    (walletData: {wallet: Wallet.Wallet; password: string}) =>
    async (data: {
        withdrawAddress: string;
        amount: number;
        fee: number;
        ticker: string;
    }) => {
        const {
            data: {data: payload},
        } = await axios.post(`${MICROBITCOIN.tokensApiLink}/message/transfer`, {
            ticker: data.ticker,
            value: data.amount,
        });

        const txb = new bitcoin.TransactionBuilder(MICROBITCOIN.network);
        txb.setVersion(2);

        const payloadEncoded = Buffer.from(payload, 'hex');
        const payloadScript = bitcoin.script.compile([
            bitcoin.opcodes.OP_RETURN,
            payloadEncoded,
        ]);

        txb.addOutput(payloadScript, 0);

        const unspent = await getUTXO({
            address: walletData.wallet.depositAddress!,
        });

        addUnspentAndSign({
            ...data,
            ...walletData,
            amount: data.fee,
            unspent,
            txb,
        });

        var tx = txb.build();

        const broadcastedTxid = await broadcast({raw: tx.toHex()});

        return {txid: broadcastedTxid};
    };

export const sendTransaction =
    (walletData: {wallet: Wallet.Wallet; password: string}) =>
    async (data: {withdrawAddress: string; amount: number; fee: number}) => {
        const txb = new bitcoin.TransactionBuilder(MICROBITCOIN.network);
        txb.setVersion(2);

        const unspent = await getUTXO({
            address: walletData.wallet.depositAddress!,
        });

        addUnspentAndSign({...data, ...walletData, unspent, txb});

        var tx = txb.build();

        const broadcastedTxid = await broadcast({raw: tx.toHex()});

        return {txid: broadcastedTxid};
    };
