let cart = JSON.parse(localStorage.getItem('cart')) || [];
let discount = 0;
const deliveryFee = 1.500;

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

function updateCartUI() {
    const tableBody = document.getElementById('cartTableBody');
    const cartContent = document.getElementById('cartContent');
    const emptyMsg = document.getElementById('emptyCartMsg');

    if (cart.length === 0) {
        tableBody.innerHTML = '';
        emptyMsg.classList.remove('d-none');
        document.querySelector('.table-responsive').classList.add('d-none');
    } else {
        emptyMsg.classList.add('d-none');
        document.querySelector('.table-responsive').classList.remove('d-none');
        
        tableBody.innerHTML = cart.map(item => `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="rounded-3 me-3" style="width: 50px; height: 50px; object-fit: cover;">
                        <div><h6 class="mb-0 fw-bold">${item.name}</h6></div>
                    </div>
                </td>
                <td>${item.price.toFixed(3)}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-sm btn-light border rounded-circle" onclick="changeQty('${item.id}', -1)">-</button>
                        <span class="fw-bold">${item.quantity}</span>
                        <button class="btn btn-sm btn-light border rounded-circle" onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                </td>
                <td class="fw-bold text-primary">${(item.price * item.quantity).toFixed(3)}</td>
                <td>
                    <button class="btn btn-sm text-danger" onclick="removeItem('${item.id}')"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }
    calculateTotals();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id == id);
    if (item) {
        item.quantity += delta;
        if (item.quantity < 1) removeItem(id);
        else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        }
    }
}

function removeItem(id) {
    cart = cart.filter(i => i.id != id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = subtotal * discount;
    const total = (subtotal - discountAmount) + (subtotal > 0 ? deliveryFee : 0);

    document.getElementById('summarySubtotal').innerText = `${subtotal.toFixed(3)} OMR`;
    document.getElementById('summaryTotal').innerText = `${total.toFixed(3)} OMR`;
    
    if (discount > 0) {
        document.getElementById('discountRow').classList.remove('d-none');
        document.getElementById('summaryDiscount').innerText = `-${discountAmount.toFixed(3)} OMR`;
    }
}

function applyPromo() {
    const code = document.getElementById('promoInput').value.trim();
    if (code === 'TASTE10') {
        discount = 0.10;
        alert('Promo code applied successfully!');
        calculateTotals();
    } else {
        alert('Invalid promo code.');
    }
}

function toggleCardField() {
    const isCard = document.getElementById('payCard').checked;
    document.getElementById('cardField').classList.toggle('d-none', !isCard);
}

function handleCheckout(event) {
    event.preventDefault();
    
    const phone = document.getElementById('custPhone').value;
    const isCard = document.getElementById('payCard').checked;
    const cardNumber = document.getElementById('cardNumber').value;

    // 1. التحقق من رقم الهاتف (أرقام فقط)
    if (!/^\d+$/.test(phone)) {
        alert('Please enter a valid phone number (digits only).');
        return;
    }

    // 2. التحقق من رقم البطاقة (16 رقم)
    if (isCard && cardNumber.length !== 16) {
        alert('Card number must be exactly 16 digits.');
        return;
    }

    // النجاح - معالجة الطلب
    const orderId = Math.floor(10000 + Math.random() * 90000);
    const itemNames = cart.map(i => `${i.quantity}x ${i.name}`).join(', ');

    // عرض بيانات المودال
    document.getElementById('orderIdDisplay').innerText = `#${orderId}`;
    document.getElementById('orderItemsDisplay').innerText = itemNames;

    // مسح السلة
    localStorage.removeItem('cart');
    
    // إظهار المودال (باستخدام Bootstrap JS)
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}