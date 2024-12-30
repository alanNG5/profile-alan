const articles = document.querySelectorAll("article");
const sidebar = document.querySelectorAll("aside div");

// @ get the height of header, margin of first article which are used for calculating the top position of article.
const headerHeight = document.querySelector("header").offsetHeight;
const getArticle = getComputedStyle(articles[0]);
const getMargin = parseInt(getArticle.getPropertyValue("margin"));

function sidebarEffectByScrolling () {
    let currentScrollingPosition = document.documentElement.scrollTop || document.body.scrollTop;

    articles.forEach((article, index) => {
        let articleTop = article.offsetTop;
        let articleHeight = article.clientHeight;

        if ( currentScrollingPosition >= (articleTop - headerHeight - getMargin) && currentScrollingPosition < articleTop + articleHeight) {
            sidebar.forEach( item => item.classList.remove("active"));
            sidebar[index].classList.add("active");
        };
    });
}

window.addEventListener("scroll", sidebarEffectByScrolling);
sidebarEffectByScrolling();

const asideBlock = document.querySelector("aside");
asideBlock.addEventListener("click", (event) => {

    if (event.target.matches("div")) {
        let showSection = event.target.getAttribute("data-index");
        articles[showSection].scrollIntoView( {behavior: "smooth", block: "start"});
    };
});

// @ offsetHeight includes scrollbar and border, clientHeight doesn't.
