/**
 *  Main conversion script from JSDoc-json to XSD
 *
 * @author Christopher Kuhn <kuhnchris@kuhnchris.eu>
 */

import * as util from "util";

import yargsObj = require("yargs");
import * as exportTS from "./lib/ExportSplitAsTS";
import * as ImportJSDocs from "./lib/ImportJSDocs";

const yargs = yargsObj.argv;

yargsObj.options({
    aggregateAddAny: {
        default: false,
        describe: "Add a <xs:any> element to aggregation(s).",
    },
    convertnbsp: {
        default: true,
        describe: "HTML &nbsp; convert to ' '",
    },
    i: {
        alias: "infile",
        default: "2.txt",
        describe: "input JSDOC json to convert from",
    },
    m: {
        alias: "showMeta",
        default: false,
        describe: "output meta objects after processing",
    },
    n: {
        alias: "showNS",
        default: false,
        describe: "output mapping for non-xmlns objects",
    },
    o: {
        alias: "outputFile",
        default: "output.xsd",
        describe: "output file to write XSD to",
    },
    q: {
        alias: "quiet",
        default: false,
        describe: "hides output, good for batch processing",
    },
    s: {
        alias: "showXSD",
        default: false,
        describe: "print XSD to screen",
    },
    w: {
        alias: "writeXSD",
        default: true,
        describe: "write XSD to outputFile",
    },
    x: {
        alias: "xmlns",
        default: "sap.m",
        describe: "XMLNS root",
    },
});

function main() {
    const outputFile: string = yargs.outputFile as string || yargs.o as string || "output.xsd";
    const topLevelNamespace: string = yargs.xmlns as string || yargs.x as string || "sap.m";
    const inFile: string = yargs.infile as string || yargs.i as string || "";
    /*const showXSD = yargs["showXSD"] || yargs["s"] || false;
    const writeXSD = yargs["writeXSD"] || yargs["w"] || true;
    const quiet = yargs["quiet"] || yargs["q"] || false;
    const showMeta = yargs["showMeta"] || yargs["m"] || false;
    const showNameSpaces = yargs["showNS"] || yargs["n"] || false;
    const addAnyToAggregates = yargs["aggregateAddAny"] || false;
    const convertNbsp = yargs["convertnbsp"] || true;*/

    if (yargs.help || yargs.h) {
        yargsObj.showHelp();
        return;
    }

    if (inFile === "" && typeof inFile === typeof "") {
        yargsObj.showHelp();
        return;
    }

    const jsDocParse = new ImportJSDocs.ImportJSDocs(inFile, topLevelNamespace);
    const tsExport = exportTS.ExportSplitAsTS.parseNew(jsDocParse.preparedObjects, topLevelNamespace, jsDocParse.namespaces);
    // var xsdExport = new exportXSD(jsDocParse.namespaces, jsDocParse.metaobjs, topLevelNamespace, convertNbsp, addAnyToAggregates);
    // var tsExport = new exportTS(jsDocParse.namespaces, jsDocParse.metaobjs, jsDocParse.enumobjs, topLevelNamespace, convertNbsp);
    // console.log(JSON.stringify(jsDocParse.metaobjs));
    // @ts-nocheck
    console.log(tsExport);
    /*console.log(util.inspect(jsDocParse.preparedObjects,{
        colors: true,
        depth: 99,

    }));*/
    /*
    let spaces = 0;
    var parseP = function(e: ImportJSDocs.IJSDocImportObject){
        console.log(" ".repeat(spaces)+e.nodeType+": "+e.name);
        spaces = spaces + 2;
        if (e.children)
            e.children.forEach(parseP);
        if (e.methods)
            e.methods.forEach(parseP);
        spaces = spaces - 2;
    }
    jsDocParse.preparedObjects.forEach(parseP);

    return;
    */

    /*if (showXSD)
        console.log(xsdExport.xsdOutStr);
    if (writeXSD) {
        // @ts-ignore
        fs.writeFileSync(outputFile, xsdExport.xsdOutStr);
    }
    if (!quiet)
        console.log(`wrote XSD to ${outputFile}`);
    if (showMeta)
        console.log(`Internal Meta Object: ${JSON.stringify(jsDocParse.metaobjs)}`);
    if (showNameSpaces)
        console.log(`Exported namespaces: ${JSON.stringify(jsDocParse.namespaces)}`);
        */

}

main();
