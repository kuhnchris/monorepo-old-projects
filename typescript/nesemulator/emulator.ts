import { Bus } from "./bus/bus";
import { StatusFlags6502 } from "./bus/cpu/6502";
import { readFileSync, readFile } from "fs";
export class EmulatorHelper {
    bus: Bus;

    initBus() {
        console.clear();
        this.bus = new Bus();
    }

    loadRomOLC() {
        var rom = "A2 0A 8E 00 00 A2 03 8E 01 00 AC 00 00 A9 00 18 6D 01 00 88 D0 FA 8D 02 00 EA EA EA";
        return rom;
    }
    loadRom(romname) {
        var rom = "";
        if (romname === "olc.nes") { rom = this.loadRomOLC(); }
        else {
            var fileContent = readFileSync("roms/" + romname);
            for (var i = 0; i < fileContent.length; i++) {
                if (rom.length > 0) {
                    rom = rom + " "
                }
                rom = rom + fileContent[i].toString(16);
            }
        }

        var offsetRom = 0x8000;
        rom.split(" ").forEach((ins, idx, arr) => {
            var val = Number.parseInt(ins, 16);
            this.bus.write(offsetRom, val);
            offsetRom++;
        });
        this.bus.write(0xfffc, 0x00);
        this.bus.write(0xfffd, 0x80);
    }
    setPC(pc) {
        this.bus.cpu.pc = Number.parseInt(pc, 16);
    }

    resetCPU() {
        this.bus.cpu.reset();
    }

    progressCPUClock() {
        this.bus.cpu.clock();
    }

    printMemory(expand = false) {
        var outStr = "";
        outStr = outStr + "\n" + "        0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F";
        outStr = outStr + "\n" + "        ----------------------------------------------";
        var line = "";
        //var offset = 0x00;
        var lastOffset;
        var maxMem = 64 * 1024;
        var hasValue = expand;
        var hasEverALine = false;
        var hasNoValue2ndLine = false;
        for (var i = 0; i < maxMem; i++) {
            var val = this.bus.cpu.RAM[i];
            if (val === undefined)
                val = 0x00;
            else
                hasValue = true;
            var hexVal = val.toString(16);
            if (hexVal.length < 2)
                hexVal = "0" + hexVal;
            hexVal = hexVal.toUpperCase();

            line = line + " " + hexVal;
            if ((i + 1) % 16 === 0 && i !== 0) {
                if (hasValue) {

                    outStr = outStr + "\n" + "$" + (i - 15).toString(16).padStart(4, "0") + ": " + line;
                    hasNoValue2ndLine = expand;
                    hasEverALine = true;
                }
                if (!hasValue && !hasNoValue2ndLine && hasEverALine) {
                    outStr = outStr + "\n" + "...";
                    hasNoValue2ndLine = true;
                }
                line = "";
                hasValue = expand;

            }
            lastOffset = i;

        }

        //outStr = outStr + "\n" + "$" + (lastOffset - 15).toString(16) + ": " + line;

        //outStr = outStr + "\n" + "'c': clock | 'm': memory dump";
        return outStr;
    }

    disassemble() {
        var myPc = this.bus.cpu.pc;
        var i = myPc - 8;
        var outStr = "";
        var currentLine = false;
        while (i < myPc + 32) {
            var ins = this.bus.cpu.RAM[i];
            if (ins === undefined)
                ins = 0x00;
            var obj = this.bus.cpu.lookup[ins];
            if (obj) {
                var line = "$" + i.toString(16) + ": (" + obj.addrMode + ") " + obj.mnemonic;
                currentLine = this.bus.cpu.pc === i;
                if (obj.addrMode !== "IMP")//&& obj.addrMode !== "ABS")
                {
                    i = i + 1;
                    if (this.bus.cpu.RAM[i] !== undefined)
                        line = line + " " + this.bus.cpu.RAM[i].toString(16);
                }
                if (obj.addrMode === "ABS" || obj.addrMode === "ABY" || obj.addrMode === "ABX" || obj.addrMode === "IND") {
                    i = i + 1;
                    if (this.bus.cpu.RAM[i]! == undefined)
                        line = line + " " + this.bus.cpu.RAM[i].toString(16);

                }
                if (currentLine)
                    line = ">" + line;
                else
                    line = " " + line;

                //console.log(this.bus.cpu.pc + " vs. " + i);

                outStr = outStr + "\n" + line;
            }

            i = i + 1;
        }
        return outStr;
    }

    cpuParameters() {
        var outStr = "";
        try {
            outStr = outStr + "\n" + " A: " + this.bus.cpu.a.toString(16);
            outStr = outStr + "\n" + " X: " + this.bus.cpu.x.toString(16);
            outStr = outStr + "\n" + " Y: " + this.bus.cpu.y.toString(16);
            outStr = outStr + "\n" + "PC: " + this.bus.cpu.pc.toString(16);
            outStr = outStr + "\n" + "ST: " + this.bus.cpu.stkp.toString(16);
            outStr = outStr + "\n" + "---";
            outStr = outStr + "\n" + "CPU cycles: " + this.bus.cpu.cycles.toString(16);
            outStr = outStr + "\n" + "fetched: " + this.bus.cpu.fetched.toString(16);
            outStr = outStr + "\n" + "addr_abs: " + this.bus.cpu.addr_abs.toString(16);
            outStr = outStr + "\n" + "addr_rel: " + this.bus.cpu.addr_rel.toString(16);
            outStr = outStr + "\n" + "status: " + (this.bus.cpu.status >>> 0).toString(2);
            outStr = outStr + "\n" + "---";
            outStr = outStr + "\n" + "C Z I D B U V N" + "\n";
            outStr = outStr + this.bus.cpu.getFlag(StatusFlags6502.C) + " ";
            outStr = outStr + this.bus.cpu.getFlag(StatusFlags6502.Z) + " ";
            outStr = outStr + this.bus.cpu.getFlag(StatusFlags6502.I) + " ";
            outStr = outStr + this.bus.cpu.getFlag(StatusFlags6502.D) + " ";
            outStr = outStr + this.bus.cpu.getFlag(StatusFlags6502.B) + " ";
            outStr = outStr + this.bus.cpu.getFlag(StatusFlags6502.U) + " ";
            outStr = outStr + this.bus.cpu.getFlag(StatusFlags6502.V) + " ";
            outStr = outStr + this.bus.cpu.getFlag(StatusFlags6502.N) + " ";
        } catch (e) {
            outStr = "error.";
        }

        return outStr;
    }
}