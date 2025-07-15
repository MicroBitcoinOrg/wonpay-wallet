const bitcoin = require('bitcoinjs-lib');

import {TronWeb} from 'tronweb';
import * as bip39 from 'bip39';
import {BIP32Factory, BIP32Interface} from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';
import {Wallet} from '../types/Wallet';
import {TRON} from './constants';

const bip32 = BIP32Factory(ecc);

// Helper function to generate Tron address from private key
const generateTronAddress = (privateKey: Buffer): string => {
    try {
        const tronWeb = new TronWeb({
            fullHost: TRON.links.api.url,
        });
        // Convert private key to hex string (without 0x prefix)
        const privateKeyHex = privateKey.toString('hex');

        // Use TronWeb's address generation from private key
        const address = tronWeb.address.fromPrivateKey(privateKeyHex);

        return address as string;
    } catch (error) {
        console.error('Error generating Tron address:', error);
        throw error;
    }
};

export const getAddress = (node: any, networkAddress: any) => {
    // Check if this is a Tron network based on pubKeyHash
    if (networkAddress.pubKeyHash === 0x41) {
        // Generate Tron address using private key
        return generateTronAddress(node.privateKey);
    } else {
        // Generate Bitcoin-style address
        return bitcoin.payments.p2pkh({
            pubkey: node.publicKey,
            network: networkAddress,
        }).address!;
    }
};

export const isMatch = (address: string, regex: string[]) => {
    return regex.some(r => address.match(new RegExp(r)));
};

export const generateSeedPhrase = () => {
    return bip39.generateMnemonic().split(' ');
};

export const isValidSeedPhrase = (seedPhrase: (string | undefined)[]) => {
    const words = bip39.wordlists.english;

    for (let i = 0; i < seedPhrase.length; i++) {
        if (!seedPhrase[i] || !words.some((w: string) => w === seedPhrase[i])) {
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

export const generateAddressesAsync = ({
    seedPhrase,
    startIndex = 0,
    endIndex = 0,
    derive = 0,
    networkAddress,
    derivePath,
}: {
    seedPhrase: string;
    startIndex?: number;
    endIndex?: number;
    derive?: number;
    networkAddress: any;
    derivePath: string;
}): Promise<Wallet.Address[]> => {
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
                privateKey: btcNodeDerivation.privateKey?.toString('hex'),
            });
            await sleep(1); // delaying is mandatory, otherwise it's blocking other processes...
        }

        for (const b of addr) {
            console.log(`addr : ${b}`);
        }
        resolve(addr);
    });
};
