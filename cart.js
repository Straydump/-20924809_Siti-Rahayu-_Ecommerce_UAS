document.addEventListener('DOMContentLoaded', () => {
  const cartItemsList = document.getElementById('cart-items');
  const cartEmptyText = document.getElementById('cart-empty');
  const cartTotalSection = document.getElementById('cart-total');
  const totalPriceElem = document.getElementById('total-price');
  const checkoutButton = document.getElementById('checkout-button');

  // Elemen form produk (sesuaikan ID sesuai form Anda)
  const levelSelect = document.getElementById('level');
  const sauceSelect = document.getElementById('sauce');
  const consumptionRadios = document.querySelectorAll('input[name="consumption"]');
  const addToCartBtn = document.getElementById('addToCartBtn');

  // Elemen untuk pilihan nomor meja dan metode pembayaran
  const tableSelect = document.getElementById('table-number');
  const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');

  let cart = [];
  let selectedTable = localStorage.getItem('selectedTable') || '';

  const optionLabels = {
    level: 'Level',
    flavor: 'Rasa',
    sauce: 'Saus',
    topping: 'Topping',
    jenis: 'Jenis',
    size: 'Ukuran',
    color: 'Warna',
    consumption: 'Metode Konsumsi',
    seat: 'Tempat Duduk'
  };

  // Load keranjang dari localStorage
  function loadCartFromStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        cart = JSON.parse(storedCart);
      } catch {
        cart = [];
        localStorage.removeItem('cart');
      }
    }
  }

  // Simpan keranjang ke localStorage
  function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Kapitalisasi string
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Format opsi produk menjadi string ramah pengguna
  function formatOptions(options) {
    if (!options) return '';
    const entries = Object.entries(options).filter(([_, v]) => v !== null && v !== undefined && v !== '');
    if (entries.length === 0) return '';
    return entries.map(([k, v]) => {
      const label = optionLabels[k] || capitalize(k);
      return `${label}: ${v}`;
    }).join(', ');
  }

  // Format tampilan item di keranjang
  function formatCartItemDisplay(item) {
    const mainOptionKey = 'topping'; // misal topping sebagai opsi utama
    const mainOptionValue = item.options?.[mainOptionKey] || '';
    const mainProductName = `${item.name} ${mainOptionValue}`.trim();

    const otherOptions = Object.entries(item.options || {})
      .filter(([key]) => key !== mainOptionKey)
      .map(([k, v]) => {
        const label = optionLabels[k] || capitalize(k);
        return `${label}: ${v}`;
      })
      .filter(val => val && val.trim() !== '')
      .join(', ');

    if (otherOptions) {
      return `${mainProductName} (${otherOptions})`;
    }
    return mainProductName;
  }

  // Update tampilan keranjang
  function updateCartUI() {
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      cartEmptyText.style.display = 'block';
      cartTotalSection.style.display = 'none';
      return;
    }

    cartEmptyText.style.display = 'none';
    cartTotalSection.style.display = 'block';

    let total = 0;
    cart.forEach((item, index) => {
      total += (item.price || 0) * (item.quantity || 1);

      const itemDisplayText = formatCartItemDisplay(item);

      const li = document.createElement('li');
      li.textContent = `${itemDisplayText} x${item.quantity || 1} - Rp${((item.price || 0) * (item.quantity || 1)).toLocaleString('id-ID')}`;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Hapus';
      removeBtn.style.marginLeft = '10px';
      removeBtn.addEventListener('click', () => {
        cart.splice(index, 1);
        saveCartToStorage();
        updateCartUI();
        Swal.fire({
          icon: 'info',
          title: 'Item Dihapus',
          text: `${item.name} telah dihapus dari keranjang.`,
          timer: 1500,
          showConfirmButton: false
        });
      });

      li.appendChild(removeBtn);
      cartItemsList.appendChild(li);
    });

    totalPriceElem.textContent = total.toLocaleString('id-ID');
    saveCartToStorage();
  }

  // Fungsi untuk menambahkan produk ke keranjang
  function addToCart(newItem) {
    // Validasi input produk
    if (!newItem.options.level || !newItem.options.sauce || !newItem.options.consumption) {
      alert('Lengkapi semua pilihan produk terlebih dahulu!');
      return;
    }

    // Cek apakah item sudah ada di keranjang (nama + opsi sama)
    const existingIndex = cart.findIndex(item => {
      if (item.name !== newItem.name) return false;
      const keys1 = Object.keys(item.options || {});
      const keys2 = Object.keys(newItem.options || {});
      if (keys1.length !== keys2.length) return false;
      return keys1.every(key => item.options[key] === newItem.options[key]);
    });

    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + (newItem.quantity || 1);
    } else {
      cart.push({
        ...newItem,
        quantity: newItem.quantity || 1
      });
    }

    saveCartToStorage();
    updateCartUI();

    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: 'Produk berhasil ditambahkan ke keranjang!',
      timer: 1500,
      showConfirmButton: false
    });
  }

  // Inisialisasi pilihan nomor meja
  if (tableSelect) {
    if (selectedTable) {
      tableSelect.value = selectedTable;
    } else {
      tableSelect.value = '';
    }
    tableSelect.addEventListener('change', e => {
      selectedTable = e.target.value;
      localStorage.setItem('selectedTable', selectedTable);
    });
  }

  // Event listener tombol tambah ke keranjang
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const level = levelSelect?.value || '';
      const sauce = sauceSelect?.value || '';
      const consumptionInput = [...consumptionRadios].find(r => r.checked);
      const consumption = consumptionInput?.value || '';

      if (!level || !sauce || !consumption) {
        alert('Silakan lengkapi semua pilihan produk!');
        return;
      }

      const newItem = {
        name: 'Wonton Chili Oil',
        options: {
          level,
          sauce,
          consumption
        },
        price: 10000,
        quantity: 1
      };

      addToCart(newItem);
    });
  }

  // Event listener tombol checkout
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      if (cart.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Keranjang Kosong',
          text: 'Silakan tambahkan produk terlebih dahulu.',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      if (!selectedTable || selectedTable === '') {
        Swal.fire({
          icon: 'warning',
          title: 'Pilih Nomor Meja',
          text: 'Silakan pilih nomor meja terlebih dahulu.',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      let paymentMethod = null;
      for (const radio of paymentMethodRadios) {
        if (radio.checked) {
          paymentMethod = radio.value;
          break;
        }
      }

      if (!paymentMethod) {
        Swal.fire({
          icon: 'warning',
          title: 'Pilih Metode Pembayaran',
          text: 'Silakan pilih metode pembayaran terlebih dahulu.',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Terima Kasih!',
        html: `Pembelian berhasil.<br>Nomor Meja: <b>${selectedTable}</b><br>Metode pembayaran: <b>${paymentMethod}</b><br>Total: Rp${totalPriceElem.textContent}`,
        confirmButtonText: 'OK'
      });

      // Reset keranjang dan pilihan
      cart = [];
      selectedTable = '';
      if (tableSelect) tableSelect.value = '';
      localStorage.removeItem('selectedTable');
      saveCartToStorage();
      updateCartUI();
    });
  }

  // Load dan tampilkan keranjang saat halaman dimuat
  loadCartFromStorage();
  updateCartUI();
});
