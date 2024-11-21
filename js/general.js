/* --------------------------------------------------
   Template by espace（https://espace.monbalcon.net/）
   Copyright: 2020 espace.

   利用規約を遵守の上、ご利用ください。
   二次配布、販売は禁止しています。
   --------------------------------------------------*/

const animateTime = 500;
const spViewPoint = 1024;

let windowSize;
const setWindowSize = () => windowSize = window.innerWidth;
setWindowSize();

const isSp = () => {
    return spViewPoint >= windowSize;
}

let scrollViewPoint;
const setScrollViewPoint = () => scrollViewPoint =  window.innerHeight * (isSp() ? 0.75 : 0.45);
setScrollViewPoint();

let headerHeight;
let headerPoint;

const existsElement = (element) => {
    return typeof element !== "undefined" && element !== null;
}

//-- ▼ firefoxの:has対応
const headerElement = document.getElementsByTagName("header")[0];
const existsHeader = existsElement(headerElement);
if (existsHeader) {
    document.querySelector("body").classList.add("get-header");
}
//-- ▲ firefoxの:has対応

const isFixMenu = document.querySelector('body').classList.contains("fix-menu");

const smoothScroll = (targetY) => {
    window.scrollTo({
        top: targetY,
        behavior: 'smooth',
    });
}

const getTargetTop = (targetElement) => {
    const rect = targetElement.getBoundingClientRect().top;
    const offset = window.pageYOffset;
    return rect + offset - (headerHeight ?? 0);
}

const jumpInPage = (trigger) => {
    const href = trigger.getAttribute("href");
    const targetElement = document.getElementById(href.replace('#', ''));
    const targetPosition = getTargetTop(targetElement);
    smoothScroll(targetPosition);
}

const pageTopTrigger = document.getElementById("pageTop");
pageTopTrigger.addEventListener("click", () => smoothScroll(0));

const smoothScrollTrigger = document.querySelectorAll('a[href^="#"]');
smoothScrollTrigger.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
        e.preventDefault();
        jumpInPage(trigger);
    });
});

const menuElement = document.getElementById("mainMenu");
const existsMenu = existsElement(menuElement);
const menuToggler = existsMenu ? document.getElementById(menuElement.dataset.toggler) : null;

const swithMenu = (isOpen=true) => {
    menuToggler.dataset.open = isOpen;
    if (isOpen) {
        menuToggler.classList.add("open");
        menuElement.classList.add("open");
        headerElement.classList.add("open");
    } else {
        menuToggler.classList.remove("open");
        menuElement.classList.remove("open");
        headerElement.classList.remove("open");
    }
}

let isUseSwitchMenu;
const setIsUseSwitchMenu = () => isUseSwitchMenu = existsMenu && isSp();
setIsUseSwitchMenu();

let isMenuOpen = () => {
    return existsMenu ? menuToggler.dataset.open === "true" : false;
}

const scrollMenu = (isScroll = null) => {
    if (isScroll === null) {
        if (window.scrollY >= scrollViewPoint) {
            menuElement.classList.add("scroll");
            menuToggler.classList.add("scroll");
            headerElement.classList.add("scroll");
        } else {
            menuElement.classList.remove("scroll");
            menuToggler.classList.remove("scroll");
            headerElement.classList.remove("scroll");
        }
    } else {
        if (isScroll) {
            menuElement.classList.add("scroll");
            menuToggler.classList.add("scroll");
            headerElement.classList.add("scroll");
        } else {
            menuElement.classList.remove("scroll");
            menuToggler.classList.remove("scroll");
            headerElement.classList.remove("scroll");
        }
    }
};

let isUseScrollMenu;
const setIsUseScrollMenu = () => isUseScrollMenu = existsMenu && !isFixMenu;
setIsUseScrollMenu();

if (isFixMenu) {
    scrollMenu(true);
}

const isMenuScroll = () => {
    return existsMenu ? menuElement.classList.contains("scroll") : false;
}

if (existsMenu) {
    const menuLinks = existsMenu ? menuElement.querySelectorAll("a") : null;
    menuToggler.addEventListener("click", () => isUseSwitchMenu && swithMenu(!isMenuOpen()));
    menuLinks.forEach((element) => element.addEventListener("click", () => isUseSwitchMenu && swithMenu(false)));
}

isUseScrollMenu && scrollMenu();

window.addEventListener("scroll", () => {
    setIsUseSwitchMenu();
    setIsUseScrollMenu();
    isUseSwitchMenu && swithMenu(false);
    isUseScrollMenu && scrollMenu();
});

window.addEventListener("resize", () => {
    windowSize = window.innerWidth;
    setWindowSize();
    setIsUseSwitchMenu();
    setIsUseScrollMenu();

    if (!isUseSwitchMenu && isMenuOpen()) {
        swithMenu(false);
    } else if (isUseScrollMenu) {
        scrollMenu();
    } else {
        scrollMenu(false);
    }

    if (isFixMenu) {
        scrollMenu(true);
    }
});