import { clock } from "./../utils/clock";
import { Bus } from "./../bus";
import { Instruction6502 } from "./instruction";
import { lut } from "./../utils/fillLookupTable";

export class StatusFlags6502 {
    public static C: number = 1 << 0;
    public static Z: number = 1 << 1;
    public static I: number = 1 << 2;
    public static D: number = 1 << 3;
    public static B: number = 1 << 4;
    public static U: number = 1 << 5;
    public static V: number = 1 << 6;
    public static N: number = 1 << 7;
    /*public static C: number = 0;
    public static Z: number = 1;
    public static I: number = 2;
    public static D: number = 3;
    public static B: number = 4;
    public static U: number = 5;
    public static V: number = 6;
    public static N: number = 7;*/
}

export class Cpu6502 {

    // refs
    busRef: Bus;
    cpuClock: clock;

    // cpu objs
    RAM: number[];
    a: number;
    x: number;
    y: number;
    stkp: number;
    pc: number;
    status: number;

    // utils
    fetched: number;
    addr_abs: number;
    addr_rel: number;
    opcode: number;
    cycles: number;
    lookup: Instruction6502[];

    init(bus: Bus, memorySize: number = 64 * 1024) {
        this.RAM = new Array(memorySize);
        this.busRef = bus;
        this.reset();
        this.lookup = lut.fillLUT();

    }

    reset() {
        // RESET
        this.a = 0x00;
        this.x = 0x00;
        this.y = 0x00;
        this.stkp = 0x00;
        this.pc = 0x0000;
        this.status = 0x00;

        this.addr_abs = 0xfffc;
        var lo = this.read(this.addr_abs + 0);
        var hi = this.read(this.addr_abs + 1);
        this.pc = (hi << 8) | lo;

        this.addr_rel = 0x0000;
        this.addr_abs = 0x0000;
        this.fetched = 0x00;

        this.cycles = 8;
    }

    write(addr: number, data: number) {
        this.RAM[addr] = data;
    }
    read(addr: number): number {
        return this.RAM[addr];
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // addr modes
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    IMP(): number {
        this.fetched = this.a;
        return 0;
    };
    ZP0(): number {
        this.addr_abs = this.read(this.pc);
        this.pc++;
        this.addr_abs &= 0x00ff; // masking
        return 0;
    };
    ZPY(): number {
        this.addr_abs = this.read(this.pc) + this.y;
        this.pc++;
        this.addr_abs &= 0x00ff; // masking
        return 0;
    };
    ABS(): number {
        var lo = this.read(this.pc);
        this.pc++;
        var hi = this.read(this.pc);
        this.pc++;

        this.addr_abs = (hi << 8) | lo;
        return 0;
    };
    ABY(): number {
        var lo = this.read(this.pc);
        this.pc++;
        var hi = this.read(this.pc);
        this.pc++;

        this.addr_abs = (hi << 8) | lo;
        this.addr_abs += this.y;
        if ((this.addr_abs & 0xff00) != (hi << 8)) {
            return 1;
        } else {
            return 0;
        }
    };
    IZX(): number {
        var t = this.read(this.pc);
        this.pc++;
        var lo = this.read((t + this.x) & 0x00FF);
        var hi = this.read((t + this.x + 1) & 0x00FF);
        this.addr_abs = (hi << 8) | lo;
        return 0;
    };
    IMM(): number {
        this.addr_abs = this.pc++;
        return 0;
    };
    ZPX(): number {
        this.addr_abs = this.read(this.pc) + this.x;
        this.pc++;
        this.addr_abs &= 0x00ff; // masking
        return 0;
    };
    REL(): number {
        console.log("pc: " + this.pc.toString(16) + " - addr_rel: " + this.addr_rel.toString(16));
        this.addr_rel = this.read(this.pc);
        this.pc++;
        console.log("pc: " + this.pc.toString(16) + " - addr_rel: " + this.addr_rel.toString(16));
        /*if ((this.addr_rel & 0x80))
            this.addr_rel |= 0xFF00;*/

        console.log("pc: " + this.pc.toString(16) + " - addr_rel: " + this.addr_rel.toString(16) + " b" + this.addr_rel.toString(2));
        if (this.addr_rel & 0x80) {
            this.addr_rel = (0x100 - this.addr_rel);
            this.addr_rel = this.addr_rel * -1;
        }
        console.log("pc: " + this.pc.toString(16) + " - addr_rel: " + this.addr_rel.toString(16) + " b" + this.addr_rel.toString(2));
        return 0;
    };
    ABX(): number {
        var lo = this.read(this.pc);
        this.pc++;
        var hi = this.read(this.pc);
        this.pc++;

        this.addr_abs = (hi << 8) | lo;
        this.addr_abs += this.x;
        if ((this.addr_abs & 0xff00) != (hi << 8)) {
            return 1;
        } else {
            return 0;
        }
    };
    IND(): number {
        var lo = this.read(this.pc);
        this.pc++;
        var hi = this.read(this.pc);
        this.pc++;

        var ptr = (hi << 8) | lo;

        if (lo == 0x00ff) {
            this.addr_abs = (this.read(ptr && 0xff00) << 8 | this.read(ptr + 0));
        } else {
            this.addr_abs = (this.read(ptr + 1) << 8 | this.read(ptr + 0));
        }
        return 0;

    };
    IZY(): number {
        var t = this.read(this.pc);
        this.pc++;
        var lo = this.read(t & 0x00FF);
        var hi = this.read((t + 1) & 0x00FF);
        this.addr_abs = (hi << 8) | lo;
        this.addr_abs += this.y;

        if ((this.addr_abs & 0xFF00) != (hi << 8)) {
            return 1;
        }
        return 0;

    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // opcodes
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    ADC(): number {
        this.fetch();
        var tmp = this.a + this.fetched + this.getFlag(StatusFlags6502.C);
        this.setFlag(StatusFlags6502.C, tmp > 255 ? 1 : 0);
        this.setFlag(StatusFlags6502.Z, (tmp & 0x00ff) === 0 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, tmp & 0x80 ? 1 : 0);
        this.setFlag(StatusFlags6502.V, (~(this.a ^ this.fetched) & (this.a & tmp)) & 0x80 ? 1 : 0);
        this.a = tmp & 0x00ff;
        return 1;
    };
    AND(): number {
        this.fetch();
        this.a = this.a & this.fetched;
        this.setFlag(StatusFlags6502.Z, this.a == 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, this.a & 0x80 ? 1 : 0);
        return 1;
    };
    ASL(): number {
        /* ! */
        this.fetch();
        var tmp = this.fetched << 1;
        
        if (this.lookup[this.opcode].addrMode === "IMP") {
            this.a = tmp & 0x00ff;
        } else {
            this.write(this.addr_abs, tmp & 0x00FF);
        }        
        this.setFlag(StatusFlags6502.Z, (tmp & 0x00FF) == 0x00 ? 1: 0);
        this.setFlag(StatusFlags6502.C, (tmp & 0xFF00) > 0 ? 1: 0);
        this.setFlag(StatusFlags6502.N, tmp & 0x80);
        
        return 0;
    };
    BCC(): number {
        if (this.getFlag(StatusFlags6502.C) == 0) {
            this.cycles++;
            this.addr_abs = this.pc + this.addr_rel;
            if ((this.addr_abs & 0xff00) != (this.pc & 0xff00))
                this.cycles++;

            this.pc = this.addr_abs;
        }
        return 0;

    };
    BCS(): number {

        if (this.getFlag(StatusFlags6502.C) == 1) {
            this.cycles++;
            this.addr_abs = this.pc + this.addr_rel;
            if ((this.addr_abs & 0xff00) != (this.pc & 0xff00))
                this.cycles++;

            this.pc = this.addr_abs;
        }
        return 0;
    };
    BEQ(): number {
        if (this.getFlag(StatusFlags6502.Z) == 1) {
            this.cycles++;
            this.addr_abs = this.pc + this.addr_rel;
            if ((this.addr_abs & 0xff00) != (this.pc & 0xff00))
                this.cycles++;

            this.pc = this.addr_abs;
        }
        return 0;

    };
    BIT(): number { 
        this.fetch();
        var tmp = this.a & this.fetched;
        this.setFlag(StatusFlags6502.Z, ((tmp & 0x00ff) == 0x00) ? 1:0);
        this.setFlag(StatusFlags6502.N, this.fetched & (1<<7));
        this.setFlag(StatusFlags6502.V, this.fetched & (1<<6));
        
        return 0;
     };
    BMI(): number {
        if (this.getFlag(StatusFlags6502.N) == 1) {
            this.cycles++;
            this.addr_abs = this.pc + this.addr_rel;
            if ((this.addr_abs & 0xff00) != (this.pc & 0xff00))
                this.cycles++;

            this.pc = this.addr_abs;
        }
        return 0;

    };
    BNE(): number {
        if (this.getFlag(StatusFlags6502.Z) == 0) {
            this.cycles++;
            this.addr_abs = this.pc + this.addr_rel;
            if ((this.addr_abs & 0xff00) != (this.pc & 0xff00))
                this.cycles++;

            this.pc = this.addr_abs;
        }
        return 0;

    };
    BPL(): number {
        if (this.getFlag(StatusFlags6502.N) == 0) {
            this.cycles++;
            this.addr_abs = this.pc + this.addr_rel;
            if ((this.addr_abs & 0xff00) != (this.pc & 0xff00))
                this.cycles++;

            this.pc = this.addr_abs;
        }
        return 0;

    };
    BRK(): number { 
        this.pc++; // post BRK
        this.setFlag(StatusFlags6502.I, 1);
        this.write(0x0100+this.stkp, (this.pc >> 8) & 0x00ff);
        this.stkp--;
        this.write(0x0100+this.stkp, this.pc & 0x00ff);
        this.stkp--;

        this.setFlag(StatusFlags6502.B, 1);
        this.write(0x0100+this.stkp, this.status);
        this.stkp--;
        this.setFlag(StatusFlags6502.B, 0);
        
        this.pc = this.read(0xfffe) | (this.read(0xffff) << 8);

        return 0; 
    
    };
    BVC(): number {
        if (this.getFlag(StatusFlags6502.V) == 0) {
            this.cycles++;
            this.addr_abs = this.pc + this.addr_rel;
            if ((this.addr_abs & 0xff00) != (this.pc & 0xff00))
                this.cycles++;

            this.pc = this.addr_abs;
        }
        return 0;

    };
    BVS(): number {
        if (this.getFlag(StatusFlags6502.V) == 1) {
            this.cycles++;
            this.addr_abs = this.pc + this.addr_rel;
            if ((this.addr_abs & 0xff00) != (this.pc & 0xff00))
                this.cycles++;

            this.pc = this.addr_abs;
        }
        return 0;

    };
    CLC(): number {
        this.setFlag(StatusFlags6502.C, 0);
        return 0;
    };
    CLD(): number {
        this.setFlag(StatusFlags6502.D, 0);
        return 0;
    };
    CLI(): number {
        this.setFlag(StatusFlags6502.I, 0);
        return 0;
    };
    CLV(): number {
        this.setFlag(StatusFlags6502.V, 0);
        return 0;
    };
    CMP(): number { 
        
        this.fetch();
        var tmp = this.a - this.fetched;

        this.setFlag(StatusFlags6502.C, this.a > this.fetched ? 1 : 0);
        this.setFlag(StatusFlags6502.Z, tmp == 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, tmp & 0x80);
        return 0;
    };
    CPX(): number {
        this.fetch();
        var tmp = this.x - this.fetched;

        this.setFlag(StatusFlags6502.C, this.x > this.fetched ? 1 : 0);
        this.setFlag(StatusFlags6502.Z, tmp == 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, tmp & 0x80);
        return 0;
     };
    CPY(): number { 
        
        this.fetch();
        var tmp = this.y - this.fetched;

        this.setFlag(StatusFlags6502.C, this.y > this.fetched ? 1 : 0);
        this.setFlag(StatusFlags6502.Z, tmp == 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, tmp & 0x80);
        return 0;
     };
    DEC(): number {
        var val = this.read(this.addr_abs);
        val = val - 1;
        this.write(this.addr_abs, val);
        this.setFlag(StatusFlags6502.Z, val == 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, val & 0x80 ? 1 : 0);
        return 0;
    };
    DEX(): number {
        this.x = this.x - 1;
        this.setFlag(StatusFlags6502.Z, this.x == 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, this.x & 0x80 ? 1 : 0);
        return 0;
    };
    DEY(): number {
        //        console.log("Decrease Y");
        this.y = this.y - 1;
        this.setFlag(StatusFlags6502.Z, this.y === 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, this.y & 0x80 ? 1 : 0);
        return 0;
    };
    EOR(): number { 
        this.fetch();
        this.a = this.a ^ this.fetched; 

        this.setFlag(StatusFlags6502.Z, this.a === 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, this.a & 0x80 ? 1 : 0);
        return 0;
     };
    INC(): number {
        this.fetch();
        var tmp = this.fetched + 1;

        if (this.lookup[this.opcode].addrMode === "IMP") {
            this.a = tmp & 0x00ff;
        } else {
            this.write(this.addr_abs, tmp & 0x00FF);
        }        
        this.setFlag(StatusFlags6502.Z, tmp == 0x00 ? 1: 0);
        this.setFlag(StatusFlags6502.N, tmp & 0x80);
        return 0;
    };
    INX(): number {
        this.x = this.x + 1;
        this.setFlag(StatusFlags6502.Z, this.x === 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, this.x & 0x80 ? 1 : 0);
        return 0;
    };
    INY(): number {
        this.y = this.y + 1;
        this.setFlag(StatusFlags6502.Z, this.y === 0x00 ? 1 : 0);
        this.setFlag(StatusFlags6502.N, this.y & 0x80 ? 1 : 0);
        return 0;
    };
    JMP(): number { 
        this.pc = this.addr_abs;
        return 0;
    };
    JSR(): number { // jump subroutine
        this.pc--;
        this.write(0x0100+this.stkp, (this.pc >> 8) & 0x00ff);
        this.stkp--;
        this.write(0x0100+this.stkp, (this.pc) & 0x00ff);
        this.stkp--;

        this.pc = this.addr_abs;

        return 0;
    };

    LDA(): number {
        this.a = this.read(this.addr_abs);
        return 0;
    };

    LDX(): number {
        this.x = this.read(this.addr_abs);
        return 0;

    };

    LDY(): number {
        this.y = this.read(this.addr_abs);
        return 0;
    };

    LSR(): number {
        this.fetch();
        this.setFlag(StatusFlags6502.C, this.fetched & 0x0001);
        var tmp = this.fetched >> 1;

        this.setFlag(StatusFlags6502.Z, tmp == 0x00 ? 0 : 1);
        this.setFlag(StatusFlags6502.N, tmp & 0x80);

        if (this.lookup[this.opcode].addrMode === "IMP") {
            this.a = tmp & 0x00ff;
        } else {
            this.write(this.addr_abs, tmp & 0x00FF);
        }
        return 0;
    };
    NOP(): number {
        return 0;
    };
    ORA(): number { 
        this.fetch();
        this.a = this.a | this.fetched;
        
        this.setFlag(StatusFlags6502.Z, this.a == 0x00 ? 0 : 1);
        this.setFlag(StatusFlags6502.N, this.a & 0x80);
        return 0; 
    };
    PHA(): number {
        this.write(0x0100 + this.stkp, this.a);
        this.stkp--;
        return 0;

    };
    PHP(): number { 
        this.write(0x0100+this.stkp, this.status);
        this.stkp--;
 
        return 0;
     };
    PLA(): number {
        this.stkp++;
        this.a = this.read(0x0100 + this.stkp);
        this.setFlag(StatusFlags6502.Z, this.a == 0x00 ? 0 : 1);
        this.setFlag(StatusFlags6502.N, this.a & 0x80);
        return 0;
    };
    PLP(): number { 
        this.stkp++;
        this.status = this.read(0x0100+this.stkp);
        //this.setFlag(StatusFlags6502.U, 1);
        return 0;
    };
    ROL(): number {
        this.fetch();
        var tmp = (this.fetched << 1) | (this.getFlag(StatusFlags6502.C));
        this.setFlag(StatusFlags6502.C, tmp & 0x80);

        this.setFlag(StatusFlags6502.Z, tmp == 0x00 ? 0 : 1);
        this.setFlag(StatusFlags6502.N, tmp & 0x80);

        if (this.lookup[this.opcode].addrMode === "IMP") {
            this.a = tmp & 0x00ff;
        } else {
            this.write(this.addr_abs, tmp & 0x00FF);
        }

        // shift left // carry to bit 0, original bit 7 to carry
        return 0;
    };
    ROR(): number {
        this.fetch();
        var tmp = (this.getFlag(StatusFlags6502.C) << 7) | (this.fetched >> 1);
        this.setFlag(StatusFlags6502.C, this.fetched & 0x01);

        this.setFlag(StatusFlags6502.Z, tmp == 0x00 ? 0 : 1);
        this.setFlag(StatusFlags6502.N, tmp & 0x80);

        if (this.lookup[this.opcode].addrMode === "IMP") {
            this.a = tmp & 0x00ff;
        } else {
            this.write(this.addr_abs, tmp & 0x00FF);
        }

        // shift right // carry to bit 7, original bit 0 to carry
        return 0;
    };
    RTI(): number {
        this.stkp++;
        this.status = this.read(0x0100 + this.stkp);
        this.setFlag(StatusFlags6502.B, this.getFlag(StatusFlags6502.B) == 0 ? 1 : 0);
        this.setFlag(StatusFlags6502.U, this.getFlag(StatusFlags6502.U) == 0 ? 1 : 0);

        this.stkp++;
        this.pc = this.read(0x0100 + this.stkp);
        this.stkp++;
        this.pc |= this.read(0x0100 + this.stkp) << 8;

        return 0;

    };
    RTS(): number {
        this.stkp++;
        var lo = this.read(0x0100 + this.stkp);
        this.stkp++;
        var hi = this.read(0x0100 + this.stkp);

        this.pc = lo | (hi << 8);
        this.pc++;
        // return to subrutine
        return 0;
    };
    SBC(): number {
        this.fetch();
        var val = this.fetched ^ 0x00ff;
        var tmp = this.a + val + this.getFlag(StatusFlags6502.C);
        this.setFlag(StatusFlags6502.C, tmp > 255 ? 0 : 1);
        this.setFlag(StatusFlags6502.Z, (tmp & 0x00ff) == 0 ? 0 : 1);
        this.setFlag(StatusFlags6502.N, tmp & 0x0080 ? 0 : 1);
        this.setFlag(StatusFlags6502.V, ((tmp ^ this.a) & (tmp ^ val)) & 0x0080 ? 0 : 1);
        this.a = tmp & 0x00ff;
        return 1;

    };
    SEC(): number {
        this.setFlag(StatusFlags6502.C, 1);
        return 0;
    };
    SED(): number {
        this.setFlag(StatusFlags6502.D, 1);
        return 0;

    };
    SEI(): number {
        this.setFlag(StatusFlags6502.I, 1);
        return 0;

    };
    STA(): number {
        this.write(this.addr_abs, this.a);
        return 0;
    };
    STX(): number {
        this.write(this.addr_abs, this.x);
        return 0;
    };
    STY(): number {
        this.write(this.addr_abs, this.y);
        return 0;
    };
    TAX(): number {  // transfer a->x
        this.x = this.a;
        return 0;
    };
    TAY(): number {  // transfer a->y
        this.y = this.a;
        return 0;
    };
    TSX(): number {
        this.x = this.stkp;
        return 0;
    };
    TXA(): number {  // transfer X->A
        this.a = this.x;
        return 0;
    };
    TYA(): number {  // transfer Y->A
        this.a = this.y;
        return 0;
    };
    TXS(): number {
        this.stkp = this.x;
        return 0;
    };

    //invalid
    INV(): number { return 0; };

    clock() {
        if (this.cycles <= 0) {
            this.opcode = this.read(this.pc);
            this.pc++;

            if (this.lookup[this.opcode] === undefined) {
                console.log("The clock encountered an error! stopping.");
                this.pc--;
                return;
            }

            this.cycles = this.lookup[this.opcode].clockCycles;

            var addCycles1 = this[this.lookup[this.opcode].addrMode]();
            var addCycles2 = this[this.lookup[this.opcode].operate]();

            this.cycles = this.cycles + addCycles1 + addCycles2;
        }
        this.cycles--;

    }
    irq() {
        if (this.getFlag(StatusFlags6502.I) == 0) {
            this.write(0x0100 + this.stkp, (this.pc >> 8) & 0x00FF);
            this.stkp--;
            this.write(0x0100 + this.stkp, (this.pc) & 0x00FF);
            this.stkp--;

            this.setFlag(StatusFlags6502.B, 0);
            this.setFlag(StatusFlags6502.U, 1);
            this.setFlag(StatusFlags6502.I, 1);
            this.write(0x0100 + this.stkp, this.status);
            this.stkp--;

            this.addr_abs = 0xfffe;
            var lo = this.read(this.addr_abs + 0);
            var hi = this.read(this.addr_abs + 1);
            this.pc = (hi << 8) | lo;

            this.cycles = 7;
        }
    }
    nmi() {
        this.write(0x0100 + this.stkp, (this.pc >> 8) & 0x00FF);
        this.stkp--;
        this.write(0x0100 + this.stkp, (this.pc) & 0x00FF);
        this.stkp--;

        this.setFlag(StatusFlags6502.B, 0);
        this.setFlag(StatusFlags6502.U, 1);
        this.setFlag(StatusFlags6502.I, 1);
        this.write(0x0100 + this.stkp, this.status);
        this.stkp--;

        this.addr_abs = 0xfffa;
        var lo = this.read(this.addr_abs + 0);
        var hi = this.read(this.addr_abs + 1);
        this.pc = (hi << 8) | lo;

        this.cycles = 8;

    }

    getFlag(flag: number): number {
        /*this.status & flag;
        var flg = this.status.toString(2)[flag];
        if (flg === undefined)
            flg = "0";
        return Number.parseInt(flg);
        return 0;*/
        return this.status & flag;
    }
    setFlag(flag: number, val: number) {
        var bitmask;
        bitmask = flag;
        console.log("> status " + this.status.toString(2) + " - bitmask: " + bitmask.toString(2) + "  - flag: " + flag.toString(2) + " - val: " + val);
        if (val > 0) {
            this.status |= bitmask;
        } else {
            this.status &= ~bitmask;
        }
        console.log("< status " + this.status.toString(2) + " - bitmask: " + bitmask.toString(2) + "  - flag: " + flag.toString(2) + " - val: " + val);
    }
    fetch(): number {
    
        if (this.lookup[this.opcode].addrMode !== "IMP")
            this.fetched = this.read(this.addr_abs);
        return this.fetched;
    }
}