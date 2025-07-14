/// <reference path="../../../types/MBC.d.ts" />

import * as bitcoin from 'bitcoinjs-lib';
import {decryptData} from '../../../utils/common';
import {broadcast, getUTXO} from '../../microbitcoin/api';
import {MICROBITCOIN} from '../../../utils/constants';
import {Wallet} from '../../../types/Wallet';

const addUnspentAndSign = (data: {
    withdrawAddress: string;
    amount: number;
    fee: number;
    unspent: {
        utxos: MBC.UTXO[];
        address: string;
    }[];
    txb: bitcoin.TransactionBuilder;
    wallet: Wallet.Wallet;
    password: string;
}) => {
    // Add output to withdraw address with amount
    if (data.amount) {
        data.txb.addOutput(data.withdrawAddress, data.amount);
    }

    // Calculate total unspent amount based on utxos
    const unspentSum = data.unspent
        .map(u => u.utxos)
        .flat()
        .reduce((sum, curr) => {
            return sum + Number(curr.value);
        }, 0);

    console.log(
        'Unspent sum',
        unspentSum,
        'Fee',
        data.fee,
        'Amount',
        data.amount,
    );

    // Add all inputs to transaction builder
    data.unspent.forEach(u => {
        u.utxos.forEach(utxo => {
            data.txb.addInput(utxo.txid, utxo.index);
        });
    });

    // Add output to deposit address with remaining amount
    if (unspentSum > data.fee + data.amount) {
        data.txb.addOutput(
            data.wallet.depositAddress!,
            unspentSum - data.fee - data.amount,
        );

        console.log('Remaining output', unspentSum - data.fee - data.amount);
    }

    let signIndex = 0;

    for (let i = 0; i < data.unspent.length; i++) {
        const wif = decryptData(
            data.wallet!.addresses.find(
                a => a.address === data.unspent[i].address,
            )!.wif,
            data.password,
        );
        const key = bitcoin.ECPair.fromWIF(wif, MICROBITCOIN.network);

        data.unspent[i].utxos.forEach(_utxo => {
            data.txb.sign(signIndex, key);
            signIndex++;
        });
    }
};

export const sendTokenTransaction = async (data: {
    withdrawAddress: string;
    amount: number;
    fee: number;
    wallet: Wallet.Wallet;
    password: string;
    currency: Wallet.Currency;
}) => {
    const response = await fetch(
        `${MICROBITCOIN.links.tokensApi!.url}/message/transfer`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticker: data.currency.ticker,
                value: 10 ** data.currency.units * data.amount,
            }),
        },
    );

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const {data: payload} = await response.json();

    const txb = new bitcoin.TransactionBuilder(MICROBITCOIN.network);
    txb.setVersion(2);

    const payloadEncoded = Buffer.from(payload, 'hex');
    const payloadScript = bitcoin.script.compile([
        bitcoin.opcodes.OP_RETURN,
        payloadEncoded,
    ]);

    txb.addOutput(payloadScript, 0);

    const unspent: {
        utxos: MBC.UTXO[];
        address: string;
    }[] = [];

    await Promise.all(
        data.wallet.addresses.map(async address => {
            const utxos = await getUTXO({
                address: address.address,
            });

            unspent.push({utxos, address: address.address});
        }),
    );

    addUnspentAndSign({
        ...data,
        fee: 10 ** 4 * data.fee,
        amount: 10 ** 4 * data.fee,
        unspent,
        txb,
    });

    var tx = txb.build();

    const broadcastedTxid = await broadcast({raw: tx.toHex()});

    return {txid: broadcastedTxid};
};

export const sendMainTransaction = async (data: {
    withdrawAddress: string;
    amount: number;
    fee: number;
    wallet: Wallet.Wallet;
    password: string;
}) => {
    const txb = new bitcoin.TransactionBuilder(MICROBITCOIN.network);
    txb.setVersion(2);

    const unspent: {
        utxos: MBC.UTXO[];
        address: string;
    }[] = [];

    await Promise.all(
        data.wallet.addresses.map(async address => {
            const utxos = await getUTXO({
                address: address.address,
            });

            unspent.push({utxos, address: address.address});
        }),
    );

    addUnspentAndSign({
        ...data,
        amount: 10 ** 4 * data.amount,
        fee: 10 ** 4 * data.fee,
        unspent,
        txb,
    });

    var tx = txb.build();

    const broadcastedTxid = await broadcast({raw: tx.toHex()});

    return {txid: broadcastedTxid};
};

export const sendTransaction =
    (walletData: {wallet: Wallet.Wallet; password: string}) =>
    async (data: {
        withdrawAddress: string;
        amount: number;
        fee: number;
        currency: Wallet.Currency;
    }) => {
        if (data.currency.ticker === MICROBITCOIN.currency.ticker) {
            return sendMainTransaction({...data, ...walletData});
        } else {
            return sendTokenTransaction({...data, ...walletData});
        }
    };
