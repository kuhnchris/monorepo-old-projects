

export default class Utilitiies {
    // adapted from some stackoverflow, cannot find it anymore... :-(
    static createImg = function (src: string, alt?: string, title?: string): HTMLImageElement {
        let img = document.createElement('img');
        img.src = src;
        if (alt != null) img.alt = alt;
        if (title != null) img.title = title;
        img.classList.add("ml-1")
        img.classList.add("mr-1");
        img.classList.add("mt-1");
        return img;
    }

    static setBusy = function (active: boolean, busyText?: string) {
        let BUSY_INDICATOR_ID = "busyBlock";
        let busyElem = document.getElementById(BUSY_INDICATOR_ID);
        let busyElemText = document.getElementById(BUSY_INDICATOR_ID + "_text");
        if (busyElem === undefined || busyElem === null) {
            let v = document.createElement("div");
            let v1 = document.createElement("div");
            let v2 = document.createElement("div");
            let v3 = document.createElement("span");
            let v4 = document.createElement("div");
            let v5 = document.createElement("span");
            v3.classList.add("sr-only");
            v2.classList.add("spinner-border");
            v1.classList.add("col");
            v1.classList.add("text-center");
            v1.classList.add("top-fifty");
            v.classList.add("busyBlock");
            v.classList.add("h-100");
            v.classList.add("row");
            v.classList.add("align-items-center");
            v.id = BUSY_INDICATOR_ID;
            v5.id = BUSY_INDICATOR_ID + "_text";
            v.appendChild(v1);
            v1.appendChild(v2);
            v2.appendChild(v3);
            v2.appendChild(v4);
            v1.appendChild(v5);
            document.body.appendChild(v);
            //document.body.appendChild('<div class="busyBlock" id="'+BUSY_INDICATOR_ID+'"><div class="spinner-border" role="status"><span class="sr-only">Please wait...</span></div></div>');
            busyElem = document.getElementById(BUSY_INDICATOR_ID);
            busyElemText = document.getElementById(BUSY_INDICATOR_ID + "_text");
        }

        busyElem.style.display = active ? 'block' : 'none';
        if (busyText !== undefined) {
            busyElemText.innerText = busyText;
        }

    }

    // simple cross-browser ajax helper
    // credits: https://stackoverflow.com/questions/18360935/accessing-json-data-from-a-url
    // Chris Baker
    static ajaxGet = function (url: string, callback: (response: string) => any): XMLHttpRequest {
        var callbackExists = (typeof callback == 'function' ? true : false);
        let xhr: XMLHttpRequest = null;
        try {
            xhr = new XMLHttpRequest();
        } catch (e) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        if (!xhr)
            return null;
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && callbackExists) {
                callback(xhr.responseText)
            }
        }
        xhr.send(null);
        return xhr;
    }


    static addLog = function (logText: string) {
        /*var f = document.getElementById("log");
        if (f.value.trim() !== "") {
            f.value = f.value + '\n';
        }
        f.value = f.value + g;*/
        console.log(logText);

    }

};