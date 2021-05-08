export class Instruction6502 {
    mnemonic: string;
    clockCycles: number;
    addrMode: string;
    operate: string;

    constructor(mnemonic: string,  op: string, addr: string, cycles: number){
        this.mnemonic = mnemonic;
        this.clockCycles = cycles;
        this.addrMode = addr;
        this.operate = op;
    }
}