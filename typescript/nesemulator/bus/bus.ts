import { Cpu6502 } from "./cpu/6502";

export class Bus {
    cpu: Cpu6502;


    write(addr: number, data: number){
        if (addr >= 0x0000 && addr <= 0xFFFF)
            this.cpu.write(addr,data);
    }
    read(addr: number): number{
        if (addr >= 0x0000 && addr <= 0xFFFF)
            return this.cpu.read(addr);
        else
            return -1;
    }

    constructor() {
        // init ram
        this.cpu = new Cpu6502();
        this.cpu.init(this);
    }
}