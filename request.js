
let editingId = null; // اگر null بود یعنی داریم مورد جدید ثبت می‌کنیم


document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('requestForm');
  const requestList = document.getElementById('requestList');

  function loadRequests() {
    fetch('http://localhost:3000/requests')
      .then(res => res.json())
      .then(data => {
        requestList.innerHTML = ''; 
        data.forEach(addRequestToTable);
      });
  }

  function addRequestToTable(req) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td contenteditable="true">${req.title}</td>
      <td>${req.trackingNumber}</td>
      <td class="status" style="color: red;">${req.status}</td>
      <td>
        ${req.filePath ? `<a href="http://localhost:3000${req.filePath}" target="_blank">📂 مشاهده فایل</a>` : 'بدون فایل'}
      </td>
      <td>
        <button class="delete-btn">🗑️</button>
        <button class="edit-btn">✏️</button>
      </td>
    `;
    requestList.appendChild(row);

    row.querySelector('.delete-btn').addEventListener('click', () => {
      fetch(`http://localhost:3000/requests/${req._id}`, { method: 'DELETE' })
        .then(() => row.remove());
    });

    // row.querySelector('.edit-btn').addEventListener('click', () => {
    //   const newTitle = row.cells[0].innerText;
    //   fetch(`http://localhost:3000/requests/${req._id}`, {
    //     method: 'PUT',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ title: newTitle })
    //   }).then(() => alert('ویرایش شد'));
    // });
    row.querySelector('.edit-btn').addEventListener('click', () => {
    form.title.value = req.title;
    form.description.value = req.description;
    editingId = req._id; // شناسه برای ویرایش
    window.scrollTo(0, 0); // اسکرول به بالای صفحه برای نمایش فرم
});

  }

  // form.addEventListener('submit', (e) => {
  //   e.preventDefault();
    
  //   const formData = new FormData();
  //   const trackingNumber = 'REQ' + Math.floor(Math.random() * 10000);

  //   formData.append('title', form.title.value);
  //   formData.append('description', form.description.value);
  //   formData.append('trackingNumber', trackingNumber);
  //   formData.append('file', form.file.files[0]);

  //   fetch('http://localhost:3000/requests', {
  //     method: 'POST',
  //     body: formData
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       loadRequests(); // بعد از ثبت، کل لیست را دوباره بارگذاری کن
  //       form.reset();
  //     });
  // });

  form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', form.title.value);
  formData.append('description', form.description.value);

  const file = form.file.files[0];
  if (file) {
    formData.append('file', file);
  }

  // 👇 اگر در حال ویرایش هستیم
  if (editingId) {
    fetch(`http://localhost:3000/requests/${editingId}`, {
      method: 'PUT',
      body: formData
    })
      .then(() => {
        editingId = null;
        form.reset();
        loadRequests();
      });
  } else {
    // 👇 حالت ثبت جدید
    const trackingNumber = 'REQ' + Math.floor(Math.random() * 10000);
    formData.append('trackingNumber', trackingNumber);

    fetch('http://localhost:3000/requests', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        form.reset();
        loadRequests();
      });
  }
});


  loadRequests();
});