import {TronWeb} from 'tronweb';
import {decryptData} from '../../../utils/common';
import {TRON} from '../../../utils/constants';
import {Wallet} from '../../../types/Wallet';

// Initialize TronWeb instance
const getTronWeb = () => {
    const tronWeb = new TronWeb({
        fullHost: TRON.links.api!.url,
        headers: {
            'TRON-PRO-API-KEY': TRON.links.api!.key,
        },
    });
    return tronWeb;
};

export const sendMainTransaction = async (data: {
    withdrawAddress: string;
    amount: number;
    fee: number;
    wallet: Wallet.Wallet;
    password: string;
}) => {
    try {
        const tronWeb = getTronWeb();

        // Get the first address from wallet (main address)
        const fromAddress = data.wallet.depositAddress!;

        // Decrypt the private key for the main address
        const addressData = data.wallet.addresses.find(
            addr => addr.address === fromAddress,
        );

        if (!addressData) {
            throw new Error('Address not found in wallet');
        }

        const privateKey = decryptData(addressData.privateKey, data.password);

        // Convert amount from TRX to SUN (1 TRX = 1,000,000 SUN)
        const amountInSun = Math.floor(
            data.amount * Math.pow(10, TRON.currency.units),
        );

        // Create transaction
        const transaction = await tronWeb.transactionBuilder.sendTrx(
            data.withdrawAddress,
            amountInSun,
            fromAddress,
        );

        // Sign transaction
        const signedTransaction = await tronWeb.trx.sign(
            transaction,
            privateKey,
        );

        // Broadcast transaction
        const result = await tronWeb.trx.sendRawTransaction(signedTransaction);

        if (result.result) {
            return {txid: result.txid};
        } else {
            throw new Error(
                `Transaction failed: ${result.message || 'Unknown error'}`,
            );
        }
    } catch (error) {
        console.error('TRON sendMainTransaction error:', error);
        throw error;
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
    try {
        const tronWeb = getTronWeb();

        // Get the first address from wallet (main address)
        const fromAddress = data.wallet.depositAddress!;

        // Debug: Log the fromAddress
        console.log('TRON fromAddress:', fromAddress);

        // Decrypt the private key for the main address
        const addressData = data.wallet.addresses.find(
            addr => addr.address === fromAddress,
        );

        if (!addressData) {
            throw new Error('Address not found in wallet');
        }

        const privateKey = decryptData(addressData.privateKey, data.password);

        // Debug: Log the private key length (not the key itself)
        console.log('TRON privateKey length:', privateKey.length);

        // Set the default address and private key in TronWeb
        tronWeb.setAddress(fromAddress);
        tronWeb.setPrivateKey(privateKey);

        if (!data.currency.contract) {
            throw new Error(
                'Contract address is required for token transactions',
            );
        }

        // Get token contract info to determine decimals
        const contract = await tronWeb.contract().at(data.currency.contract);
        const decimalsResult = await contract.decimals().call();

        // Handle BigInt conversion properly
        const decimals =
            typeof decimalsResult === 'bigint'
                ? Number(decimalsResult)
                : Number(decimalsResult);

        // Convert amount based on token decimals
        const amountInSmallestUnit = Math.floor(
            data.amount * Math.pow(10, decimals),
        );

        // Send TRC20 transfer transaction using contract interface
        const txid = await contract
            .transfer(data.withdrawAddress, amountInSmallestUnit)
            .send({
                feeLimit: 100000000, // 100 TRX fee limit
            });

        console.log('TRON transaction sent successfully:', txid);
        return {txid};
    } catch (error) {
        console.error('TRON sendTokenTransaction error:', error);
        throw error;
    }
};

export const sendTransaction =
    (walletData: {wallet: Wallet.Wallet; password: string}) =>
    async (data: {
        withdrawAddress: string;
        amount: number;
        fee: number;
        currency: Wallet.Currency;
    }) => {
        if (data.currency.ticker === TRON.currency.ticker) {
            return sendMainTransaction({...data, ...walletData});
        } else {
            return sendTokenTransaction({...data, ...walletData});
        }
    };
