"use strict";

const colorScheme = () => {
    const classLight = ["bg-light", "text-dark"];
    const classDark = ["bg-dark", "text-light"];
    const body = document.querySelector("body");
    const setLightScheme = (e) => {
        e.classList.add(...classLight);
        e.classList.remove(...classDark);
    };
    const setDarkScheme = (e) => {
        e.classList.add(...classDark);
        e.classList.remove(...classLight);
    };

    if (window.matchMedia("(prefers-color-scheme: light)").matches)
        setLightScheme(body);
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        setDarkScheme(body);

    window
        .matchMedia("(prefers-color-scheme: light)")
        .addEventListener("change", (event) => {
            if (event.matches) setLightScheme(body);
        });

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
            if (event.matches) setDarkScheme(body);
        });
};

if (window.matchMedia) colorScheme();

const animateOnClick = (selector, iconDefault, iconClick) => {
    document.querySelector(selector).addEventListener("click", (event) => {
        const icon = event.currentTarget.querySelector("i");
        icon.setAttribute(
            "class",
            icon.attributes.class.value.replace(iconDefault, iconClick)
        );
        setTimeout(() => {
            icon.setAttribute(
                "class",
                icon.attributes.class.value.replace(iconClick, iconDefault)
            );
            event.currentTarget.blur();
        }, 5000);
    });
};

animateOnClick("#copy-json", "bi-clipboard-data", "bi-clipboard-check");
animateOnClick("#clear-storage", "bi-x-circle", "bi-x-circle-fill");

const renderingFailed = (error) => {
    const getErrorMessage = (type) => {
        switch (type) {
            case "empty":
                return "Storage is empty";
            case "storage":
                return "An error occurred while accessing local storage";
            case "parent":
                return "An error occurred while inserting rendered data";
            default:
                return "An unexpected error occurred";
        }
    };

    const msg = error.message
        ? `${getErrorMessage(error.type)}: ${error.message}`
        : `${getErrorMessage(error.type)}!`;
    console.warn(msg);
    alert(msg);
};

const copy = (value) => {
    if (value !== "") {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(value);
        } else {
            let hidden = document.createElement("input");
            hidden.disabled = true;
            hidden.type = "hidden";
            hidden.value = value;
            document.appendChild(hidden);
            hidden.select();
            document.execCommand("copy");
            document.removeChild(hidden);
        }
    }
};

const isHTMLNode = (object) => {
    if (object == null) return false;
    try {
        return object instanceof Node || object instanceof HTMLElement;
    } catch (e) {
        console.warn(e);
        return false;
    }
};

const generateDivContainingTag = (tag, cssClassArray, text) => {
    let div = document.createElement("div");
    div.appendChild(
        (() => {
            let h = document.createElement(tag);
            h.classList.add(...cssClassArray);
            h.textContent = text;
            return h;
        })()
    );
    return div;
};

const generateLabel = (key, value) => {
    value = value ? value : null;
    let label = document.createElement("label");
    label.classList.add("input-group", "flex-nowrap", "my-2");

    label.appendChild(
        (() => {
            let span = document.createElement("span");
            span.classList.add("col-1", "input-group-text", "fw-bold");
            span.textContent = key;
            return span;
        })()
    );

    label.appendChild(
        (() => {
            let input = document.createElement("input");
            input.type = "text";
            input.classList.add("form-control");
            input.placeholder = "No source found!";
            input.value = value;
            input.disabled = true;
            return input;
        })()
    );

    label.appendChild(
        (() => {
            let button = document.createElement("button");
            button.type = "button";
            button.classList.add("copy-value", "btn", "btn-primary");
            button.appendChild(
                (() => {
                    let i = document.createElement("i");
                    i.classList.add("icon", "bi", "bi-clipboard", "me-1");
                    i.setAttribute("aria-hidden", "true");
                    return i;
                })()
            );
            button.appendChild(
                (() => {
                    let span = document.createElement("span");
                    span.classList.add("d-none", "d-lg-inline-block");
                    span.textContent = "Copy";
                    return span;
                })()
            );
            return button;
        })()
    );

    label.appendChild(
        (() => {
            let a = document.createElement("a");
            a.classList.add("btn", "btn-primary");
            if (value) {
                a.href = value;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
            } else {
                a.href = "#";
            }
            a.appendChild(
                (() => {
                    let i = document.createElement("i");
                    i.classList.add(
                        "icon",
                        "bi",
                        "bi-box-arrow-up-right",
                        "me-1"
                    );
                    i.setAttribute("aria-hidden", "true");
                    return i;
                })()
            );
            a.appendChild(
                (() => {
                    let span = document.createElement("span");
                    span.classList.add("d-none", "d-lg-inline-block");
                    span.textContent = "Open";
                    return span;
                })()
            );
            return a;
        })()
    );

    return label;
};

const generateDataOverview = (data) => {
    let html = document.querySelector("#placeholder");

    for (let i = 0; i < data.length; i++) {
        const video = data[i];

        let div = generateDivContainingTag(
            "h3",
            ["my-4", "p-1"],
            `${i + 1}. Video`
        );

        let divMedia = generateDivContainingTag(
            "h5",
            ["my-4"],
            "Media Sources"
        );
        let divMediaLabel = document.createElement("div");

        let divParent = generateDivContainingTag("h5", ["my-4"], "Sources");
        let divParentLabel = document.createElement("div");

        let divChilds = generateDivContainingTag(
            "h5",
            ["my-4"],
            "Child Sources"
        );

        for (const media of video.media) {
            divMediaLabel.appendChild(generateLabel(media.key, media.value));
        }

        for (const parent of video.parent) {
            divParentLabel.appendChild(generateLabel(parent.key, parent.value));
        }

        for (let j = 0; j < video.childs.length; j++) {
            const childs = video.childs[j];
            let divChild = generateDivContainingTag(
                "h5",
                ["my-4"],
                `${j + 1}. Child`
            );
            let divChildLabel = document.createElement("div");

            for (const child of childs) {
                divChildLabel.appendChild(
                    generateLabel(child.key, child.value)
                );
            }

            divChild.appendChild(divChildLabel);
            divChilds.appendChild(divChild);
        }

        divMedia.appendChild(divMediaLabel);
        div.appendChild(divMedia);

        divParent.appendChild(divParentLabel);
        div.appendChild(divParent);

        div.appendChild(divChilds);

        if (isHTMLNode(html) && isHTMLNode(div)) {
            for (const child of html.children) child.remove();
            html.appendChild(div);
        } else {
            renderingFailed({
                type: "parent",
                message: null,
            });
        }
    }
};

const main = (data) => {
    if (
        data === null ||
        data.length === 0 ||
        data === undefined ||
        typeof data === "undefined"
    ) {
        renderingFailed({
            type: "empty",
            message: null,
        });
        return;
    }

    generateDataOverview(data);

    document.querySelector("#copy-json").addEventListener("click", (event) => {
        copy(JSON.stringify(data));
    });

    const elements = document.querySelectorAll(".copy-value");
    for (const element of elements) {
        element.addEventListener("click", (event) => {
            let clicked = event.currentTarget;
            if (event.type === "click") {
                let target = clicked.parentNode.querySelector("input");
                copy(target.value);
            }
        });
    }
};

browser.storage.local
    .get({ data: null })
    .then((storage) => {
        main(storage.data);
    })
    .catch((error) =>
        renderingFailed({
            type: "storage",
            message: error,
        })
    );

document.querySelector("#clear-storage").addEventListener("click", (event) => {
    browser.storage.local
        .remove("data")
        .then(() => {
            setTimeout(() => {
                location.reload();
            }, 200);
        })
        .catch((error) => {
            renderingFailed({
                type: "storage",
                message: error,
            });
        });
});
