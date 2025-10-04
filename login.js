/* login.js */


// document.getElementById('login-form').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;

//   const response = await fetch('/api/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username, password })
//   });

//   const data = await response.json();
//   alert(data.message);
// });



document.addEventListener('DOMContentLoaded', function () {
    var typed = new Typed('#typed-text', {
        strings: [
            "به سامانه تبریزیم خوش آمدید!",
            "سامانه اختصاصی دانشگاه تبریز"
        ],
        typeSpeed: 100,
        backSpeed: 30,
        backDelay: 1000,
        startDelay: 500,
        loop: true,
        showCursor: true,
        cursorChar: ''
    });
});



// const form = document.getElementById('login-form');
// // console.log(form == null)
// const messageBox = document.getElementById('message');

// form.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const username = form.username.value;
//   const password = form.password.value;

//   const res = await fetch('http://localhost:3000/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username, password })
//   });

//   const data = await res.json();
  
  
// // strings

//   console.log(data.message)

//   if (data.message == 'Login successful') {
//     messageBox.textContent = 'ورود با موفقیت انجام شد!';
//     messageBox.style.color = 'green';
//     form.reset();
//   } else {
//     messageBox.textContent = data.message || 'خطایی رخ داد.';
//     messageBox.style.color = 'red';
//   }
// });








const form = document.getElementById("login-form");

form.addEventListener("submit", async function(e) {
  e.preventDefault(); // جلوگیری از refresh فرم

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("لطفا نام کاربری و رمز عبور را وارد کنید");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.message === "Login successful") {

      localStorage.setItem("username", username);

      // موفق → منتقل شود
      window.location.href = "entryPage.html";
    } else {
      // نام کاربری یا رمز عبور اشتباه
      alert("نام کاربری یا رمز عبور اشتباه است!");
    }
  } catch (err) {
    console.error(err);
    alert("خطا در ارتباط با سرور");
  }
});




function togglePassword(inputId, iconElement) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    iconElement.textContent = "🙈";
  } else {
    input.type = "password";
    iconElement.textContent = "👁️";
  }
}
