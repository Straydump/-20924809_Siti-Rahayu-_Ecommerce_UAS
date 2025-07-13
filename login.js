document.addEventListener('DOMContentLoaded', () => {
  // Elemen form dan tombol switch
  const loginContainer = document.getElementById('login-container');
  const registerContainer = document.getElementById('register-container');
  const showRegisterLink = document.getElementById('show-register');
  const showLoginLink = document.getElementById('show-login');

  // Tampilkan form daftar dan sembunyikan login
  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
  });

  // Tampilkan form login dan sembunyikan daftar
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
  });

  // Fungsi untuk mendapatkan data user dari localStorage
  function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  }

  // Fungsi untuk menyimpan user baru ke localStorage
  function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Fungsi cek apakah email sudah terdaftar
  function isEmailRegistered(email) {
    const users = getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Fungsi validasi login
  function validateLogin(email, password) {
    const users = getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
  }

  // Handle submit form register
  document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = this.name.value.trim();
    const email = this.email.value.trim();
    const password = this.password.value.trim();

    if (name === '' || email === '' || password === '') {
      await Swal.fire({
        icon: 'error',
        title: 'Pendaftaran Gagal',
        text: 'Semua kolom harus diisi.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
      return;
    }

    if (isEmailRegistered(email)) {
      await Swal.fire({
        icon: 'error',
        title: 'Email sudah terdaftar',
        text: 'Silakan gunakan email lain atau masuk ke akun Anda.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
      return;
    }

    // Simpan user baru
    saveUser({ name, email, password });

    await Swal.fire({
      icon: 'success',
      title: 'Pendaftaran Berhasil',
      text: `Selamat datang, ${name}! Silakan login.`,
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true
    });

    // Reset form dan tampilkan form login
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    this.reset();
  });

  // Handle submit form login
  document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value.trim();

    if (email === '' || password === '') {
      await Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Email dan password harus diisi.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
      return;
    }

    const user = validateLogin(email, password);

    if (user) {
      // Simpan status login dan data user ke localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: `Selamat datang kembali, ${user.name}!`,
        background: '#fff8f0',
        color: '#e67e22',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });

      // Redirect ke halaman utama
      window.location.href = 'index.html';
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: 'Email atau password salah.',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      });
    }
  });
});
