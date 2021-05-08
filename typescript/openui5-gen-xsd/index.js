/**
 *  Main conversion script from JSDoc-json to XSD
 * 
 * @author Christopher Kuhn <kuhnchris@kuhnchris.eu>
 */

const yargsObj = require("yargs");
const yargs = yargsObj.argv;

yargsObj.options({
    'aggregateAddAny': {
        default: false,
        describe: 'Add a <xs:any> element to aggregation(s).'
    },
    'convertnbsp': {
        default: true,
        describe: 'HTML &nbsp; convert to " "'
    },
    'o': {
        alias: 'outputFile',
        default: 'output.xsd',
        describe: 'output file to write XSD to'
    },
    'x': {
        alias: 'xmlns',
        default: 'sap.m',
        describe: 'XMLNS root'
    },
    'i': {
        alias: 'infile',
        default: '2.txt',
        describe: 'input JSDOC json to convert from'
    },
    's': {
        alias: 'showXSD',
        default: false,
        describe: 'print XSD to screen'
    },
    'w': {
        alias: 'writeXSD',
        default: true,
        describe: 'write XSD to outputFile'
    },
    'q': {
        alias: 'quiet',
        default: false,
        describe: 'hides output, good for batch processing'
    },
    'm': {
        alias: 'showMeta',
        default: false,
        describe: 'output meta objects after processing'
    },
    'n': {
        alias: 'showNS',
        default: false,
        describe: 'output mapping for non-xmlns objects'
    }
});

function main() {
    // @ts-ignore
    const outputFile = yargs["outputFile"] || yargs["o"] || "output.xsd";
    const topLevelNamespace = yargs["xmlns"] || yargs["x"] || "sap.m";
    // @ts-ignore
    const inFile = yargs["infile"] || yargs["i"] || "";
    const showXSD = yargs["showXSD"] || yargs["s"] || false;
    const writeXSD = yargs["writeXSD"] || yargs["w"] || true;
    const quiet = yargs["quiet"] || yargs["q"] || false;
    const showMeta = yargs["showMeta"] || yargs["m"] || false;
    const showNameSpaces = yargs["showNS"] || yargs["n"] || false;
    const addAnyToAggregates = yargs["aggregateAddAny"] || false;
    const convertNbsp = yargs["convertnbsp"] || true;

    if (yargs["help"] || yargs["h"]) {
        yargsObj.showHelp();
        return;
    }

    if (inFile === "" && typeof inFile === typeof "") {
        yargsObj.showHelp();
        return;
    }

    const importJSDoc = require("./lib/ImportJSDocs");
    const exportXSD = require("./lib/ExportSplitAsXSD");
    const exportTS = require("./lib/ExportSplitAsTS");
    var jsDocParse = new importJSDoc(inFile, topLevelNamespace);
    var xsdExport = new exportXSD(jsDocParse.namespaces, jsDocParse.metaobjs, topLevelNamespace, convertNbsp, addAnyToAggregates);
    var tsExport = new exportTS(jsDocParse.namespaces, jsDocParse.metaobjs, jsDocParse.enumobjs, topLevelNamespace, convertNbsp);
    //console.log(JSON.stringify(jsDocParse.metaobjs));
    console.log(tsExport.tsOutStr);

    return;


    if (showXSD)
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

}

main();