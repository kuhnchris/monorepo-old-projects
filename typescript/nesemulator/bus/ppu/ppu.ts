import { Bus } from "../bus"
import { Cpu6502 } from "../cpu/6502"

export class PPUFlags {
    NameTableLow = 1<<0 // 0 = 0x2000, 1 = 0x2400, 2 = 0x2800, 3 = 0x2C00
    NameTableHigh = 1<<1
    VRAMInc = 1<<2
    SpritePatternTable = 1<<3 // 0 = 0x00, 1 = 0x1000
    BackgroundPatternTable = 1<<4
    SpriteSize = 1<<5 // 0 = 8x8, 1 = 8x16
    PPUMasterSlaveSelect = 1<<6 // 0 = backdrop from EXT, 1 = color on ext
    NMIonVBI = 1<<7
}

export class PPU {
    PPUCTRL: number
    PPUMASK: number
    PPUSTATUS: number
    OAMADDR: number
    OAMDATA: number
    PPUSCROLL: number
    PPUADDR: number
    PPUDATA: number
    OAMDMA: number

    bus: Bus
    cpu: Cpu6502

    initPPU(bus: Bus){
        this.PPUCTRL = 0x00;
        this.PPUMASK = 0x00;
        this.PPUSTATUS = 0x00;
        this.OAMADDR = 0x00;
        this.OAMDATA = 0x00;
        this.PPUSCROLL = 0x00;
        this.PPUADDR = 0x00;
        this.PPUDATA = 0x00;
        this.OAMDMA = 0x00;
        this.bus = bus;
        this.cpu = bus.cpu;

    }
}