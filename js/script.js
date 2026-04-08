// --- 1. Global Variables ---
let allItems = []; 

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.hero-section')) {
        document.body.classList.add('home-page');
    }

    // جلب البيانات من ملف JSON
    fetch('./data.json')
        .then(res => res.json())
        .then(data => {
            allItems = data.menu;
            if (document.getElementById('menuContainer')) renderMenu(allItems, 'menuContainer');
            if (document.getElementById('popularDishesGrid')) renderMenu(allItems.slice(0, 3), 'popularDishesGrid');
            updateFooter(data.restaurant_info);
            updateCartBadge();
        })
        .catch(error => console.error('Error fetching data:', error));

    setupSearchAndSort();
    setupDarkMode();
    setupNavbarScroll();
    setupCategoryFilters();
});

// --- 2. Menu Rendering ---
function renderMenu(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 shadow-sm border-0">
                <div class="position-relative overflow-hidden">
                    <img src="${item.image}" class="card-img-top item-img" style="height: 220px; object-fit: cover;">
                    <span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3">
                        <i class="bi bi-star-fill"></i> ${item.rating}
                    </span>
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="mb-2"><small class="text-primary fw-bold text-uppercase">${item.category}</small></div>
                    <h5 class="card-title fw-bold">${item.name}</h5>
                    <p class="card-text small text-muted flex-grow-1">${item.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span class="fw-bold fs-5 text-primary">${item.price.toFixed(3)} OMR</span>
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-secondary rounded-circle" onclick="updateQty('${item.id}', -1)">-</button>
                            <span class="fw-bold qty-display" id="qty-${item.id}">1</span>
                            <button class="btn btn-sm btn-outline-secondary rounded-circle" onclick="updateQty('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="btn btn-warning w-100 mt-3 rounded-pill fw-bold add-to-cart-btn" onclick="addToCart('${item.id}', this)">
                        <i class="bi bi-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// --- 3. Flying Item Animation Logic (التعديل الجذري هنا) ---
window.addToCart = function(id, btnElement) {
    const item = allItems.find(i => i.id == id);
    const qtySpan = document.getElementById(`qty-${id}`);
    const qty = qtySpan ? parseInt(qtySpan.innerText) : 1;
    
    // تحديد الصورة وأيقونة السلة
    const cardElement = btnElement.closest('.card');
    const imgToAnimate = cardElement.querySelector('.item-img');
    const cartIcon = document.querySelector('.bi-cart3') || document.getElementById('cartBadge');

    if (imgToAnimate && cartIcon) {
        // إنشاء العنصر الطائر برمجياً لضمان ظهوره
        const flyingImg = document.createElement('img');
        flyingImg.src = imgToAnimate.src;
        
        const imgRect = imgToAnimate.getBoundingClientRect();
        const cartRect = cartIcon.getBoundingClientRect();

        // تنسيق العنصر الطائر مباشرة في الـ JS لضمان القوة
        Object.assign(flyingImg.style, {
            position: 'fixed',
            zIndex: '10000',
            left: `${imgRect.left}px`,
            top: `${imgRect.top}px`,
            width: `${imgRect.width}px`,
            height: `${imgRect.height}px`,
            borderRadius: '15px',
            objectFit: 'cover',
            transition: 'all 0.9s cubic-bezier(0.42, 0, 0.58, 1)',
            pointerEvents: 'none'
        });

        document.body.appendChild(flyingImg);

        // بدء الحركة بعد لحظة قصيرة جداً
        setTimeout(() => {
            Object.assign(flyingImg.style, {
                left: `${cartRect.left}px`,
                top: `${cartRect.top}px`,
                width: '10px',
                height: '10px',
                opacity: '0.2',
                transform: 'rotate(720deg)'
            });
        }, 50);

        // انتهاء الحركة وتحديث البيانات
        setTimeout(() => {
            flyingImg.remove();
            cartIcon.parentElement.classList.add('cart-shake');
            setTimeout(() => cartIcon.parentElement.classList.remove('cart-shake'), 400);
            
            saveToLocalStorage(item, qty);
        }, 950);
    } else {
        saveToLocalStorage(item, qty);
    }
};

function saveToLocalStorage(item, qty) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(i => i.id == item.id);
    if (index > -1) cart[index].quantity += qty;
    else cart.push({ ...item, quantity: qty });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // إعادة تصفير الكمية في الواجهة
    const qtySpan = document.getElementById(`qty-${item.id}`);
    if (qtySpan) qtySpan.innerText = "1";
}

// --- 4. Helper Functions ---
window.updateQty = function(id, change) {
    const span = document.getElementById(`qty-${id}`);
    if (span) {
        let val = parseInt(span.innerText) + change;
        if (val >= 1) span.innerText = val;
    }
};

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((t, i) => t + i.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.innerText = count;
        badge.style.display = count > 0 ? 'block' : 'none';
    }
}

// --- Dark Mode, Scroll, Footer, etc. ---
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.innerHTML = '<i class="bi bi-sun-fill text-warning"></i>';
    }
    darkModeToggle?.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        darkModeToggle.innerHTML = isDark ? '<i class="bi bi-sun-fill text-warning"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    });
}

function setupNavbarScroll() {
    const mainNav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) mainNav?.classList.add('navbar-scrolled');
        else mainNav?.classList.remove('navbar-scrolled');
    });
}

function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
            btn.classList.add('active', 'btn-primary');
            const category = btn.getAttribute('data-category');
            const filteredItems = (category === 'all') ? allItems : allItems.filter(item => item.category === category);
            renderMenu(filteredItems, 'menuContainer');
        });
    });
}

function setupSearchAndSort() {
    const searchInput = document.getElementById('menuSearch');
    const sortSelect = document.getElementById('sortSelect');
    const updateDisplay = () => {
        let term = searchInput?.value.toLowerCase() || "";
        let filtered = allItems.filter(i => i.name.toLowerCase().includes(term));
        if (sortSelect?.value === 'low') filtered.sort((a, b) => a.price - b.price);
        else if (sortSelect?.value === 'high') filtered.sort((a, b) => b.price - a.price);
        renderMenu(filtered, 'menuContainer');
    };
    searchInput?.addEventListener('input', updateDisplay);
    sortSelect?.addEventListener('change', updateDisplay);
}

function updateFooter(info) {
    const fields = {
        'footer-address': info.address,
        'footer-phone': info.phone,
        'footer-hours': info.deliveryHours,
        'footer-email': `<a href="mailto:${info.email}" class="text-decoration-none text-reset">${info.email}</a>`
    };
    for (let id in fields) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = fields[id];
    }
}