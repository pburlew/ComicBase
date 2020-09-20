//API
const api1Query = "https://project1api1.herokuapp.com";
//Variable
const title = getComicTitleFromUrl();
let source = "";
let pageIndex = 0;
//Selector
const navigationEl = $("#navigation");
const chapterDropdownEl = $("#chapterDropdown");
const leftPageEl = $("#leftPage");
const rightPageEl = $("#rightPage");

//Events
chapterDropdownEl.change(onChangeSelectChapter);
navigationEl.click(onPageChangeComicPage);
//Class
class Comic {
    async getComic(title) {
        return await $.ajax({
            method: "GET",
            url: `${api1Query}/comic/${title}`,
        });
    }

    async getComicChapters(title, chapter) {
        return await $.ajax({
            method: "GET",
            url: `${api1Query}/comic/${title}/${chapter}`,
        });
    }
}
//Function
//Init
const com = new Comic();
(() => {
    const comicTitle = com.getComic(title);
    comicTitle
        .then((res) => {
            addContentToChapterDropdownMenu(res);
            const chapterIndex = getCurrentSelectedChapter();
            parsePages(title, chapterIndex);
        })
        .catch((err) => {
            console.log(err);
        });
})();

//Navigation
function getComicTitleFromUrl() {
    const pattern = "?comic=";
    const href = window.location.href;
    return href.substr(href.lastIndexOf(pattern) + pattern.length);
}

function addContentToChapterDropdownMenu(res) {
    if (res && res.length > 0) {
        for (let chapter of res[0].chapters) {
            const url = chapter.url;
            if (url) {
                const id = url.substr(url.lastIndexOf("/") + 1);
                chapterDropdownEl.append(
                    `<option value="${id}">${chapter.title}</option>`
                );
            }
        }
    }
}

function onChangeSelectChapter(e) {
    const chapterIndex = $(e.target).val();
    parsePages(title, chapterIndex);
}

function getCurrentSelectedChapter() {
    return chapterDropdownEl.children("option:selected").val();
}

//Pages
function parsePages(title, chapterIndex) {
    const pages = com.getComicChapters(title, chapterIndex);
    pages
        .then((res) => {
            source = res;
            displayPages(res, 0);
        })
        .catch((err) => {
            console.log(err);
        });
}

function onPageChangeComicPage(e) {
    const buttonIndex = $(e.target).data("index");
    console.log(buttonIndex);
    if (source) {
        switch (buttonIndex) {
            case "first-page":
                pageIndex = 0;
                displayPages(source, pageIndex);
                break;
            case "before":
                pageIndex = pageIndex > 0 ? --pageIndex : 0;
                displayPages(source, pageIndex);
                break;
            case "next":
                pageIndex =
                    pageIndex > pageIndex - 2 ? ++pageIndex : pageIndex - 2;
                displayPages(source, pageIndex);
                break;
            case "last-page":
                pageIndex = source.length - 2;
                displayPages(source, pageIndex);
                break;
        }
    }
    console.log(buttonIndex);
}

function displayPages(res, index) {
    if (res && index >= 0 && index <= res.length - 2) {
        const leftPageImage = res[index].img;
        const rightPageImage = res[index + 1].img;
        leftPageEl.css("background-image", `url(${leftPageImage})`);
        rightPageEl.css("background-image", `url(${rightPageImage})`);
    }
}
