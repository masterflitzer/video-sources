"use strict";

const videos = document.getElementsByTagName("video");
const { data, json, html: content } = getData(videos);
const html = generateHtml(content, json);
location.href = "data:text/html;base64," + btoa(html);

function getData(videos) {
    if (typeof videos !== "undefined") {
        if (videos) {
            let results = [];
            let html;
            for (let i = 0; i < videos.length; i++) {
                const video = videos[i];
                const namesSrc = ["src", "data-src"];
                const namesSrcMedia = ["src", "srcObject", "currentSrc"];
                let htmlBlock, tmp;

                results.push({
                    src: [{}, {}],
                    srcMedia: [{}, {}, {}],
                    childs: [[{}, {}]],
                });

                tmp = "";
                for (let j = 0; j < namesSrc.length; j++) {
                    const name = namesSrc[j];
                    const value = video.getAttribute(name);
                    results[i].src[j].name = name;
                    results[i].src[j].value = value;
                    tmp += generateListItem(name, value);
                }
                htmlBlock += generateList(tmp, "Source Attributes");

                tmp = "";
                let sources = video.getElementsByTagName("source");
                for (let j = 0; j < sources.length; j++) {
                    const source = sources[j];
                    let temp = "";
                    if (j > 0) results[i].childs.push([{}, {}]);
                    for (let k = 0; k < namesSrc.length; k++) {
                        const name = namesSrc[k];
                        const value = source.getAttribute(name);
                        results[i].childs[j][k].name = name;
                        results[i].childs[j][k].value = value;
                        temp += generateListItem(name, value);
                    }
                    tmp += generateInnerList(temp, i, "innerS");
                }
                htmlBlock += generateList(tmp, "Source Elements");

                tmp = "";
                for (let j = 0; j < namesSrcMedia.length; j++) {
                    const name = namesSrcMedia[j];
                    const value = video[name];
                    results[i].srcMedia[j].name = name;
                    results[i].srcMedia[j].value = value;
                    tmp += generateListItem(name, value);
                }
                htmlBlock += generateList(tmp, "Media Sources");

                html += generateTitle(i);
                html += generateContainer(htmlBlock);
            }
            return {
                html,
                data: results,
                json: JSON.stringify(results),
            };
        } else return "video tag is null";
    } else return "no html video tag found";
}

function generateListItem(name, value) {
    return `
<p>${name} - ${value}</p>
`;
}

function generateInnerList(listItem, index, title) {
    return `<h6 class="my-3">${index}. ${title}</h6>
<p>${listItem}</p>`;
}

function generateList(listItem, title) {
    return `<h6 class="display-6 my-3">${title}</h6>
<p>${listItem}</p>`;
}

function generateTitle(index) {
    return `<h6 class="display-6 my-3">${index}. Video Element</h6>`;
}

function generateContainer(block) {
    return `<div class="container-fluid">${block}</div>`;
}

function generateHtml(content, json) {
    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
              integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
              crossorigin="anonymous">
        <title>Video Sources</title>
    </head>
    <body class="bg-dark text-light">
        <header>
        </header>
        <main>
            <div class="container-fluid px-5">
                <h1 class="display-1 my-3">Video Sources</h1>
                <button type="button" class="btn btn-primary" onclick="getValueFromB64ById('json')">
                    <span>Copy JSON</span>
                    <i class="bi bi-clipboard-data ms-1" style="width: 1em; height: 1em;"></i>
                </button>
                ${content}
            </div>
        </main>
        <footer>
            <input disabled id="json" type="hidden" value="${btoa(json)}">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
            <script>function getValueFromB64ById(id){'use strict';let value=atob(document.getElementById(id).value);if(navigator.clipboard&&window.isSecureContext){return navigator.clipboard.writeText(value);}else{let hidden=document.createElement("input");hidden.disabled=true;hidden.type="hidden";hidden.value=value;document.appendChild(hidden);hidden.select();document.execCommand("copy");hidden.remove();}}</script>
        </footer>
    </body>
</html>
`;
}
