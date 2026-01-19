// ==================== Load component helper ====================
function loadComponent(id, file, callback) {
  fetch(file)
    .then((res) => res.text())
    .then((html) => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = html;
        if (callback) callback();
      } else {
        console.error(`❌ Không tìm thấy container #${id}`);
      }
    })
    .catch((err) => console.error(`❌ Lỗi load component ${file}:`, err));
}

// ==================== Header + Mobile Menu Right + Hamburger + Logo Zoom ====================
loadComponent("headerContainer", "../components/header.html", () => {
  const header = document.getElementById("site-header");
  const hamburger = document.querySelector(".header-hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const logo = document.querySelector(".logo");

  if (!header || !hamburger || !mobileMenu || !logo) {
    console.error("❌ Không tìm thấy header / hamburger / mobile menu / logo");
    return;
  }

  /* ================= Scroll header ================= */
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (mobileMenu.classList.contains("active")) return;

    header.classList.toggle("scrolled", currentScroll > 50);

    if (currentScroll > lastScrollY && currentScroll > 120) {
      header.classList.add("header-hide");
      header.classList.remove("header-show");
    } else {
      header.classList.remove("header-hide");
      header.classList.add("header-show");
    }

    lastScrollY = currentScroll;
  });

  /* ================= Mobile menu toggle ================= */
  const openMenu = () => {
    mobileMenu.classList.add("active");
    hamburger.classList.add("active");
    logo.classList.add("active"); // logo zoom + glow
    document.body.style.overflow = "hidden";

    header.classList.remove("header-hide");
    header.classList.add("header-show");

    setTimeout(() => hamburger.classList.add("active-animate"), 50);
    setTimeout(() => logo.classList.add("active-animate"), 50);
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");
    hamburger.classList.remove("active-animate");
    logo.classList.remove("active");
    logo.classList.remove("active-animate");
    document.body.style.overflow = "auto";
  };

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.contains("active") ? closeMenu() : openMenu();
  });

  /* ================= Mobile menu link click ================= */
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#") && href !== "#0") e.preventDefault();
      closeMenu();
      if (!href.startsWith("#") || href === "#0") window.location.href = href;
    });
  });

  /* ================= Desktop menu anchor safety ================= */
  document.querySelectorAll("#site-header .nav-main a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href.startsWith("#") && href !== "#0") e.preventDefault();
    });
  });
});

// ==================== Footer ====================
loadComponent("footerContainer", "../components/footer.html");

// ==================== Social Media ====================
loadComponent("socialFloatContainer", "../components/social-icons.html");

// =================== JS CORE CAROUSEL SCROLL ========================= //

// ================= Click tab → scroll ================= //
const tabMenu = document.querySelector(".tab-menu");
const tabList = document.querySelector(".tab-list");
const tabs = document.querySelectorAll(".tab-menu a");
const sections = document.querySelectorAll(".service-card");
const solutionSection = document.querySelector(".solution-section");

const btnPrev = document.querySelector(".tab-nav.prev");
const btnNext = document.querySelector(".tab-nav.next");

/* =========================
   CONSTANTS
========================= */
const TAB_OFFSET = tabMenu.offsetHeight + 300; // offset sticky tab
const SCROLL_AMOUNT = 220; // prev/next scroll

/* =========================
   SCROLL HANDLER
========================= */
function onScroll() {
  const scrollY = window.scrollY;

  // 1️⃣ Hide tab-menu khi tới solution section
  const hidePoint = solutionSection.offsetTop - window.innerHeight * 0.2;
  if (scrollY >= hidePoint) {
    tabMenu.classList.add("is-hidden");
  } else {
    tabMenu.classList.remove("is-hidden");
  }

  // 2️⃣ Scroll-spy: xác định section đang active
  let currentId = "";
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= TAB_OFFSET && rect.bottom > TAB_OFFSET) {
      currentId = section.id;
    }
  });

  // 3️⃣ Đồng bộ tab + service-card
  tabs.forEach((tab) => {
    const isActive = tab.getAttribute("href") === `#${currentId}`;
    tab.classList.toggle("active", isActive);
  });

  sections.forEach((section) => {
    section.classList.toggle("active", section.id === currentId);
  });
}

window.addEventListener("scroll", onScroll);

/* =========================
   TAB PREV / NEXT
========================= */
btnNext.addEventListener("click", () => {
  tabList.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" });
});

btnPrev.addEventListener("click", () => {
  tabList.scrollBy({ left: -SCROLL_AMOUNT, behavior: "smooth" });
});

/* =========================
   CHECK TAB OVERFLOW
========================= */
function updateTabNav() {
  const maxScroll = tabList.scrollWidth - tabList.clientWidth;

  btnPrev.classList.toggle("hidden", tabList.scrollLeft <= 0);
  btnNext.classList.toggle("hidden", tabList.scrollLeft >= maxScroll - 5);

  tabMenu.classList.toggle(
    "no-overflow",
    tabList.scrollWidth <= tabList.clientWidth
  );
}

tabList.addEventListener("scroll", updateTabNav);
window.addEventListener("resize", updateTabNav);
updateTabNav();

/* =========================
   CLICK TAB → SCROLL PAGE
========================= */
tabs.forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = tab.getAttribute("href");
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    // Scroll page tới section (bù sticky tab)
    const top =
      targetSection.getBoundingClientRect().top + window.scrollY - TAB_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });

    // Đồng bộ active tab + service-card
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    sections.forEach((sec) =>
      sec.classList.toggle("active", sec.id === targetId.replace("#", ""))
    );
  });
});

/* =========================
   HANDLE ANCHOR ON LOAD
========================= */
window.addEventListener("load", () => {
  if (window.location.hash) {
    const targetSection = document.querySelector(window.location.hash);
    if (!targetSection) return;

    const top =
      targetSection.getBoundingClientRect().top + window.scrollY - TAB_OFFSET;
    window.scrollTo({ top, behavior: "auto" });

    const targetId = window.location.hash.replace("#", "");

    // Đồng bộ tab + service-card
    tabs.forEach((tab) =>
      tab.classList.toggle(
        "active",
        tab.getAttribute("href") === `#${targetId}`
      )
    );

    sections.forEach((sec) =>
      sec.classList.toggle("active", sec.id === targetId)
    );
  }
});

// ================= JS tính toán vị trí nửa vòng tròn ================= //
const nodes = document.querySelectorAll(".solution-icons.semicircle .node");
const radius = 220; // bán kính nửa vòng
const centerX = 0; // sẽ tính dựa trên left 50%
const centerY = 0; // sẽ tính dựa trên top 50%
const angles = [180, 140, 90, 40, 0]; // góc của node1→node5

nodes.forEach((node, i) => {
  const parent = node.parentElement;
  const parentWidth = parent.offsetWidth;
  const parentHeight = parent.offsetHeight;
  const rad = angles[i] * (Math.PI / 180);
  const x = parentWidth / 2 + radius * Math.cos(rad) - node.offsetWidth / 2;
  const y = parentHeight - radius * Math.sin(rad) - node.offsetHeight / 2;
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
});
