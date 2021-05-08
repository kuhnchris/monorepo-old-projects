/**
 *  JSDOCJSON2XSD
 * 
 * @author Christopher Kuhn <kuhnchris@kuhnchris.eu>
 */

module.exports = class {
    constructor(namespaces, metaobjs, topLevelNamespace, convertNbsp, addAnyToAggregates) {
        var xsdOutStr = "";
        xsdOutStr = `<?xml version="1.0"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
targetNamespace="${topLevelNamespace}"
xmlns="${topLevelNamespace}"`;

        for (var e in namespaces) {
            xsdOutStr = xsdOutStr + `
    xmlns:${namespaces[e]}="${e}"`;
        }

        xsdOutStr = xsdOutStr + `
elementFormDefault="qualified">
`;


        for (var e in namespaces) {
            xsdOutStr = xsdOutStr + `<xs:import schemaLocation="${e}.xsd" namespace="${e}" />
    `;
        }

        function xsdOut(str, newLine = true) {
            xsdOutStr = xsdOutStr + str;
            if (newLine)
                xsdOutStr = xsdOutStr + "\n";
        }
        function outputComment(objList, spaces) {
            if (objList["comment"] !== undefined) {
                xsdOut(" ".repeat(spaces + 2) + `<xs:annotation>`);
                xsdOut(" ".repeat(spaces + 4) + `<xs:documentation>`);
                var outCmnt = objList["comment"].replace(/<\/br>/g, "<br/>").replace(/<br>/g, "<br/>").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ & /g, " &amp; ");
                if (convertNbsp)
                    outCmnt = outCmnt.replace(/&nbsp;/g, ' ');

                xsdOut(outCmnt);
                xsdOut(" ".repeat(spaces + 4) + `</xs:documentation>`);
                xsdOut(" ".repeat(spaces + 2) + `</xs:annotation>`);
            }
        }
        function outputInheritenceBegin(objList, spaces) {
            if (objList["extends"] !== undefined) {
                spaces = spaces + 2;
                xsdOut(" ".repeat(spaces) + `<xs:complexContent>`);
                spaces = spaces + 2;
                xsdOut(" ".repeat(spaces) + `<xs:extension base="${objList["extends"]}">`);
            }

        }

        function outputAggregations(objList, spaces, outputted) {
            // aggregations need to be put before attributes
            if (objList.aggregations !== undefined && objList.aggregations !== {} && objList.aggregations.length > 0) {
                if (addAnyToAggregates) {
                    xsdOut(" ".repeat(spaces + 2) + `<xs:choice>`);
                    spaces = spaces + 2;
                }

                xsdOut(" ".repeat(spaces + 2) + `<xs:sequence minOccurs="0" maxOccurs="unbounded">`);

                for (var ee in objList.aggregations) {
                    xsdResolve(objList.aggregations[ee], objList.aggregations[ee].name, spaces + 4);
                }

                xsdOut(" ".repeat(spaces + 2) + `</xs:sequence>`);
                if (addAnyToAggregates) {
                    xsdOut(" ".repeat(spaces + 2) + `<xs:any />`);
                    spaces = spaces - 2;
                    xsdOut(" ".repeat(spaces + 2) + `</xs:choice>`);
                }
                outputted = true;
            }

        }

        function outputProperties(objList, spaces) {
            if (objList.properties === undefined)
                return;

            for (var ee in objList.properties) {
                xsdResolve(objList.properties[ee], objList.properties[ee].name, spaces + 2, true);
            }
        }
        function outputEvents(objList, spaces) {
            if (objList.events === undefined)
                return;

            for (var ee in objList.events) {
                xsdResolve(objList.events[ee], "", spaces + 2, true);
            }

        }

        function outputInheritenceEnd(objList, spaces) {
            if (objList["extends"] !== undefined) {
                xsdOut(" ".repeat(spaces) + `</xs:extension>`);
                spaces = spaces - 2;
                xsdOut(" ".repeat(spaces) + `</xs:complexContent>`);
                spaces = spaces - 2;
            }
        }

        function xsdResolve(objList, objName, spaces, attr = false) {
            var outputted = false;
            if (objName === ".dummy" || objList === ".dummy")
                return;
            if (!attr) {
                xsdOut(" ".repeat(spaces) + `<xs:element name="${objName}"`, false);

                if ((objList.properties !== undefined && objList.properties !== {} && objList.properties.length > 0) ||
                    (objList.aggregations !== undefined && objList.aggregations !== {} && objList.aggregations.length > 0) ||
                    (objList.events !== undefined && objList.events !== {} && objList.events.length > 0)) {
                    var typeUse = objName;
                    if (typeUse !== ".undefined")
                        xsdOut(` type="${typeUse}"`, false);

                    xsdOut(` />`)
                    xsdOut(" ".repeat(spaces) + `<xs:complexType name="${objName}">`);

                    outputComment(objList, spaces);
                    outputInheritenceBegin(objList, spaces);
                    outputAggregations(objList, spaces, outputted);
                    outputProperties(objList, spaces);
                    outputEvents(objList, spaces);
                    outputInheritenceEnd(objList, spaces);

                    xsdOut(" ".repeat(spaces) + `</xs:complexType>`);
                    outputted = true;
                }

                if (!outputted && objList.extends !== undefined) {
                    xsdOut(` type="${objName}" />`);
                    xsdOut(" ".repeat(spaces + 2) + `<xs:complexType name="${objName}">`);
                    outputInheritenceBegin(objList, spaces);
                    outputInheritenceEnd(objList, spaces);
                    xsdOut(" ".repeat(spaces + 2) + `</xs:complexType>`);

                    outputted = true;
                }

                if (outputted === false) {
                    typeUse = "xs:string";
                    if (objList && objList.type) {
                        typeUse = objList.type;
                    }
                    if (typeUse !== ".undefined")
                        xsdOut(` type="${typeUse}"`, false);

                    xsdOut(` />`)

                }

            }
            else {
                var reqStr = "";
                if (objList.optional === undefined || objList.optional !== true)
                    reqStr = `use="required"`
                xsdOut(" ".repeat(spaces) + `<xs:attribute name="${objList.name}" type="${objList.type}" ${reqStr}>`);
                outputComment(objList, spaces);
                xsdOut(" ".repeat(spaces) + "</xs:attribute>")
            }

        }
        for (var j in metaobjs) {
            xsdResolve(metaobjs[j], j, 2);
        }
        xsdOut(`</xs:schema>`);

        this.xsdOutStr = xsdOutStr;
    }
}
