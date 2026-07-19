// Select the navigation elements.
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");
const navigationLinks = document.querySelectorAll(".nav-link");
const currentYear = document.getElementById("currentYear");

if (menuButton && navLinks) {
    // Open and close the mobile navigation menu.
    menuButton.addEventListener("click", function () {
        const menuIsOpen = navLinks.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", menuIsOpen.toString());
        document.body.classList.toggle("menu-open", menuIsOpen);
    });

    // Close the mobile navigation after a link is selected.
    navigationLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        });
    });
}

// Automatically display the current year in the footer.
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Highlight the navigation link for the section being viewed.
const pageSections = document.querySelectorAll("main section");

window.addEventListener("scroll", function () {
    let currentSectionId = "";

    pageSections.forEach(function (section) {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSectionId = section.getAttribute("id");
        }
    });

    navigationLinks.forEach(function (link) {
        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSectionId}`
        ) {
            link.classList.add("active");
        }
    });
});

// Prepend status icons to project badges for clarity
document.addEventListener("DOMContentLoaded", function () {
    const mapping = {
        "Active Development": "🟢",
        "Operational": "🔵",
        "Completed": "✅"
    };

    document.querySelectorAll(".status-badge").forEach(function (el) {
        const text = el.textContent.trim();
        const icon = mapping[text] || "";
        if (icon) {
            const span = document.createElement("span");
            span.className = "status-icon";
            span.setAttribute("aria-hidden", "true");
            span.textContent = icon;
            el.insertBefore(span, el.firstChild);
        }
    });
});