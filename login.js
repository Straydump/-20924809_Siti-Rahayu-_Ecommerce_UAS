document.addEventListener('DOMContentLoaded', () => {
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
  
    // Form register submit
    document.getElementById('register-form').addEventListener('submit', function(e) {
      e.preventDefault();
  
      const name = this.name.value.trim();
      const email = this.email.value.trim();
      const password = this.password.value.trim();
  
      if (name === '' || email === '' || password === '') {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: 'Semua kolom harus diisi.',
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        });
        return;
      }
  
      // Simpan data user ke localStorage (sederhana)
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userPassword', password); // Simpan password hanya untuk simulasi, jangan di produksi!
  
      Swal.fire({
        icon: 'success',
        title: 'Pendaftaran Berhasil',
        text: `Selamat datang, ${name}! Silakan login.`,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true
      }).then(() => {
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        this.reset();
      });
    });
  
    // Form login submit
    document.getElementById('login-form').addEventListener('submit', function(e) {
      e.preventDefault();
  
      const email = this.email.value.trim();
      const password = this.password.value.trim();
  
      if (email === '' || password === '') {
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: 'Email dan password harus diisi.',
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        });
        return;
      }
  
      // Ambil data user dari localStorage
      const storedEmail = localStorage.getItem('userEmail');
      const storedPassword = localStorage.getItem('userPassword');
      const storedName = localStorage.getItem('userName');
  
      // Validasi sederhana
      if (email === storedEmail && password === storedPassword) {
        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil',
          text: `Selamat datang kembali, ${storedName}!`,
          background: '#fff8f0',
          color: '#e67e22',
          timer: 1500,
          showConfirmButton: false,
          timerProgressBar: true
        }).then(() => {
          window.location.href = 'index.html'; // Ganti dengan halaman utama Anda
        });
      } else {
        Swal.fire({
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
  