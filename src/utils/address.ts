const bitcoin = require('bitcoinjs-lib');

import * as bip39 from 'bip39';
import {BIP32Factory, BIP32Interface} from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';

const bip32 = BIP32Factory(ecc);

export const getAddress = (node: any, networkAddress: any) => {
    return bitcoin.payments.p2pkh({
        pubkey: node.publicKey,
        network: networkAddress,
    }).address!;
};

export const isAddress = (address: string, regex: string) => {
    return !!(address.length <= 34 && address.match(new RegExp(regex)));
};

export const generateSeedPhrase = (size = 12) => {
    const mnemonic = require('../assets/mnemonics.json');
    const seedPhrase: string[] = [];
    const randomNumbers: number[] = [];

    for (let i = 0; i < size; i++) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const num = Math.floor(Math.random() * mnemonic.words.length);

            if (!randomNumbers.includes(num)) {
                randomNumbers.push(num);
                seedPhrase.push(mnemonic.words[num]);
                break;
            }
        }
    }

    return seedPhrase;
};

export const isValidSeedPhrase = (seedPhrase: (string | undefined)[]) => {
    const mnemonic = require('../assets/mnemonics.json');

    for (let i = 0; i < seedPhrase.length; i++) {
        if (
            !seedPhrase[i] ||
            !mnemonic.words.some((w: string) => w === seedPhrase[i])
        ) {
            return false;
        }
    }

    return true;
};

export const generateAddresses = (
    seedPhrase: string,
    startIndex = 0,
    endIndex = 0,
    derive: number,
    networkAddress: any,
    derivePath: string,
) => {
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const root = bip32.fromSeed(seed, networkAddress);
    const branch = root.derivePath(`${derivePath}${derive}`);
    const result = [];

    for (let i = startIndex; i <= endIndex; i++) {
        const child = branch.derive(i);
        result.push({
            index: i,
            wif: child.toWIF(),
            address: getAddress(child, networkAddress),
        });
    }

    return result;
};

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const generateAddressesAsync = (
    seedPhrase: string,
    startIndex = 0,
    endIndex = 0,
    derive: number,
    networkAddress: any,
    derivePath: string,
): Promise<Wallet.Address[]> => {
    let node: BIP32Interface;
    try {
        const seed = bip39.mnemonicToSeedSync(seedPhrase);
        node = bip32.fromSeed(seed, networkAddress);
    } catch (err) {
        console.log(err);
    }
    // @ts-ignore
    const derivedNode = node.derivePath(`${derivePath}${derive}`);
    const addr: Wallet.Address[] = [];

    return new Promise(async resolve => {
        for (let i = startIndex; i <= endIndex; i++) {
            const btcNodeDerivation = derivedNode.derive(i);

            addr.push({
                index: i,
                wif: btcNodeDerivation.toWIF(),
                address: getAddress(btcNodeDerivation, networkAddress),
            });
            await sleep(1); // delaying is mandatory, otherwise it's blocking other processes...
        }

        for (const b of addr) {
            console.log(`addr : ${b}`);
        }
        resolve(addr);
    });
};
