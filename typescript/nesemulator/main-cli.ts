import { Bus } from "./bus/bus";
const readline = require('readline');

//var quit = false;
console.log("setting up readline/input...");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (str == "q")
        process.exit();
    if (str == "c"){
        console.log("clock...")
        bus.cpu.clock();
        console.log("clock done...")
    }
    if (str == "m")
        printMemory();
    if (str == "d")
        disassemble();
});
console.log("remember: press 'q' to exit!");

console.log("instancing global BUS");
var bus = new Bus();
var rom = "A2 0A 8E 00 00 A2 03 8E 01 00 AC 00 00 A9 00 18 6D 01 00 88 D0 FA 8D 02 00 EA EA EA";
var offsetRom = 0x8000;
console.log("Loading ROM into memory offset ", offsetRom.toString(16));
rom.split(" ").forEach((ins, idx, arr) =>  {
    var val = Number.parseInt(ins, 16);
    //console.log("Wrote: "+val+" @ "+offsetRom);
    bus.write(offsetRom, val);
    offsetRom++;
});
// reset vector
bus.write(0xfffc, 0x00);
bus.write(0xfffd, 0x80);
console.log("Ready! Resetting CPU...");
bus.cpu.reset();

printMemory();
function printMemory() {
    console.log("        0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F");
    console.log("        ----------------------------------------------");
    var line = "";
    //var offset = 0x00;
    var lastOffset;
    var maxMem = 64 * 1024;
    var hasValue = false;
    var hasEverALine = false;
    var hasNoValue2ndLine = false;
    for(var i = 0; i < maxMem; i++){
        var val = bus.cpu.RAM[i];
        if (val === undefined)
            val = 0x00;
        else
            hasValue = true;
        var hexVal = val.toString(16);
        if (hexVal.length < 2)
            hexVal = "0"+hexVal;
        hexVal = hexVal.toUpperCase();

        line = line + " " + hexVal;
        if (i % 16 == 0) {
            if (hasValue) {
                console.log("$" + (i - 16).toString(16) + ": " + line);
                hasNoValue2ndLine = false;
                hasEverALine = true;
            }
            if (!hasValue && !hasNoValue2ndLine && hasEverALine){
                console.log("...");
                hasNoValue2ndLine = true;
            }
            line = "";
            hasValue = false;
            
        }
        lastOffset = i;
   
    }
    /*
    bus.cpu.RAM.forEach((i, offset) => {
        //console.log("i: "+i+" - offset "+offset);
        var val = i;
        if (val === undefined)
            val = 0x00;
        var hexVal = val.toString(16);
        if (hexVal.length < 2)
            hexVal = "0"+hexVal;
        hexVal = hexVal.toUpperCase();

        line = line + " " + hexVal;
        if (offset % 16 == 0) {
            console.log("$" + (offset - 16).toString(16) + ": " + line);
            line = "";
        }
        lastOffset = offset;
        //offset = offset + 
    });*/
    console.log("$" + (lastOffset-16).toString(16) + ": " + line);

    console.log("'c': clock | 'm': memory dump");
}

function disassemble(){
    var myPc = bus.cpu.pc;
    var i = myPc - 8;
/*    var functionNames = {};

    Object.getOwnPropertyNames(bus.cpu).forEach(function(property) {
    //if(typeof bus.cpu[property] === 'function') {
        functionNames[bus.cpu[property]] = property;
        //functionNames.push({"func": obj[property], "name": property});
    //}
    });
    console.log("functions: "+JSON.stringify(functionNames));*/
    while (i < myPc+32){
        var ins = bus.cpu.RAM[i];
        if (ins === undefined)
            ins = 0x00;
        var obj = bus.cpu.lookup[ins];
        if (obj){
            var line = "$"+i.toString(16)+": ("+obj.addrMode+") "+obj.mnemonic;
            
            if (obj.addrMode !== "IMP" )//&& obj.addrMode !== "ABS")
            {
                i = i + 1;
                if (bus.cpu.RAM[i] !== undefined)
                    line = line + " " + bus.cpu.RAM[i].toString(16);
            }
            if (obj.addrMode === "ABS"){
                i = i + 1;
                if (bus.cpu.RAM[i] !== undefined)
                    line = line + " " + bus.cpu.RAM[i].toString(16);

            }
            if (bus.cpu.pc == i)
                line = ">"+line;
            console.log(line);
        }

        i = i + 1;
    }
}