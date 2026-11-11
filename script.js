/* =========================================================
   ARTS OF WOOD - Website Interactions & Estimator Engine
   ========================================================= */

const WHATSAPP_NUMBER = "919334439854";

document.addEventListener("DOMContentLoaded", () => {
  // Set current year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 1. Mobile Menu Toggle
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");

  function closeMenu() {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  }

  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "✕" : "☰";
  });

  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

  // 2. Light / Dark Theme Toggle
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");

  try {
    const saved = localStorage.getItem("aow-theme");
    if (saved) root.setAttribute("data-theme", saved);
  } catch (err) {}

  themeBtn.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("aow-theme", next); } catch (err) {}
  });

  // 3. Scroll Header Class
  const header = document.getElementById("siteHeader");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  // 4. Scroll Reveal Animations
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add("in"));
  }

  // 5. Stat Counter Animation
  const counters = document.querySelectorAll(".count");
  if ("IntersectionObserver" in window) {
    const countObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          obs.unobserve(el);
          const target = Number(el.dataset.to);
          const suffix = el.dataset.suffix || "";
          const start = performance.now();
          const duration = 1400;

          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.round(target * p) + (p === 1 ? suffix : "");
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => countObs.observe(c));
  }

  // 6. Interactive Cost Estimator
  const scopeSelect = document.getElementById("calcScope");
  const matSelect = document.getElementById("calcMaterial");
  const finishSelect = document.getElementById("calcFinish");
  const areaSlider = document.getElementById("calcArea");
  const areaDisplay = document.getElementById("areaValDisplay");
  const calcTotal = document.getElementById("calcTotal");
  const sumScope = document.getElementById("sumScope");
  const sumMat = document.getElementById("sumMat");
  const sumFinish = document.getElementById("sumFinish");
  const sumArea = document.getElementById("sumArea");
  const sendCalcBtn = document.getElementById("sendCalcWa");

  // Rates in INR per sq.ft base
  const BASE_RATES = {
    kitchen: 1100,
    wardrobe: 950,
    fullhome: 850,
    furniture: 1200,
    aluminium: 650
  };

  const MAT_MULTIPLIER = {
    hdhmr: 1.0,
    bwp: 1.15,
    teak: 1.75
  };

  const FINISH_ADDON = {
    laminate: 0,
    acrylic: 180,
    veneer: 320,
    fluted: 250
  };

  function updateEstimate() {
    const scope = scopeSelect.value;
    const mat = matSelect.value;
    const finish = finishSelect.value;
    const area = Number(areaSlider.value);

    areaDisplay.textContent = `${area} sq.ft`;
    sumArea.textContent = `${area} sq.ft`;
    sumScope.textContent = scopeSelect.options[scopeSelect.selectedIndex].text;
    sumMat.textContent = matSelect.options[matSelect.selectedIndex].text.split("(")[0].trim();
    sumFinish.textContent = finishSelect.options[finishSelect.selectedIndex].text.split("(")[0].trim();

    const baseRate = BASE_RATES[scope] || 1000;
    const rateWithMat = baseRate * (MAT_MULTIPLIER[mat] || 1.0);
    const finalRate = rateWithMat + (FINISH_ADDON[finish] || 0);

    const estLow = Math.round((finalRate * 0.95 * area) / 1000) * 1000;
    const estHigh = Math.round((finalRate * 1.12 * area) / 1000) * 1000;

    const formatter = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
    calcTotal.textContent = `${formatter.format(estLow)} - ${formatter.format(estHigh)}`;
  }

  [scopeSelect, matSelect, finishSelect, areaSlider].forEach(el => {
    el.addEventListener("input", updateEstimate);
  });
  updateEstimate();

  sendCalcBtn.addEventListener("click", () => {
    const text =
      `*Enquiry: Project Cost Estimate via Website*\n` +
      `• Scope: ${sumScope.textContent}\n` +
      `• Substrate: ${sumMat.textContent}\n` +
      `• Finish: ${sumFinish.textContent}\n` +
      `• Approx Area: ${sumArea.textContent}\n` +
      `• Estimated Budget: ${calcTotal.textContent}\n\n` +
      `Hello Arts of Wood team, I would like to schedule a site measurement or discuss this project.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  // 7. Portfolio Showcase & Lightbox
  const WORKS = [
    {
      src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
      title: "Modular Island Kitchen",
      desc: "Morabadi Luxury Flat — High-Gloss Acrylic with Hettich Tandem Drawers",
      tag: "kitchen"
    },
    {
      src: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1200&q=80",
      title: "Sliding Profile Wardrobe",
      desc: "Bariatu Residence — Tinted fluted glass doors with sensor lights",
      tag: "wardrobe"
    },
    {
      src: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      title: "8-Seater Burma Teak Dining Table",
      desc: "Custom handcrafted solid-wood table with live-edge treatment",
      tag: "furniture"
    },
    {
      src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      title: "Contemporary Living Room Panelling",
      desc: "Kanke Road Villa — Natural American Walnut veneer with brass T-inlays",
      tag: "interior"
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      title: "Master Suite & Bed Back Panelling",
      desc: "Fabric acoustics combined with warm walnut bedside consoles",
      tag: "interior"
    },
    {
      src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      title: "Euro Slimline Aluminium Partitions",
      desc: "Acoustic toughened glass sliding partitions for private study",
      tag: "aluminium"
    },
    {
      src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
      title: "Executive Office Desk & Storage",
      desc: "Harmu Corporate Office — Scratch-proof laminate with wire management",
      tag: "furniture"
    },
    {
      src: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
      title: "Parallel Chef Kitchen",
      desc: "BWP Marine Ply base units with quartz stone breakfast counter",
      tag: "kitchen"
    }
  ];

  const galleryEl = document.getElementById("gallery");
  const filterWrap = document.getElementById("filters");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  let activeList = WORKS;
  let activeIndex = 0;

  function renderGallery(list) {
    activeList = list;
    galleryEl.innerHTML = "";
    list.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "gallery-item reveal in";
      card.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy">
        <div class="gallery-cap">
          <strong>${item.title}</strong>
          <small>${item.desc}</small>
        </div>
      `;
      card.addEventListener("click", () => openLightbox(idx));
      galleryEl.appendChild(card);
    });
  }

  function openLightbox(i) {
    activeIndex = i;
    const item = activeList[i];
    lbImg.src = item.src;
    lbImg.alt = item.title;
    lbCap.innerHTML = `<strong>${item.title}</strong><small>${item.desc}</small>`;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
  }

  function stepLightbox(dir) {
    if (lightbox.hidden || !activeList.length) return;
    openLightbox((activeIndex + dir + activeList.length) % activeList.length);
  }

  filterWrap.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    filterWrap.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === chip));
    const tag = chip.dataset.filter;
    renderGallery(tag === "all" ? WORKS : WORKS.filter(w => w.tag === tag));
  });

  lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lb-prev").addEventListener("click", () => stepLightbox(-1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", e => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  renderGallery(WORKS);

  // 8. FAQ Accordion
  document.querySelectorAll(".acc-header").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".acc-item").forEach(i => {
        i.classList.remove("open");
        i.querySelector(".acc-content").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        const panel = item.querySelector(".acc-content");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  // 9. Contact Form
  const form = document.getElementById("enquiryForm");
  const formMsg = document.getElementById("formMsg");
  const fName = document.getElementById("fName");
  const fPhone = document.getElementById("fPhone");
  const fType = document.getElementById("fType");
  const fMsg = document.getElementById("fMsg");

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = fName.value.trim();
    const phone = fPhone.value.trim();
    const type = fType.value;
    const msg = fMsg.value.trim();

    [fName, fPhone].forEach(f => f.classList.remove("invalid"));
    formMsg.textContent = "";

    if (!name) {
      fName.classList.add("invalid");
      formMsg.textContent = "Please provide your name.";
      fName.focus();
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 12) {
      fPhone.classList.add("invalid");
      formMsg.textContent = "Please provide a valid 10-digit mobile number.";
      fPhone.focus();
      return;
    }

    const text =
      `*New Project Enquiry — Arts of Wood*\n` +
      `• Client Name: ${name}\n` +
      `• Mobile: ${phone}\n` +
      `• Interested In: ${type}\n` +
      (msg ? `• Details: ${msg}` : "");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    form.reset();
    formMsg.style.color = "var(--brand)";
    formMsg.textContent = "Redirecting to WhatsApp to send your request...";
  });
});