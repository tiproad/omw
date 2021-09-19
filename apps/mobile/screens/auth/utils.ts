import "react-native-get-random-values"

export const sanitizeCognitoErrorMessage = (message: string): string => {
    let sanitized = message.slice();
    sanitized = sanitized.replace('phone_number', 'phone number');
    return sanitized;
};

export function getRandomString(bytes: number) {
    const randomValues = new Uint8Array(bytes);
    crypto.getRandomValues(randomValues);
    return Array.from(randomValues).map(intToHex).join('');
}

function intToHex(nr: number) {
    return nr.toString(16).padStart(2, '0');
}