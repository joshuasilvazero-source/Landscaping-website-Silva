const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeBtn = document.getElementById("themeBtn");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuToggle.textContent = navLinks.classList.contains("open") ? "✕" : "☰";
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "Light Mode";
}

bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const booking = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        service: document.getElementById("service").value,
        date: document.getElementById("date").value,
        message: document.getElementById("message").value,
        submittedAt: new Date().toISOString()
    };

    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    formMessage.textContent = "Booking submitted successfully. Demo saved in browser storage.";
    bookingForm.reset();
});
