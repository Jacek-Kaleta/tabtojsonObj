/*
MIT License

Copyright (c) 2021 Jacek Kaleta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var tabtojsonObj = module.exports.tabtojsonObj = function(text, param) {
    if (param == undefined) param = {}
    if (param.cr == undefined) param.cr = '\r\n';
    if (param.onError == undefined)
        param.onError = function(error, line) {
            return { error, line }
        }
    let jsonObj = {};
    let lines = text.split(param.cr);
    let i = 0;
    processlines(0, jsonObj)
    return jsonObj;

    function processlines(d, obj) {
        let parname = undefined;

        while (i < lines.length) {
            let line = lines[i];
            if (line.trim().length == 0) throw param.onError(0, i);
            let l = (line.match(/^\t*/))[0].length;
            line = line.trim();

            if (l == d) {
                let j = line.indexOf('[]');
                if (j >= 0) {
                    if (j > 0)
                        parname = line.substr(0, j).trim();
                    if (parname == undefined) throw param.onError(1, i + 1);
                    let value = line.substring(j + 2).trim();
                    if (obj[parname] == undefined)
                        obj[parname] = [];
                    if (value.length > 0)
                        if (value.substr(0, 1) == '=')
                            value = value.substr(1).trim();
                    if (value.length > 0)
                        obj[parname].push(value);
                    else
                        obj[parname].push({});
                    i++;
                    continue;
                }
                j = line.indexOf('@');
                if (j > 0) {
                    let l = (lines[i].match(/^\t*/))[0].length;
                    parname = line.trim();
                    let text = "";
                    i++;
                    while (i < lines.length && l < (lines[i].match(/^\t*/))[0].length) {
                        text += ((text.length > 0) ? '\r\n' : '') + lines[i].substr(l + 1);
                        i++
                    }
                    obj[parname] = text
                    continue;
                }
                j = line.indexOf('=')
                if (j >= 0) {
                    parname = line.substr(0, j).trim();
                    obj[parname] = line.substr(j + 1).trim();
                    i++
                    continue;
                }
                parname = line
                if (obj[parname] != undefined) throw param.onError(3, i + 1);
                obj[parname] = {}
                i++;
                continue;
            } else
            if (l == d + 1) {
                if (parname == undefined) throw param.onError(5, i + 1);
                if (typeof obj[parname] == "string") throw param.onError(6, i + 1);

                if (obj[parname] instanceof Array)
                    processlines(l, obj[parname][obj[parname].length - 1])
                else
                    processlines(l, obj[parname])
            } else
            if (l > d + 1) throw param.onError(7, i + 1);
            if (l < d) return;
        }
    };
}
