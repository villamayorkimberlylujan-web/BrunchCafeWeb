const menuData = [
    // MAÑANA: CAFETERÍA (Usando tus imágenes)
    { 
        id: 1, 
        name: "Café Expreso Doble", 
        description: "El shot de energía perfecto. Nuestro blend de café de especialidad.", 
        price: 450, // Corregido el precio para que sea más coherente con otros productos
        category: "cafeteria", 
        image: "imag/expreso-category.jpg" 
    },
    { 
        id: 2, 
        name: "Capuccino Vainilla", 
        description: "Leche vaporizada, espresso, sirope de vainilla y arte chocolate.", 
        price: 480, // Corregido el precio
        category: "cafeteria", 
        image: "imag/blog-3.jpg" 
    },
    { 
        id: 8, 
        name: "Latte Macchiato", 
        description: "Capas de leche caliente, espresso y espuma de leche.", 
        price: 480, 
        category: "cafeteria", 
        image: "imag/macchiato.jpg" 
    },
    // MAÑANA: DESAYUNOS 
    { id: 3, name: "Waffles con Frutas", description: "Dos waffles, arándanos, banana y miel de maple.", price: 620, category: "desayunos", image: "imag/Waffle.jpg" },
    { id: 4, name: "Tostado", description: "Jamón y queso.", price: 480, category: "desayunos", image: "imag/tostadas.jpg" },
    { id: 9, name: "LO MAS PEDIDO (café y medialunas)", description: "Medialunas recién horneadas, dulces o saladas.", price: 350, category: "desayunos", image: "imag/medialuna.jpg" },
    // MAÑANA: LICUADOS/SMOOTHIES
    { id: 5, name: "Licuado Frutos Rojos", description: "Fresa, arándano y un toque de naranja.", price: 580, category: "licuados", image: "imag/lfrutosrojos.jpg" },
    { id: 10, name: "Smoothie Verde Detox", description: "Espinaca, manzana verde, jengibre y pepino.", price: 650, category: "licuados", image: "imag/Smoothie.jpg" },
    // MEDIODÍA: ALMUERZOS
    { id: 6, name: "Ensalada Mediterránea", description: "Base de quinoa, aceitunas, queso feta y cherrys.", price: 950, category: "almuerzos", image: "imag/ensalada.jpg" },
    { id: 7, name: "Hamburguesas con papas", description: "Pan, medallón casero, queso, jamón y aderezo ruso.", price: 1100, category: "almuerzos", image: "imag/hamburguesa.jpg" },
    { id: 11, name: "Sándwich de Pollo Crispy", description: "Pechuga de pollo apanada, lechuga, tomate y mayonesa especial.", price: 890, category: "almuerzos", image: "imag/sandwich.jpg" },
];

const cart = {}; // Objeto para almacenar los items en el carrito

/* ========================================= */
/* 1. RENDERIZACIÓN DEL MENÚ */
/* ========================================= */

function renderMenu() {
    const containerIds = {
        cafeteria: 'cafeteria-products',
        desayunos: 'desayunos-products',
        licuados: 'licuados-products',
        almuerzos: 'almuerzos-products'
    };
    
    // Limpia todos los contenedores antes de renderizar
    Object.values(containerIds).forEach(id => {
        const container = document.getElementById(id);
        if(container) container.innerHTML = '';
    });

    menuData.forEach(product => {
        const container = document.getElementById(containerIds[product.category]);
        if (container) {
            const card = document.createElement('article');
            card.className = 'product-card full-width';
            
            const imageUrl = product.image;
            
            // *** CORRECCIÓN DE SINTAXIS: Uso de Backticks (`) para Template Literals ***
            card.innerHTML = `
                <div class="product-image-placeholder" style="background-image: url('${imageUrl}');"></div>
                <div class="product-text">
                    <h3>${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                </div>
                <button class="add-to-cart-btn" data-id="${product.id}">Añadir al Carrito</button>
            `;
            // *************************************************************************
            
            container.appendChild(card);
        }
    });

    // Asigna el evento 'click' a todos los botones de 'Añadir al Carrito'
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

/* ========================================= */
/* 2. LÓGICA DE FILTRADO (Scroll a la sección) */
/* ========================================= */

document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        // 1. Actualiza la pastilla activa
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // 2. Hace scroll suave a la sección
        const targetId = this.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navHeight = document.querySelector('.sticky-category-nav').offsetHeight;
            
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
            
            // Compensación adicional para que no quede pegado a la barra
            setTimeout(() => {
                window.scrollBy(0, -navHeight - 20);
            }, 10);
        }
    });
});

/* ========================================= */
/* 3. LÓGICA DEL CARRITO */
/* ========================================= */

function addToCart(productId) {
    const product = menuData.find(p => p.id === productId);

    if (product) {
        if (cart[productId]) {
            cart[productId].quantity++;
        } else {
            cart[productId] = { ...product, quantity: 1 };
        }
        updateCartSummary();
        // *** CORRECCIÓN DE SINTAXIS: Uso de Backticks (`) en la alerta ***
        alert(`Agregado: ${product.name} al carrito.`); // Notificación simple
        // *****************************************************************
    }
}

function updateCartSummary() {
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total-summary');
    const cartBar = document.getElementById('floating-cart-bar');
    let totalItems = 0;
    let totalValue = 0;

    for (const id in cart) {
        const item = cart[id];
        totalItems += item.quantity;
        totalValue += item.price * item.quantity;
    }
    
    cartCountElement.textContent = totalItems;
    cartTotalElement.textContent = `$${totalValue.toFixed(2)}`; // Formato de moneda

    // Muestra u oculta la barra inferior del carrito
    if (totalItems > 0) {
        cartBar.style.display = 'flex';
    } else {
        cartBar.style.display = 'none';
    }
}


/* ========================================= */
/* 4. LÓGICA DEL MENÚ HAMBURGUESA */
/* ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");
    
    // Toggle para mostrar/ocultar el menú
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            navLinks.classList.toggle("show");
        });
    }

    // Cierra el menú al hacer clic en un enlace (útil para móviles)
    document.querySelectorAll('#nav-links .category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navLinks.classList.remove("show");
        });
    });
});

/* ========================================= */
/* INICIALIZACIÓN */
/* ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    updateCartSummary(); // Asegura que la barra del carrito esté oculta si está vacío al inicio
});