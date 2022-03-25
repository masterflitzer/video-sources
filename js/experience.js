"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

for (const button of $$("button, .btn")) {
    button.addEventListener("click", (event) => {
        const target = event.currentTarget;
        setTimeout(() => {
            target.blur();
        }, 1000);
    });
}

const manipulateCssClass = (e, remove, add) => {
    if (!Array.isArray(remove)) remove = [remove];
    if (!Array.isArray(add)) add = [add];
    e.classList.remove(...remove);
    e.classList.add(...add);
};

const switchCssClassOnClick = (selector, iconDefault, iconClick) => {
    $(selector).addEventListener("click", (event) => {
        const target = event.currentTarget;
        const icon = $("i", target);
        manipulateCssClass(icon, iconDefault, iconClick);
        setTimeout(() => {
            manipulateCssClass(icon, iconClick, iconDefault);
        }, 1000);
    });
};

switchCssClassOnClick("#copy-json", "bi-clipboard-data", "bi-clipboard-check");

// color schemes: auto -> null, light -> true, dark -> false
const validColorScheme = (value) =>
    value === null || value === true || value === false ? true : false;

const getColorScheme = async () => {
    const storage = await browser.storage.local.get({ color: null });
    if (!validColorScheme(storage.color)) {
        setColorScheme(null);
        return null;
    } else return storage.color;
};

const setColorScheme = async (value) => {
    if (!validColorScheme(value)) throw new Error("invalid value");
    else browser.storage.local.set({ color: value });
};

const body = $("body");
const classLight = ["bg-light", "text-dark"];
const classDark = ["bg-dark", "text-light"];

const setLightTheme = (e) => manipulateCssClass(e, classDark, classLight);

const setDarkTheme = (e) => manipulateCssClass(e, classLight, classDark);

const lightMedia = window.matchMedia("(prefers-color-scheme: light)");
const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");

for (const x of [lightMedia, darkMedia]) {
    x.addEventListener("change", async (event) => {
        const mode = await getColorScheme();
        if (event.matches && mode === null) setAutoTheme(body);
    });
}

const setAutoTheme = (e) => {
    if (lightMedia.matches) setLightTheme(e);
    if (darkMedia.matches) setDarkTheme(e);
};

const colorScheme = (value) => {
    if (validColorScheme(value)) setColorScheme(value);
    switch (value) {
        case null:
            setAutoTheme(body);
            break;
        case true:
            setLightTheme(body);
            break;
        case false:
            setDarkTheme(body);
            break;
        default:
            throw new Error("invalid value");
    }
};

const colorSchemeButton = async (init) => {
    const target = $("#switch-theme");
    const span = $("span", target);
    const iconHover = $("i.icon-hover", target);
    const iconHovered = $("i.icon-hovered", target);
    const content = {
        text: ["Auto Mode", "Light Mode", "Dark Mode"],
        cssClass: ["bi-brightness-alt-high", "bi-sun", "bi-moon"],
        cssClassHover: [
            "bi-brightness-alt-high-fill",
            "bi-sun-fill",
            "bi-moon-fill",
        ],
    };

    const oldIndex = content.text.indexOf(span.textContent);
    if (!init) {
        const value =
            oldIndex === content.text.length - 1 ? null : !Boolean(oldIndex);
        setColorScheme(value);
    }
    const mode = await getColorScheme();
    colorScheme(mode);
    const newIndex = mode === null ? 0 : content.text.length - Number(mode) - 1;

    span.textContent = span.textContent.replace(
        content.text[oldIndex],
        content.text[newIndex]
    );
    manipulateCssClass(
        iconHover,
        content.cssClass[oldIndex],
        content.cssClass[newIndex]
    );
    manipulateCssClass(
        iconHovered,
        content.cssClassHover[oldIndex],
        content.cssClassHover[newIndex]
    );
};

document.addEventListener("DOMContentLoaded", async () => {
    colorSchemeButton(true);
    $("#switch-theme").addEventListener("click", () => {
        colorSchemeButton();
    });
});
