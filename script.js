"use strict";
//#regionstart =================================={Constants}
const header = document.getElementById("header");
const main = document.getElementById("main");
const menu = document.querySelector("[data-menu]");
const menuInfo = document.querySelector("[data-menu-info]");
const overlay = document.querySelector("[data-overlay]");
const moveUpBtn = document.querySelector("[data-poup]");
const aTref = document.querySelectorAll("a[href]");
const picture = document.querySelectorAll("picture.lazy-img-container");

// #region end

//#region start==================={Helper fuctions}==========================
const cList = {
  add: (el, cl) => el.classList.add(cl),
  rem: (el, cl) => el.classList.remove(cl),
  tog: (el, cl) => el.classList.toggle(cl),
};

const sTime = (func, time) => {
  setTimeout(() => {
    func();
  }, time);
};
//#region end

//#region start===================================={Call Backs}
// If closed
const addTranslateX = () => {
  cList.add(overlay, "translateX");
  cList.add(menuInfo, "hidden");
  sTime(() => cList.add(menu, "hide"), 500);
};

// If open
const remTranslateX = () => {
  cList.rem(menu, "hide");
  sTime(() => cList.rem(overlay, "translateX"), 500);
  sTime(() => cList.rem(menuInfo, "hidden"), 600);
};

//#region end

const handleScroolIntoView = function (aTref) {
  aTref.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      //   Get the id and scrool into view
      const targetId = anchor.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
};
handleScroolIntoView(aTref);

//===================={Load Hero Section ASAP}=====================//
const setBackgroundImage = () => {
  const header = document.getElementById("header");
  if (!header) return;

  const isMobile = window.innerWidth <= 1023;
  const bgImage = isMobile ? header.dataset.bgMobile : header.dataset.bgDesktop;

  if (bgImage) {
    header.style.backgroundImage = bgImage;
    header.classList.remove("header--lazyload");
  }
};

// Debounce to prevent excessive calls on resize
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", setBackgroundImage);
  window.addEventListener("resize", debounce(setBackgroundImage, 200));
});

// #region start
//===================={Observe popup button}=====================//
const handleObserveHeader = function (entries) {
  entries.forEach((entry) => {
    entry.isIntersecting
      ? cList.add(moveUpBtn, "hidden")
      : cList.rem(moveUpBtn, "hidden");
  });
};

const headerOption = {
  root: null,
  threshold: 0.1,
};

const observer = new IntersectionObserver(handleObserveHeader, headerOption);
observer.observe(header);

//===================={Lazy Loading Images}=====================//
const handleLazyObserver = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const picture = entry.target;

    // handle the <source> element
    const source = picture.querySelectorAll("source");
    source.forEach((source) => {
      const srcSet = source.dataset.srcset;
      if (srcSet) {
        // change back to defult
        source.srcset = srcSet;
      }
    });

    //handle the <img> element
    const img = picture.querySelector("img");
    const imgScr = img.dataset.src;

    if (imgScr) {
      img.src = imgScr;
      img.onload = () => {
        cList.rem(picture, "lazy-img-container");
        cList.rem(img, "lazy-img");
      };
    }
    observer.unobserve(entry.target);
  });
};

const lazyOptions = {
  root: null,
  threshold: 0,
};

const lazyObserver = new IntersectionObserver(handleLazyObserver, lazyOptions);
picture.forEach((img) => lazyObserver.observe(img));

//#region end

// #reginstart {Header}
header.addEventListener("click", function (e) {
  e.preventDefault();
  const openMenu = e.target.closest("[data-open-menu]");
  const closeMenu = e.target.closest("[data-close-menu]");

  if (openMenu) remTranslateX();
  if (closeMenu) addTranslateX();
});
// #region end
