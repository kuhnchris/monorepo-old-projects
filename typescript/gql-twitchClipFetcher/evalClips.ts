import * as fs from 'fs';
var buf = fs.readFileSync("allTimClips2.txt", "utf16le");
var lines = buf.split("\r\n");

console.log("Lines: " + lines.length);
const reg = /(https[^-]*) - (.*) - (....-..-..T..:..:..Z)/gm;
var entries = [];

lines.forEach((a) => {
    if (a.trim() !== "") {
        let strIn = a.toString().trimLeft().trimRight();
        let res;
        while ((res = reg.exec(strIn)) !== null) {
            if (res !== null) {
                let resArr = [];
                res.forEach((v, idx) => {
                    resArr.push(v);
                })
                let newDate = new Date(resArr[3]);
                let day =  newDate.getDay();
                let hour = newDate.getHours();
                let newEntry = {
                    "url": resArr[1],
                    "title": resArr[2],
                    "dateRaw": resArr[3],
                    "date": newDate,
                    "hour": hour,
                    "year": newDate.getFullYear(),
                    "day": day,
                    "couldBeIRacing": (day >= 2 || day <= 4) && (hour >= 20 || hour <= 10 )
                }
                //console.log(newEntry); 
                entries.push(newEntry);
            } else {
                console.log("in: " + strIn);
                console.log("regex failed.");
                console.log("---");
            }
        }
    }
})

entries.forEach((x)=>{
    if (x.couldBeIRacing && x.year >= 2020)
        console.log(`youtube-dl ${x.url} #${x.year} (${x.title})`);
});
//console.log(entries);
//console.log(buf);
