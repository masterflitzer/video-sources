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
            const keysMedia = ["src", "srcObject", "currentSrc"];
            const keysParent = ["src", "data-src"];

            results.push({
                media: [{}, {}, {}],
                parent: [{}, {}],
                childs: [],
            });

            for (let j = 0; j < keysMedia.length; j++) {
                const key = keysMedia[j];
                const value = video[key];
                results[i].media[j].key = key;
                results[i].media[j].value = value;
            }

            for (let j = 0; j < keysParent.length; j++) {
                const key = keysParent[j];
                const value = video.getAttribute(key);
                results[i].parent[j].key = key;
                results[i].parent[j].value = value;
            }

            let sources = video.getElementsByTagName("source");
            for (let j = 0; j < sources.length; j++) {
                const source = sources[j];
                results[i].childs.push([{}, {}]);
                for (let k = 0; k < keysParent.length; k++) {
                    const key = keysParent[k];
                    const value = source.getAttribute(key);
                    results[i].childs[j][k].key = key;
                    results[i].childs[j][k].value = value;
                }
            }
        }
        return JSON.stringify(results);
    }
}
