export class SingleTransaction {
    wallet: any;
    to: string;
    num: string;
    onSuccess: (msg: any) => void;
    onError: (err: any) => void;

    constructor(wallet: any, to: string, num: string, onSuccess: (msg: any) => void, onError: (err: any) => void) {
        this.wallet = wallet;
        this.to = to;
        this.num = num;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }
}
