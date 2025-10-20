document.addEventListener("DOMContentLoaded", async () => {
    const usernameDisplay = document.getElementById("username-display");
    const currentPasswordDisplay = document.getElementById("current-password");
    const newPasswordInput = document.getElementById("new-password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const changePasswordBtn = document.getElementById("change-password-btn");
    const messageBox = document.getElementById("message");

    const username = localStorage.getItem("username");
    if (!username) {
        messageBox.textContent = "ابتدا وارد شوید (نام کاربری پیدا نشد)";
        messageBox.className = "error";
        return;
    }

    usernameDisplay.textContent = username;

    try {
        const res = await fetch(`http://localhost:3000/get-password/${username}`);
        const data = await res.json();
        if (res.ok && data.password) {
            currentPasswordDisplay.textContent = data.password;
        } else {
            currentPasswordDisplay.textContent = "خطا در دریافت رمز عبور";
        }
    } catch (err) {
        currentPasswordDisplay.textContent = "خطا در ارتباط با سرور";
    }

    changePasswordBtn.addEventListener("click", async () => {
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        if (!newPassword || !confirmPassword) {
            messageBox.textContent = "لطفا تمام فیلدها را پر کنید";
            messageBox.className = "error";
            return;
        }

        if (newPassword !== confirmPassword) {
            messageBox.textContent = "مقادیر وارد شده یکسان نیست! لطفا دوباره امتحان کنید.";
            messageBox.className = "error";
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/change-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, newPassword })
            });

            const data = await res.json();

            if (res.ok) {
                messageBox.textContent = "رمز عبور شما با موفقیت تغییر یافت";
                messageBox.className = "success";
                currentPasswordDisplay.textContent = newPassword;
                newPasswordInput.value = "";
                confirmPasswordInput.value = "";
            } else {
                messageBox.textContent = data.message || "خطا در تغییر رمز عبور";
                messageBox.className = "error";
            }
        } catch (err) {
            messageBox.textContent = "خطا در ارتباط با سرور";
            messageBox.className = "error";
        }
    });

    
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


const logoutBtn = document.getElementById("logout-btn");
const overlayLoader = document.getElementById("overlay-loader");

logoutBtn.addEventListener("click", () => {
  overlayLoader.style.display = "flex";
  localStorage.removeItem("username"); // حذف نام کاربری از حافظه
  setTimeout(() => {
    window.location.href = "signup.html";
  }, 2500);
});
