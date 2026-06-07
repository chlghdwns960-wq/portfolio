"use strict";

/* =========================================================
  Portfolio Main JavaScript
  - Mobile Navigation
  - Header Scroll State
  - Smooth Scroll
  - Active Navigation
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const siteHeader = document.getElementById("siteHeader");
  const menuButton = document.getElementById("menuButton");
  const headerNav = document.getElementById("headerNav");
  const navLinks = document.querySelectorAll(".nav-link");
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.getElementById("backToTop");

  const BREAKPOINT_TABLET = 960;

  // 스크롤 위치에 따라 헤더 배경 상태를 변경하는 함수
  function updateHeaderState() {
    if (!siteHeader) return;

    if (window.scrollY > 20) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  }

  function updateBackToTopState() {
    if (!backToTopButton) return;

    backToTopButton.classList.toggle("is-visible", window.scrollY > 520);
  }

  // 모바일 메뉴를 여는 함수
  function openMobileMenu() {
    if (!menuButton || !headerNav) return;

    menuButton.classList.add("is-active");
    headerNav.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "모바일 메뉴 닫기");
  }

  // 모바일 메뉴를 닫는 함수
  function closeMobileMenu() {
    if (!menuButton || !headerNav) return;

    menuButton.classList.remove("is-active");
    headerNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "모바일 메뉴 열기");
  }

  // 모바일 메뉴의 열림/닫힘 상태를 전환하는 함수
  function toggleMobileMenu() {
    if (!menuButton || !headerNav) return;

    const isOpen = headerNav.classList.contains("is-open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // 내부 앵커 링크 클릭 시 해당 섹션으로 이동하는 함수
  function handleAnchorScroll(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    if (!href || href === "#") {
      event.preventDefault();
      return;
    }

    if (!href.startsWith("#")) return;

    const targetId = href.replace("#", "");
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    event.preventDefault();

    targetSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    closeMobileMenu();
  }

  // 현재 스크롤 위치에 맞춰 메뉴 active 상태를 변경하는 함수
  function updateActiveNavigation() {
    if (!navLinks.length) return;

    const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    const currentPosition = window.scrollY + headerHeight + 140;

    navLinks.forEach(function (link) {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        link.classList.remove("is-active");
        return;
      }

      const targetId = href.replace("#", "");
      const section = document.getElementById(targetId);

      if (!section) {
        link.classList.remove("is-active");
        return;
      }

      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (currentPosition >= sectionTop && currentPosition < sectionBottom) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  // 태블릿 이상 화면으로 돌아왔을 때 모바일 메뉴 상태를 초기화하는 함수
  function resetMobileMenuOnResize() {
    if (window.innerWidth > BREAKPOINT_TABLET) {
      closeMobileMenu();
    }
  }

  // ESC 키 입력 시 모바일 메뉴를 닫는 함수
  function handleEscapeKey(event) {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  }

  function scrollToPageTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // 이벤트를 등록하는 함수
  function bindEvents() {
    if (menuButton) {
      menuButton.addEventListener("click", toggleMobileMenu);
    }

    internalLinks.forEach(function (link) {
      link.addEventListener("click", handleAnchorScroll);
    });

    if (backToTopButton) {
      backToTopButton.addEventListener("click", scrollToPageTop);
    }

    window.addEventListener(
      "scroll",
      function () {
        updateHeaderState();
        updateActiveNavigation();
        updateBackToTopState();
      },
      { passive: true }
    );

    window.addEventListener("resize", resetMobileMenuOnResize);
    document.addEventListener("keydown", handleEscapeKey);
  }

  // 초기 실행 함수
  function init() {
    updateHeaderState();
    updateActiveNavigation();
    updateBackToTopState();
    bindEvents();
  }

  init();
});
/* =========================================================
  Image Lightbox
========================================================= */

/**
 * Selected Projects 이미지 클릭 시 확대 라이트박스를 여는 기능
 * - 이미지 클릭: 라이트박스 열기
 * - X 버튼 클릭: 닫기
 * - 어두운 배경 클릭: 닫기
 * - ESC 키 입력: 닫기
 */
function initImageLightbox() {
  const lightbox = document.querySelector("#imageLightbox");
  const lightboxImage = lightbox?.querySelector(".lightbox-image");
  const lightboxTitle = lightbox?.querySelector(".lightbox-title");
  const closeButton = lightbox?.querySelector(".lightbox-close");
  const backdrop = lightbox?.querySelector(".lightbox-backdrop");
  const triggerImages = document.querySelectorAll(".js-lightbox-image");

  if (!lightbox || !lightboxImage || !lightboxTitle || !closeButton || !backdrop || !triggerImages.length) return;

  let lastFocusedElement = null;

  /**
   * 클릭한 이미지 정보를 받아 라이트박스를 표시하는 함수
   */
  function openLightbox(image) {
    lastFocusedElement = document.activeElement;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Project preview image";
    lightboxTitle.textContent = image.dataset.lightboxTitle || image.alt || "Project Preview";

    lightbox.classList.add("is-active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-lightbox-open");

    closeButton.focus();
  }

  /**
   * 열린 라이트박스를 닫고 이전 포커스로 되돌리는 함수
   */
  function closeLightbox() {
    lightbox.classList.remove("is-active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-lightbox-open");

    lightboxImage.src = "";
    lightboxImage.alt = "";

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  /**
   * 확대 가능한 이미지에 클릭/키보드 접근 기능을 연결하는 함수
   */
  function bindLightboxTriggers() {
    triggerImages.forEach((image) => {
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", `${image.alt} 크게 보기`);

      image.addEventListener("click", () => openLightbox(image));

      image.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });
  }

  /**
   * 라이트박스 닫기 이벤트를 연결하는 함수
   */
  function bindLightboxCloseEvents() {
    closeButton.addEventListener("click", closeLightbox);

    backdrop.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-active")) {
        closeLightbox();
      }
    });
  }

  bindLightboxTriggers();
  bindLightboxCloseEvents();
}

initImageLightbox();

/* =========================================================
  Custom Cursor
========================================================= */
function initCustomCursor() {
  const cursor = document.getElementById("customCursor");
  const ring = cursor?.querySelector(".custom-cursor-ring");
  const dot = cursor?.querySelector(".custom-cursor-dot");
  const hoverTargets = document.querySelectorAll(
    'a, button, input, textarea, select, [role="button"], .js-lightbox-image'
  );
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!cursor || !ring || !dot || !finePointerQuery.matches || reducedMotionQuery.matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let rafId = null;

  function renderCursor() {
    ring.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    rafId = window.requestAnimationFrame(renderCursor);
  }

  function startCursor() {
    if (rafId) return;
    document.body.classList.add("has-custom-cursor");
    rafId = window.requestAnimationFrame(renderCursor);
  }

  function stopCursor() {
    document.body.classList.remove("has-custom-cursor");
    cursor.classList.remove("is-visible", "is-hovering", "is-active");

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  document.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.classList.add("is-visible");
      startCursor();
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
  document.addEventListener("mousedown", () => cursor.classList.add("is-active"));
  document.addEventListener("mouseup", () => cursor.classList.remove("is-active"));

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });

  finePointerQuery.addEventListener?.("change", (event) => {
    if (!event.matches) stopCursor();
  });

  reducedMotionQuery.addEventListener?.("change", (event) => {
    if (event.matches) stopCursor();
  });
}

initCustomCursor();
