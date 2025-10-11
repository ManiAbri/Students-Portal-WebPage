
let balance = 10000;
const foods = [
  { name: "چلوکباب", price: 20000 },
  { name: "قرمه سبزی", price: 20000 },
  { name: "زرشک پلو", price: 20000 },
];

let selectedFood = null;
let reservationList = [];

window.onload = () => {
  renderFoods();
  fetchReservationsFromDB();
};

function renderFoods() {
  const container = document.getElementById("foods");
  container.innerHTML = "";
  foods.forEach((food, index) => {
    const foodDiv = document.createElement("div");
    foodDiv.innerHTML = `${food.name}<br>${food.price} تومان`;
    foodDiv.classList.add("food-item");
    foodDiv.onclick = () => selectFood(index);
    container.appendChild(foodDiv);
  });
}

// function selectFood(index) {
//   selectedFood = foods[index];
//   const items = document.querySelectorAll(".foods div");
//   items.forEach((el, i) => el.style.border = i === index ? "2px solid red" : "1px solid #ddd");
// }


function selectFood(index) {
  selectedFood = foods[index];
  const items = document.querySelectorAll(".food-item");
  items.forEach((el, i) => el.classList.toggle("selected", i === index));
}


function increaseBalance() {
  balance += 10000;
  document.getElementById("balance").innerText = balance;
}

async function fetchReservationsFromDB() {
  const res = await fetch("http://localhost:3000/reservations");
  const data = await res.json();
  reservationList = data;
  renderReservations();
}

async function addReservation() {
  const date = document.getElementById("date").value;
  const restaurant = document.getElementById("restaurant").value;

  if (!date || !selectedFood) {
    alert("تاریخ و غذا را انتخاب کنید");
    return;
  }

  if (balance < selectedFood.price) {
    alert("موجودی کافی نیست!");
    return;
  }

  balance -= selectedFood.price;
  document.getElementById("balance").innerText = balance;

  const newReservation = {
    date,
    food: selectedFood.name,
    restaurant
  };

  const res = await fetch("http://localhost:3000/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newReservation)
  });

  const saved = await res.json();
  reservationList.push(saved);
  renderReservations();
}

function renderReservations() {
  const tbody = document.getElementById("reservationList");
  tbody.innerHTML = "";
  reservationList.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.date}</td>
      <td>${item.food}</td>
      <td>
        <button onclick="editReservation(${index})">ویرایش</button>
        <button onclick="deleteReservation(${index})">حذف</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteReservation(index) {
  const item = reservationList[index];
  const foodPrice = foods.find(f => f.name === item.food)?.price || 0;
  balance += foodPrice;
  document.getElementById("balance").innerText = balance;

  // حذف از دیتابیس
  await fetch(`http://localhost:3000/reservations/${item._id}`, {
    method: "DELETE"
  });

  reservationList.splice(index, 1);
  renderReservations();
}

// function editReservation(index) {
//   const item = reservationList[index];
//   document.getElementById("date").value = item.date;
//   selectedFood = foods.find(f => f.name === item.food);
//   renderFoods();
//   deleteReservation(index);
// }

let editingIndex = null; // برای نگه داشتن ایندکس رزرو که در حال ویرایش است

function editReservation(index) {
  const item = reservationList[index];
  document.getElementById("date").value = item.date;
  selectedFood = foods.find(f => f.name === item.food);
  document.getElementById("restaurant").value = item.restaurant;

  renderFoods(); // نمایش مجدد غذاها
  editingIndex = index; // ذخیره ایندکس رزرو که در حال ویرایش است
}

async function saveEditedReservation() {
  if (editingIndex === null) return; // اگر هیچ رزروی در حالت ویرایش نبود، خروج

  const date = document.getElementById("date").value;
  const restaurant = document.getElementById("restaurant").value;

  if (!date || !selectedFood) {
    alert("تاریخ و غذا را انتخاب کنید");
    return;
  }

  const updatedReservation = {
    date,
    food: selectedFood.name,
    restaurant
  };

  const id = reservationList[editingIndex]._id; // دریافت ID رزرو
  const res = await fetch(`http://localhost:3000/reservations/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedReservation)
  });

  const result = await res.json();
  if (result.success) {
    reservationList[editingIndex] = { ...updatedReservation, _id: id };
    renderReservations();
    editingIndex = null; // خروج از حالت ویرایش
  } else {
    alert("خطا در بروزرسانی رزرو!");
  }
}


