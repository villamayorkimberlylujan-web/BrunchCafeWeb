// Botón del menú hamburguesa
const hamburgerBtn = document.getElementById("hamburger-btn");
const navLinks = document.getElementById("nav-links");

hamburgerBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Scroll suave al hacer clic en los botones de categorías
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-target");
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }

    // Cerrar menú en móviles después del clic
    navLinks.classList.remove("active");
  });
});
