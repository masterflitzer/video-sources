"use strict";

(async () => {
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) =>
        parent.querySelectorAll(selector);
    const getJsonData = async (videos) => {
        if (videos.length === 0) throw new Error();

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

            let sources = $$("source", video);
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
        return results;
    };

    try {
        const data = await getJsonData($$("video"));
        browser.runtime.sendMessage({ payload: data });
    } catch (error) {
        alert("Couldn't find any video element!");
    }
})();
