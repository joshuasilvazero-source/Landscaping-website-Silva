const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeBtn = document.getElementById("themeBtn");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const navbar = document.getElementById("navbar");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.textContent = "☰";
    });
});

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeBtn.textContent = isDark ? "Light" : "Dark";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "Light";
}

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const booking = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        service: document.getElementById("service").value,
        date: document.getElementById("date").value,
        message: document.getElementById("message").value.trim(),
        submittedAt: new Date().toISOString()
    };

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    formMessage.textContent = "Booking submitted successfully. Demo saved in browser storage.";
    bookingForm.reset();
});

const revealElements = document.querySelectorAll(".section, .stats");

const revealOnScroll = () => {
    revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight - 120) {
            element.classList.add("active");
        }
    });
};

revealElements.forEach((element) => element.classList.add("reveal"));
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
