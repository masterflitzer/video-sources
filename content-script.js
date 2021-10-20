"use strict";

chrome.runtime.sendMessage({
    type: "res",
    payload: main(document.getElementsByTagName("video")),
});

function main(videos) {
    if (typeof videos === "undefined" || videos === null) {
        return null;
    } else {
        let results = [];
        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            const namesSrc = ["src", "data-src"];
            const namesSrcMedia = ["src", "srcObject", "currentSrc"];

            results.push({
                src: [{}, {}],
                srcMedia: [{}, {}, {}],
                childs: [],
            });

            for (let j = 0; j < namesSrc.length; j++) {
                const name = namesSrc[j];
                const value = video.getAttribute(name);
                results[i].src[j].name = name;
                results[i].src[j].value = value;
            }

            let sources = video.getElementsByTagName("source");
            for (let j = 0; j < sources.length; j++) {
                const source = sources[j];
                /*if (j > 0)*/ results[i].childs.push([{}, {}]);
                for (let k = 0; k < namesSrc.length; k++) {
                    const name = namesSrc[k];
                    const value = source.getAttribute(name);
                    results[i].childs[j][k].name = name;
                    results[i].childs[j][k].value = value;
                }
            }

            for (let j = 0; j < namesSrcMedia.length; j++) {
                const name = namesSrcMedia[j];
                const value = video[name];
                results[i].srcMedia[j].name = name;
                results[i].srcMedia[j].value = value;
            }
        }
        return JSON.stringify(results);
    }
}
