/**
 *  JSDOC2JSON
 *
 * @author Christopher Kuhn <kuhnchris@kuhnchris.eu>
 */

import fs = require("fs");
export interface IJSDocImportObject {
    children?: IJSDocImportObject[];
    properties?: IParameter[];
    parameters?: IParameter[];
    methods?: IJSDocImportObject[];
    events?: IParameter[]; // we'll deal with you alter.
    aggregations?: IParameter[]; // we'll deal with you alter.
    associations?: any[];
    comment?: string;
    extends?: string[];
    name?: string;
    fullname: string;
    scope?: string;
    returnType?: string;
    nodeType: string;
}
export interface IParameter {
    comment?: string;
    name: string;
    optional?: boolean;
    type?: string;
    value?: string;

    /* XML specifics */
    propType?: string; // non-xml type

    /* Complex Type(s) (yes, you can cascade 'em) */
    isComplexType?: boolean; // default false
    complexTypeChildren?: IParameter[]; // incase of object + object.xxx
}

export class ImportJSDocs {
    public preparedObjects: IJSDocImportObject[];
    public namespaces: Map<string, string>;

    constructor(inFile: string, topLevelNamespace: string) {

        this.initPreparedObject();

        // check input file
        // @ts-ignore
        if (!fs.existsSync(inFile)) {
            throw new Error(`cannot open ${inFile}.`);
        }

        // read input file (UTF16LE, because i'm on windows, so replacing U+FFFE aswell.)
        // TODO: try/catch
        const fileContent = fs.readFileSync(inFile, "utf16le").replace(/^\uFFFE/, "").substr(1);

        // parse JSON
        // TODO: try/catch
        const jsDocOutput = JSON.parse(fileContent);

        // define objects
        const metaobjs: { [id: string]: IJSDocImportObject } = {};
        this.namespaces = new Map<string, string>();
        const enumobjs = {};

        let cnt = 0;

        // loop over all jsdoc entries
        // @ts-nocheck
        for (const a in jsDocOutput) {
            if (!jsDocOutput.hasOwnProperty(a)) { continue; }
            const jsdocItem = jsDocOutput[a];

            // replace "anonymous"
            jsdocItem.longname = jsdocItem.longname.replace("<anonymous>~", topLevelNamespace + ".");
            jsdocItem.name = jsdocItem.name.replace("<anonymous>~", topLevelNamespace + ".");
            if (jsdocItem.extends !== undefined) {
                // if it's an array- take the first one
                if (typeof jsdocItem.extends === typeof []) {
                    jsdocItem.extends = jsdocItem.extends[0];
                }
                jsdocItem.extends = jsdocItem.extends.replace("<anonymous>~", topLevelNamespace + ".");
            }

            // TODO: FIX-ME NS-IF
            // ... just pretend 'namespace's are interfaces (for now)
            jsdocItem.kind = jsdocItem.kind.replace("namespace", "interface");

            // @debug
            // if (jsdocItem.name === "_getResourceBundle" || jsdocItem.longname.startsWith("sap.ui.core.Core")) {}else{ continue; }
            /*
            if (jsdocItem.longname.startsWith("sap.ui.core.Core")) {
                // no.
            } else { continue; }

            console.log(`${jsdocItem.kind} -> ${jsdocItem.longname} (name: ${jsdocItem.name})`);
            */

            // #1 - classes: we need classes for their inheritance, and namespace-resolution (xmlns)
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~ class ~~~~~~~~~~~~~~~~~~~~~~~~~~
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~ interface ~~~~~~~~~~~~~~~~~~~~~~~~~~
            if (jsdocItem.kind === "class" || jsdocItem.kind === "interface") {

                if (metaobjs[jsdocItem.name] === undefined) {
                    metaobjs[jsdocItem.name] = { properties: [{ name: ".dummy" }], comment: jsdocItem.description, fullname: jsdocItem.longname, name: jsdocItem.name, nodeType: jsdocItem.kind };
                    // this.addNewPreparedObjectWithStructure(metaobjs[jsdocItem["name"]]);
                }

                // if inheritance is in jsdoc:
                if (jsdocItem.augments !== undefined) {
                    // console.log(`extending: ${jsdocItem.name} => ${jsdocItem.augments}`);
                    if (metaobjs[jsdocItem.name].extends === undefined) {
                        metaobjs[jsdocItem.name].extends = [];
                    }

                    // if it's an array- take the first one
                    if (typeof jsdocItem.augments === typeof []) {
                        jsdocItem.augments = jsdocItem.augments[0];
                    }

                    // XXX-01: clean TLNS
                    let extName = (jsdocItem.augments.toString()).replace(topLevelNamespace + ".", "");
                    let refactorNameSpace = extName.split(".");
                    refactorNameSpace.pop();
                    refactorNameSpace = refactorNameSpace.join(".");
                    if (extName.split(".").length > 1) {
                        if (this.namespaces[refactorNameSpace] === undefined) {
                            this.namespaces[refactorNameSpace] = "n" + cnt;
                            cnt++;
                        }

                    }
                    extName = extName.replace(refactorNameSpace + ".", this.namespaces[refactorNameSpace] + ":");
                    if (jsdocItem.augments === "Object") {
                        // XXX-05: Ignore 'extends' of objects that intend litteraly "{}".
                    } else {
                        metaobjs[jsdocItem.name].extends.push(jsdocItem.augments);
                    }
                    // console.log(`extend added: ${metaobjs[jsdocItem.name].extends} -> ${extName}`);

                }

                this.addNewPreparedObjectWithStructure(metaobjs[jsdocItem.name]);
                // </>
            }

            // ~~~~~~~~~~~~~~~~~~~~~~~~~~ enum ~~~~~~~~~~~~~~~~~~~~~~~~~~
            if (jsdocItem.kind === "enum") {
                let splitName = jsdocItem.longname.split(".");
                let enumObj: IJSDocImportObject;

                const enumName = splitName[splitName.length - 1];

                splitName.pop();
                if (splitName.join(".") === topLevelNamespace) {
                    splitName = jsdocItem.memberof;
                } else {
                    /* special case just for sap.f.cards? */
                    // splitName.pop();
                    splitName = splitName.join(".");
                }
                enumObj = { extends: [splitName], name: enumName, fullname: jsdocItem.longname, nodeType: "enum", properties: [] };
                jsdocItem.properties.forEach((element) => {
                    enumObj.properties.push({ name: element.name, value: element.defaultvalue });

                });

                splitName = splitName.replace(topLevelNamespace, "");
                const enumSplitDecision = splitName.split(".").length > 1;
                if (enumSplitDecision) {
                    // additional namespace needed aaaaaaah
                } else {

                    if (enumobjs[enumName] === undefined) {
                        enumobjs[enumName] = enumObj;
                    }

                }
                this.addNewPreparedObjectWithStructure(enumObj);
            }
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~ function ~~~~~~~~~~~~~~~~~~~~~~~~~~
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~ constructor ~~~~~~~~~~~~~~~~~~~~~~~~~~
            if (jsdocItem.kind === "function" || jsdocItem.kind === "constructor") {
                if (jsdocItem.memberof === undefined) {
                    // console.log("error, no memberof: " + JSON.stringify(jsdocItem));
                    continue;
                }
                let splitName = jsdocItem.memberof.split(".");
                let methObj: IJSDocImportObject;
                splitName = splitName[splitName.length - 1];

                if (metaobjs[splitName] === undefined) {
                    // metaobjs[splitName] = { properties: [{ name: ".dummy" }], fullname: jsdocItem.longname.split(".").slice(0, -1).join("."), nodeType: "class", name: jsdocItem.name };
                    metaobjs[splitName] = { properties: [{ name: ".dummy" }], fullname: jsdocItem.memberof, nodeType: "class", name: splitName };
                    // this.addNewPreparedObjectWithStructure(metaobjs[splitName]);
                }
                if (metaobjs[splitName].methods === undefined) {
                    metaobjs[splitName].methods = [];
                }

                methObj = { fullname: jsdocItem.longname, nodeType: "method", parameters: [], name: jsdocItem.name, comment: jsdocItem.description };

                if (jsdocItem.params !== undefined) {
                    jsdocItem.params.forEach((element) => {
                        const paramObj: IParameter = {
                            comment: element.description,
                            // name: element.name.replace(/\./g, "_"), // TODO: fix-me (oSettings.*)
                            name: element.name,
                            optional: element.optional === undefined ? false : ((element.optional === "true" || element.optional === true) ? true : false),
                            type: (element.type !== undefined && element.type.names && element.type.names.length > 0) ? element.type.names[0] : "any",
                        };
                        if (paramObj.name.split(".").length > 1) {
                            // we have a nested object
                            // console.log(`complex type definition found for ${paramObj.name}`);

                            // 1. pick parent, set complex type to true
                            const objNest = paramObj.name.split(".");
                            const newParamName = objNest.pop();
                            paramObj.name = newParamName;
                            // ... we ASSUME that we get them in a proper list
                            // e.a. context: (object){ subContext (object): { param: string }}
                            // so we only need to care about the length - 2 object (0 based, e.a. the 2nd last object)

                            // core nest obj = first nest obj
                            let nestObj = methObj.parameters.find((v) => v.name === objNest[0]);
                            if (nestObj === undefined) {
                                // special workaround for... array[].xxx properties
                                nestObj = methObj.parameters.find((v) => v.name + "[]" === objNest[0]);
                            }

                            // remove first element since it's the methObj
                            objNest.splice(0, 1);
                            if (nestObj !== undefined) {
                                // loop over the entire sub-level(s)
                                objNest.forEach((val, idx, arr) => {
                                    // console.log(`look for new nest: ${val}`);
                                    const newNestObj = nestObj.complexTypeChildren !== undefined ? nestObj.complexTypeChildren.find((v) => v.name === val) : undefined;
                                    if (newNestObj !== undefined) {
                                        // console.log(`new nest: ${nestObj.name} -> ${newNestObj.name}`);
                                        nestObj = newNestObj;
                                    }
                                });

                                // we assume we are on objNest top-level, it may or may not be complex already
                                nestObj.isComplexType = true;
                                if (nestObj.complexTypeChildren === undefined) {
                                    nestObj.complexTypeChildren = [];
                                }
                                nestObj.complexTypeChildren.push(paramObj);
                            } else {
                                // console.log("inconsistancy! error fetching nestObj: " + objNest[0]);
                            }

                        } else {
                            // 'simple' type - add to list
                            methObj.parameters.push(paramObj);
                        }
                    });
                }

                methObj.scope = jsdocItem.scope === "static" ? jsdocItem.scope : jsdocItem.access ? jsdocItem.access : "public";

                if (jsdocItem.returns !== undefined &&
                    jsdocItem.returns.length > 0 &&
                    jsdocItem.returns[0].type !== undefined &&
                    jsdocItem.returns[0].type.names !== undefined &&
                    jsdocItem.returns[0].type.names.length > 0) {
                    methObj.returnType = jsdocItem.returns[0].type.names[0];
                } else {
                    methObj.returnType = "void";
                }

                if (metaobjs[splitName].methods.findIndex((e) => e.name === methObj.name) >= 0) {
                    // reject
                } else {
                    metaobjs[splitName].methods.push(methObj);
                }

                this.addNewPreparedObjectWithStructure(methObj);
            }

            // #2 - attributes/events/aggregations: currently (and for my workaround) all data is in the metadata.*.<item> structure
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~ member (only selected ones) ~~~~~~~~~~~~~~~~~~~~~~~~~~
            if (jsdocItem.kind === "member") {

                // temporary property object
                let propObj: IParameter;
                propObj = { name: jsdocItem.name };
                propObj.comment = jsdocItem.description;

                let splitA = jsdocItem.longname.split("#");
                if (splitA.length <= 1) {
                    const p = jsdocItem.longname.split(".");
                    const q = p.pop();
                    splitA = [p.join("."), q];
                }
                splitA[0] = splitA[0].split(".").pop();

                // part A[0] is the base object, part A[1] is the meta
                const splitB = splitA[1].split(".");
                if (splitB.length >= 3 && splitB[0] === "metadata" && splitB[1] === "specialSettings") {
                    // XXX-02: treat specialSettings like properties aswell (mostly due to: sap.ui.core.mvc)
                    splitB[1] = "properties";
                }
                // take all metadata entries that are not parameters (for example for events)
                if (splitB.length >= 3 && splitB[splitB.length - 2] !== "parameters") {
                    // meta object definition
                    if (metaobjs[splitA[0]] === undefined) {
                        metaobjs[splitA[0]] = {
                            aggregations: [],
                            associations: [],
                            events: [],
                            fullname: jsdocItem.name,
                            nodeType: "property",
                            properties: [],
                        };
                    }

                    // overwrite property name to metadata.xxx.[this part]
                    // for later use in <aaa [this part]="value" />

                    propObj.name = splitB[2];

                    if (splitB[1] === "aggregations") {
                        // special treatment for aggregations (for output)
                        propObj.type = ".undefined";
                    } else {
                        // assign output type for XSD
                        // TODO: get proper type
                        propObj.type = "xs:string";

                        if (jsdocItem.type !== undefined) {
                            propObj.propType = jsdocItem.type.names[0];
                        } else {
                            propObj.propType = "any";
                        }
                        // propObj["propType"] = "any";
                    }

                    // basically everything is optional
                    // TODO: evaluate optionallity (from metadata)
                    propObj.optional = true;
                    if (metaobjs[splitA[0]][splitB[1]] === undefined) {
                        metaobjs[splitA[0]][splitB[1]] = [];
                    }

                    // XXX-04: avoid duplicates (XSD complains)
                    let foundDuplicate = false;
                    metaobjs[splitA[0]][splitB[1]].forEach((x) => {
                        if (x.name === splitB[2]) {
                            foundDuplicate = true;
                        }
                    });

                    // add new element to meta object if not found as duplicate
                    if (!foundDuplicate) {
                        metaobjs[splitA[0]][splitB[1]].push(propObj);

                        // special case for aggregations:
                        if (splitB[1] === "aggregations") {
                            /// XXX-03: add aggregations to properties for binding (e.a. xxx="{/ModelPath}")
                            propObj = JSON.parse(JSON.stringify(propObj));
                            propObj.type = "xs:string";
                            propObj.propType = "Array<any>";
                            propObj.name = splitB[2];
                            metaobjs[splitA[0]].properties.push(propObj);
                        }
                    }

                }

            }
        }
    }

    private addNewPreparedObjectWithStructure(JSObj: IJSDocImportObject) {
        // console.log(">>" + JSObj.nodeType + ": " + JSObj.name + " (" + JSObj.fullname + ")");
        if (JSObj.fullname.includes("~")) {
            // console.log("rejected object with '~' in the name: " + JSObj.fullname);
            return;
        }
        // clean up module:xxx/yyy/zzz
        if (JSObj.fullname.startsWith("module:")) {
            // longname and memberof needs to be corrected
            JSObj.fullname = JSObj.fullname.replace("module:", "").replace(/\//g, ".");
        }

        const nameSpaceSplit = JSObj.fullname.replace(/\#(.*)$/, "").split(".");
        if ((JSObj.nodeType === "method" && JSObj.fullname.indexOf("#") < 0) || JSObj.nodeType === "enum" || JSObj.nodeType === "interface" || JSObj.nodeType === "class") {
            nameSpaceSplit.pop();
        }
        // nameSpaceSplit.pop(); // remove top-most item

        let currentTraverse = this.preparedObjects;
        const currentNS = [];

        nameSpaceSplit.forEach((ns) => {
            let nsIdx: number;
            // console.log(`namespace check: ${ns}`);
            if (currentTraverse !== undefined) {
                nsIdx = currentTraverse.findIndex((e) => e.name === ns);
            } else {
                nsIdx = -1;
            }

            currentNS.push(ns);
            if (nsIdx < 0) { // add new NS element
                let newTraverse: IJSDocImportObject;
                newTraverse = { name: ns, fullname: currentNS.join("."), nodeType: "ns", children: [] };
                if (currentTraverse === undefined) {
                    currentTraverse = newTraverse.children;
                    this.preparedObjects.push(newTraverse);
                } else {
                    currentTraverse.push(newTraverse);
                    currentTraverse = newTraverse.children;
                }
                // console.log(`add new namespace: ${ns} - ${newTraverse}`);
            } else {
                if (currentTraverse[nsIdx].children === undefined) {
                    currentTraverse[nsIdx].children = [];
                }
                // console.log(`using namespace: ${ns} - ${currentTraverse[nsIdx].name} / ${currentTraverse[nsIdx].fullname}`);
                currentTraverse = currentTraverse[nsIdx].children;
            }
        });
        const objIdx = currentTraverse.findIndex((x) => x.name === JSObj.name);
        if (objIdx < 0) {
            currentTraverse.push(JSObj);
        } else {
            const oldType = currentTraverse[objIdx].nodeType;
            currentTraverse[objIdx] = Object.assign({}, JSObj, currentTraverse[objIdx]);
            if (JSObj.nodeType === "class" || oldType === "class") { currentTraverse[objIdx].nodeType = "class"; }
        }

    }

    private initPreparedObject() {
        if (this.preparedObjects === undefined) {
            this.preparedObjects = [];
        }
    }
}
