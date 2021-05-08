/**
 *  JSDOCJSON2TS
 *
 * @author Christopher Kuhn <kuhnchris@kuhnchris.eu>
 */

import * as ijsd from "./ImportJSDocs";

export class ExportSplitAsTS {
    public static parseNew(preparedObjects: ijsd.IJSDocImportObject[], topLevelNamespace: string, namespaces: Map<string, string>): string {
        this.internalTsOutStr = "";
        this.usedTLNs = topLevelNamespace;
        this.usedTLNMappings = namespaces;

        preparedObjects.forEach((x) => this.parseInner(x, undefined, 0));
        // eventually namespaces?
        //        tsOutStr = tsOutStr + `export namespace ${topLevelNamespace} {\n`;

        this.usedTLNMappings.forEach((v, k, m) => {

            this._tsOut(`import * as ${v} from "./${k}";`);
        });

        return this.internalTsOutStr;
    }
    public static parseInner(prepObj: ijsd.IJSDocImportObject, parentObj: ijsd.IJSDocImportObject, spaces: number) {
        // if (parentObj !== undefined && parentObj.nodeType !== undefined && parentObj.name !== undefined) {
        //     console.log(`> parent: ${parentObj.nodeType}@${parentObj.name} - child: ${prepObj.nodeType}:${prepObj.name}`);
        // } else {
        //     console.log(`> parent: (none)@(none) - child: ${prepObj.nodeType}:${prepObj.name}`);
        // }
        // let outputted = false;

        if (prepObj.nodeType !== "ns" && prepObj.children !== undefined && prepObj.children.length > 0) {
            // console.log(`[?] ${prepObj.nodeType}@${prepObj.fullname} has children: ${prepObj.children.length}`);
        }

        // console.log(`@${prepObj.nodeType}: ${prepObj.name}`);
        if (prepObj.name === ".dummy" || prepObj.name === ".dummy" || prepObj.name === "") {
            return;
        }

        // enum in class => reorder so enum is in a ns

        if (prepObj.nodeType === "ns" || prepObj.nodeType === "class" || prepObj.nodeType === "enum" || prepObj.nodeType === "interface") {
            let extendsStr = "";

            // enum cannot be extended
            if (prepObj.nodeType !== "enum") {
                if (prepObj.extends !== undefined && prepObj.extends.length !== undefined && prepObj.extends.length > 0) {
                    // console.log(`${prepObj.nodeType}@${prepObj.name} extends ${prepObj.extends.length} items`);
                    extendsStr = `extends ${this._translateType(prepObj.extends[0])}`;
                }
            }
            this._tsOut(" ".repeat(spaces) + `export ${prepObj.nodeType === "ns" ? "namespace" : prepObj.nodeType} ${prepObj.name} ${extendsStr}{`);
            spaces += 2;
        }

        if (prepObj.children !== undefined) {
            const childrenChecked = [];
            let loopcnt = 0;
            while (childrenChecked.length !== prepObj.children.length) {
                // console.log(`@${prepObj.name} - loop: ${loopcnt} - ${childrenChecked.length} v.s. ${prepObj.children.length}`);
                loopcnt++;
                if (loopcnt > 100) {
                    // console.log("[!!] loopcnt > 100, endless loop detected. quitting.");
                    return;
                }
                prepObj.children.forEach((x) => {
                    if (childrenChecked.find((y) => x === y)) {
                        return;
                    }
                    childrenChecked.push(x);

                    // check for wrong-nesting
                    if (prepObj.nodeType === "class" &&
                        (x.nodeType === "ns" ||
                            x.nodeType === "interface" ||
                            x.nodeType === "enum" ||
                            x.nodeType === "class")) {

                        // console.log(`[!]> parent: ${prepObj.nodeType}@${prepObj.name} - child: ${x.nodeType}:${x.name}`);
                        const q: ijsd.IJSDocImportObject = { name: prepObj.name, nodeType: "ns", fullname: prepObj.fullname };
                        q.children = [x];
                        parentObj.children.push(q);
                        return;
                    }
                    this.parseInner(x, prepObj, spaces);
                });
            }
            // console.log(`@${prepObj.name} - loop done: ${loopcnt} - ${childrenChecked.length} v.s. ${prepObj.children.length}`);
        }
        /* rewrite here */

        if (prepObj.aggregations !== undefined) {
            prepObj.aggregations.forEach((element) => {
                if (element.name === ".dummy") { return; }

                // // Note: Typescript does not support
                // //       public/private/static on interfaces
                // if (prepObj.nodeType === "interface") {
                //     element.scope = "";
                // }

                // outputComment(objList, spaces);
                // this._tsOut(" ".repeat(spaces) + `${element.scope} ${element.name}(`, false);
                // if (element.parameters !== undefined) {
                //     let firstOne = true;
                //     element.parameters.forEach((element2) => {
                //         if (firstOne) {
                //             firstOne = false;
                //         } else {
                //             this._tsOut(", ", false);
                //         }
                //         this._tsOut(`${element2.name}: ${this._translateType(element2.type)}`, false);
                //     });
                // }

                // this._tsOut(`): ${this._translateType(element.returnType)};`);
                // console.log("there would have been an aggregation here: " + JSON.stringify(element));
            });
        }
        if (prepObj.events !== undefined) {
            prepObj.events.forEach((element) => {
                if (element.name === ".dummy") { return; }

                // // Note: Typescript does not support
                // //       public/private/static on interfaces
                // if (prepObj.nodeType === "interface") {
                //     element.scope = "";
                // }

                // outputComment(objList, spaces);
                // this._tsOut(" ".repeat(spaces) + `${element.scope} ${element.name}(`, false);
                // if (element.parameters !== undefined) {
                //     let firstOne = true;
                //     element.parameters.forEach((element2) => {
                //         if (firstOne) {
                //             firstOne = false;
                //         } else {
                //             this._tsOut(", ", false);
                //         }
                //         this._tsOut(`${element2.name}: ${this._translateType(element2.type)}`, false);
                //     });
                // }

                // this._tsOut(`): ${this._translateType(element.returnType)};`);
                // console.log("there would have been an event here: " + JSON.stringify(element));
            });
        }

        if (prepObj.properties !== undefined) {
            let isFirst = true;
            prepObj.properties.forEach((element) => {
                if (prepObj.nodeType !== "enum") {
                    if (element.name === ".dummy") { return; }
                    // outputComment(objList, spaces);
                    // console.log(`debug-prop: ${prepObj.name}: ${JSON.stringify(element)}`);
                    this._tsOut(" ".repeat(spaces) + `${element.name}?: ${this._translateType(element.propType)};`);
                } else {
                    this._tsOut(" ".repeat(spaces), false);

                    if (isFirst) {
                        isFirst = false;
                    } else {
                        this._tsOut(", ", false);
                    }

                    this._tsOut(`${element.name} = "${element.value}"`);
                }
            });
        }

        if (prepObj.methods !== undefined) {
            prepObj.methods.forEach((element) => {
                if (element.name === ".dummy") { return; }
                if (parentObj !== undefined) {
                    if (element.name === parentObj.name) {
                        element.name = "constructor";
                        element.scope = "";
                    }
                }

                // Note: Typescript does not support
                //       public/private/static on interfaces
                if (prepObj.nodeType === "interface") {
                    element.scope = "";
                }

                if (element.scope !== "public" && element.scope !== "static") {
                    return;
                }

                // outputComment(objList, spaces);
                this._tsOut(" ".repeat(spaces) + `${element.scope} ${element.name}(`, false);
                if (element.parameters !== undefined) {
                    this._parseParameters(element.parameters);
                }

                this._tsOut(`): ${this._translateType(element.returnType)}|any;`);

            });
        }

        spaces -= 2;

        // outputAggregations(objList, spaces, outputted);
        // outputEvents(objList, spaces);

        if (prepObj.nodeType === "ns" || prepObj.nodeType === "class" || prepObj.nodeType === "enum" || prepObj.nodeType === "interface") {
            this._tsOut(" ".repeat(spaces) + "}");
        }

    }

    // public static parse(namespaces, metaobjs, enums, topLevelNamespace, convertNbsp): string {
    //     var tsOutStr = "";

    //     for (var e in namespaces) {
    //         tsOutStr = tsOutStr + `import * as ${namespaces[e]} from "./${e}";\n`;
    //     }
    //     tsOutStr = tsOutStr + `export namespace ${topLevelNamespace} {\n`;

    private static internalTsOutStr: string;
    private static usedTLNs: string;
    private static usedTLNMappings: Map<string, string>;

    private static _parseParameters(parameterArray: ijsd.IParameter[]) {
        let firstOne = true;

        parameterArray.forEach((element2) => {
            if (firstOne) {
                firstOne = false;
            } else {
                this._tsOut(", ", false);
            }

            // FOR NOW EVERYTHING IS OPTIONAL
            element2.optional = true;
            this._tsOut(`${element2.name}${element2.optional === true ? "?" : ""}: `, false);
            this._tsOut(this._translateType(element2.type, element2) + "|any", false);
        });

    }

    private static _tsOut(str, newLine = true) {
        this.internalTsOutStr = this.internalTsOutStr + str;
        if (newLine) {
            this.internalTsOutStr = this.internalTsOutStr + "\n";
        }
    }
    private static _outputComment(objList, spaces, tsOutStr: string) {
        if (objList.comment !== undefined) {
            let outCmnt = objList.comment.replace(/<\/br>/g, "<br/>").replace(/<br>/g, "<br/>").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ & /g, " &amp; ");
            if (true) {
                outCmnt = outCmnt.replace(/&nbsp;/g, " ");
            }
            outCmnt.replace(/\n/, "\n/* ");
            this._tsOut(`/** ${outCmnt} */`);
        }
    }

    private static _translateType(type: string, typeElement?: ijsd.IParameter) {
        if (typeElement !== undefined && typeElement.isComplexType === true) {
            this._tsOut("{ ", false);
            this._parseParameters(typeElement.complexTypeChildren);
            this._tsOut(" }", false);
            return "";
        }

        // workaround for @types/jquery
        type = type.replace("jQuery", "JQuery");
        // jsdoc Array. => Array
        type = type.replace("Array.", "Array").replace("array.", "Array");
        // jsdoc Object. => Object
        type = type.replace("Object.", "Object").replace("object.", "Object");
        // jsdoc Promise. => Promise
        type = type.replace("Promise.", "Promise").replace("promise.", "Promise");
        // jsdoc Object. => Map
        type = type.replace("Object<", "Map<");
        // function() => ()=>any
        type = type.replace("function()", "() => any");

        // *<type> needs translation too!

        if (type.includes("<")) {
            const innerType = type.split("<")[1].split(">").slice(0, type.split("=>").length + 1).join(">").replace(/\>$/, "");
            return type.split("<")[0] + "<" + this._translateType(innerType) + ">";
        }
        if (type.startsWith("(") && type.endsWith(")")) {
            const innerType = type.split("(")[1].split(")").slice(0, 1).join(")").replace(/\)$/, "");
            return type.split("(")[0] + "(" + this._translateType(innerType) + ")";
        }

        if (type.includes("|")) {
            // console.log(`${type} containing |`);
            const typeTypes = type.split("|");
            const newTypes = [];
            typeTypes.forEach((t) => {
                // console.log(`translating ${t}...`);
                newTypes.push(this._translateType(t));
            });
            // console.log(`returning ${newTypes.join("|")}`);
            return newTypes.join("|");
        }

        const splitType = type.split(".");
        if (splitType.length > 1) {
            // check type
            if (type.replace(this.usedTLNs, "") === type) {
                // different top level namespace
                splitType.pop();
                const oldTLN = splitType.join(".");
                let newTLN = "0";
                if (this.usedTLNMappings.get(oldTLN) === undefined) {
                    this.usedTLNMappings.forEach((v, k, m) => {
                        newTLN = v.substr(1);
                    });
                    newTLN = "n" + ((parseInt(newTLN, 10) + 1).toString());
                    this.usedTLNMappings.set(oldTLN, newTLN);
                } else {
                    newTLN = this.usedTLNMappings.get(oldTLN);
                }

                // console.log(`type-translation: ${oldTLN}->${newTLN}`);
                return `${newTLN}.${type}`;
            }

        }

        // mapping
        switch (type) {
            case "int":
            case "Int":
            case "Integer":
            case "integer":
            case "float":
                return "number";
            case "Array<int>":
                return "Array<number>";
            case "Array":
            case "Array<T>":
                return "any[]";
            case "Map":
            case "map":
                return "Map<any,any>";
            case "function":
                return "() => any";
            case "Promise":
                return "Promise<any>";
            case "Promise.<function()>":
                return "Promise<() => any>";
            case "grid":
            case "control":
            case "enum":
            case "Object.<string, any>":
                return "any";
            case "*":
                return "any";
            case "array":
                return "any[]";
            default:
                return type;
        }
    }

}
