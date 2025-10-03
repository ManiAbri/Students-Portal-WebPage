// /* signup.js */
// document.getElementById('signup-form').addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;

//   const response = await fetch('/api/signup', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username, password })
//   });

//   const data = await response.json();
//   alert(data.message);
// });








// const form = document.getElementById('signup-form');
// console.log(form == null)
// const messageBox = document.getElementById('message');

// form.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const username = form.username.value;
//   const password = form.password.value;

//   const res = await fetch('http://localhost:3000/signup', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ username, password })
//   });

//   const data = await res.json();
//   console.log(data.message)
  
// // strings

//   if (data.message == 'Signup successful') {
//     messageBox.textContent = 'ثبت‌نام با موفقیت انجام شد!';
//     messageBox.style.color = 'green';
//     form.reset();
//   } else {
//     messageBox.textContent = data.message || 'خطایی رخ داد.';
//     messageBox.style.color = 'red';
//   }
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




const form = document.getElementById('signup-form');
const messageBox = document.getElementById('message');
const submitButton = form.querySelector('.submit'); // دکمه ثبت نام

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = form.username.value;
  const password = form.password.value;

  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.message === 'Signup successful') {

      localStorage.setItem("username", username);

      // تغییر رنگ و متن دکمه
      submitButton.style.backgroundColor = 'green';
      submitButton.value = 'ثبت نام موفق';
      messageBox.style.color = 'green';
      
      // بعد از 2 ثانیه انتقال به login.html
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);

    } else {
      submitButton.value = 'خطایی رخ داد.';
      messageBox.style.color = 'red';
      messageBox.textContent = data.message || 'خطایی رخ داد.';
      messageBox.style.color = 'red';
    }
  } catch (err) {
    console.error(err);
    messageBox.textContent = 'خطایی در ارتباط با سرور رخ داد.';
    messageBox.style.color = 'red';
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



