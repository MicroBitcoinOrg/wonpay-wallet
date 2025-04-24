// @ts-ignore
import * as aes256 from 'aes256';
import {atob} from 'js-base64';

export const encryptData = (data: any, key: string) => {
    if (key) {
        return aes256.encrypt(key, data);
    }

    return null;
};

export const decryptData = (data: any, key: string) => {
    if (key) {
        return aes256.decrypt(key, data);
    }

    return null;
};

export const writeUInt64LE = (buffer: Buffer, value: any, offset: any) => {
    buffer.writeInt32LE(value & -1, offset);
    buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4);
    return offset + 8;
};

export const base64ToHex = (str: string) => {
    const raw = atob(str);
    let result = '';

    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += hex.length === 2 ? hex : '0' + hex;
    }

    return result.toUpperCase();
};
