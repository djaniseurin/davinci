document.addEventListener("DOMContentLoaded", () => {

    /* =============================
       HEADER INTELLIGENT
    ============================== */
    const header = document.getElementById("header");
    let lastScroll = 0;

    if (header) {
        window.addEventListener("scroll", () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll && currentScroll > 80) {
                header.classList.add("hide");
            } else {
                header.classList.remove("hide");
            }
            lastScroll = currentScroll;
        });
    }

    /* =============================
       MOBILE SNAP SCROLL (AP-like)
    ============================== */
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (isMobile) {
        const snapSelectors = [
            ".hero",
            ".hero-image",
            ".story-section",
            ".center-text-gallery",
            ".text-button-image",
            ".split-section",
            ".full-screen",
            ".white-section",
            ".boutiques-layout"
        ];
        if (snapSelectors.some((sel) => document.querySelector(sel))) {
            document.body.classList.add("dv-snap");
        }

        const gallery = document.querySelector(".gallery-row");
        const dots = Array.from(document.querySelectorAll(".gallery-dots .dot"));
        if (gallery && dots.length) {
            const updateDots = () => {
                const rect = gallery.getBoundingClientRect();
                const children = Array.from(gallery.children);
                let active = 0;
                let minDist = Infinity;
                children.forEach((child, idx) => {
                    const r = child.getBoundingClientRect();
                    const center = r.left + r.width / 2;
                    const galleryCenter = rect.left + rect.width / 2;
                    const dist = Math.abs(center - galleryCenter);
                    if (dist < minDist) {
                        minDist = dist;
                        active = idx;
                    }
                });
                dots.forEach((d, i) => d.classList.toggle("active", i === active));
            };
            gallery.addEventListener("scroll", () => {
                window.requestAnimationFrame(updateDots);
            });
            updateDots();
        }
    }

    /* =============================
       CARTE BOUTIQUES
    ============================== */
    const mapContainer = document.getElementById("shop-map");
    if (mapContainer && typeof L !== "undefined") {
        const getText = (key, fallback = "") => {
            if (window.dvI18n && typeof window.dvI18n.t === "function") {
                const value = window.dvI18n.t(key, fallback);
                return value === undefined || value === null || value === "" ? fallback : value;
            }
            return fallback;
        };

        const map = L.map('shop-map', {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: ''
        }).addTo(map);

        const shops = {
            paris: {
                nameKey: "shop.paris.name",
                addressKey: "shop.paris.address",
                hoursKey: "shop.paris.hours",
                nameFallback: "DA VINCI PARIS",
                addressFallback: "12 Rue de la Paix<br>75002 Paris, France",
                hoursFallback: "Lundi – Samedi<br>10h00 – 19h00",
                coords: [48.8566, 2.3522]
            },
            londres: {
                nameKey: "shop.london.name",
                addressKey: "shop.london.address",
                hoursKey: "shop.london.hours",
                nameFallback: "DA VINCI LONDRES",
                addressFallback: "49 Regent Street<br>London W1B 4JS, UK",
                hoursFallback: "Lundi – Samedi<br>10h00 – 19h00",
                coords: [51.5074, -0.1278]
            },
            florence: {
                nameKey: "shop.florence.name",
                addressKey: "shop.florence.address",
                hoursKey: "shop.florence.hours",
                nameFallback: "DA VINCI FLORENCE",
                addressFallback: "18 Via de' Tornabuoni<br>50123 Firenze, Italie",
                hoursFallback: "Lundi – Samedi<br>10h00 – 19h00",
                coords: [43.7696, 11.2558]
            },
            berlin: {
                nameKey: "shop.berlin.name",
                addressKey: "shop.berlin.address",
                hoursKey: "shop.berlin.hours",
                nameFallback: "DA VINCI BERLIN",
                addressFallback: "21 Kurfurstendamm<br>10719 Berlin, Allemagne",
                hoursFallback: "Lundi – Samedi<br>10h00 – 19h00",
                coords: [52.52, 13.405]
            }
        };

        const nameEl = document.getElementById("shop-name");
        const addressEl = document.getElementById("shop-address");
        const hoursEl = document.getElementById("shop-hours");
        let lastShopKey = "paris";

        const renderShop = (key) => {
            const shop = shops[key];
            if (!shop) return;
            const name = getText(shop.nameKey, shop.nameFallback);
            const address = getText(shop.addressKey, shop.addressFallback);
            const hours = getText(shop.hoursKey, shop.hoursFallback);
            if (nameEl) nameEl.innerHTML = name;
            if (addressEl) addressEl.innerHTML = address;
            if (hoursEl) hoursEl.innerHTML = hours;
        };

        Object.entries(shops).forEach(([key, shop]) => {
            const marker = L.circleMarker(shop.coords, {
                radius: 6,
                color: "#111",
                fillColor: "#111",
                fillOpacity: 1
            }).addTo(map);

            marker.on("click", () => {
                lastShopKey = key;
                renderShop(key);
            });
        });

        const bounds = L.latLngBounds(Object.values(shops).map((shop) => shop.coords));
        map.fitBounds(bounds, { padding: [100, 100] });
        map.zoomOut(1);

        renderShop(lastShopKey);

        document.addEventListener("dv:lang-change", () => {
            renderShop(lastShopKey);
        });
    }
});
