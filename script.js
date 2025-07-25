document.addEventListener('DOMContentLoaded', () => {
  // ===========================
  // Fungsi dan Variabel Utama
  // ===========================

  const burgerMenuBtn = document.getElementById('burger-menu');
  const navLinks = document.getElementById('nav-links');
  const cartCount = document.getElementById('cart-count');
  const cartItemsList = document.getElementById('cart-items');
  const totalPriceElem = document.getElementById('total-price');
  const feedbackForm = document.getElementById('feedbackForm');
  const responseMessage = document.getElementById('responseMessage');

  let cart = [];

  // ===========================
  // Fungsi Cek Status Login
  // ===========================
  function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      // Jika belum login, redirect ke halaman login
      window.location.href = 'login.html';
    }
  }

  // ===========================
  // Fungsi Keranjang Belanja
  // ===========================

  // Load data keranjang dari localStorage
  function loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) {
      cart = JSON.parse(stored);
    } else {
      cart = [];
    }
  }

  // Simpan data keranjang ke localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Update badge jumlah item di ikon keranjang
  function updateCartBadge() {
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    if (cartCount) {
      if (totalQuantity > 0) {
        cartCount.style.display = 'inline-block';
        cartCount.textContent = totalQuantity;
      } else {
        cartCount.style.display = 'none';
      }
    }
  }

  // Render daftar item keranjang di UI
  function renderCartItems() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartItemsList.innerHTML = '<p>Keranjang kosong.</p>';
      updateCartBadge();
      updateCartTotal();
      return;
    }

    cart.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item.name} x ${item.quantity}</span>
        <span>Rp${(item.price * item.quantity).toLocaleString('id-ID')}</span>
        <button data-index="${idx}" class="remove-item-btn">Hapus</button>
      `;
      cartItemsList.appendChild(div);
    });

    // Event hapus item keranjang
    cartItemsList.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = parseInt(e.target.dataset.index, 10);
        if (!isNaN(idx)) {
          cart.splice(idx, 1);
          saveCart();
          renderCartItems();
          updateCartBadge();
          updateCartTotal();
        }
      });
    
    });

    updateCartBadge();
    updateCartTotal();
  }

  // Update total harga keranjang
  function updateCartTotal() {
    if (!totalPriceElem) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElem.textContent = `Rp${total.toLocaleString('id-ID')}`;
  }

  // Tambah produk ke keranjang
  function addToCart(product) {
    const existingIndex = cart.findIndex(item =>
      item.name === product.name &&
      JSON.stringify(item.options || {}) === JSON.stringify(product.options || {})
    );
    if (existingIndex > -1) {
      cart[existingIndex].quantity += product.quantity || 1;
    } else {
      cart.push({...product, quantity: product.quantity || 1});
    }
    saveCart();
    renderCartItems();
    updateCartBadge();
  }

  // ===========================
  // Event Listener
  // ===========================

  // Event tombol tambah ke keranjang
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const product = {
        name: button.dataset.name,
        price: parseInt(button.dataset.price, 10),
        quantity: 1,
        options: {}
      };
      addToCart(product);
    });
  });

  // Toggle menu burger
  if (burgerMenuBtn && navLinks) {
    burgerMenuBtn.addEventListener('click', () => {
      const expanded = burgerMenuBtn.getAttribute('aria-expanded') === 'true';
      burgerMenuBtn.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('show');
    });

    // Tutup menu saat klik link navigasi
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        burgerMenuBtn.setAttribute('aria-expanded', false);
      });
    });
  }

  // Form kritik dan saran
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', e => {
      e.preventDefault();
      const pesan = feedbackForm.querySelector('#pesan').value.trim();
      if (!pesan) {
        alert('Mohon isi kritik dan saran Anda.');
        return;
      }
      if (responseMessage) {
        responseMessage.style.display = 'block';
        responseMessage.textContent = 'Terima kasih atas kritik dan saran Anda!';
      }
      feedbackForm.reset();
    });
  }

  // ===========================
  // Inisialisasi
  // ===========================

  checkLogin();       // Cek login dulu, jika belum redirect login.html
  loadCart();         // Load data keranjang dari localStorage
  renderCartItems();  // Render isi keranjang di UI
  updateCartBadge();  // Update badge keranjang
  updateCartTotal();  // Update total harga keranjang
});
