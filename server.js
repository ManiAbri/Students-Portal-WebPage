
// ---------------------------------- setup --------------------------------------
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3000;
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const uri = "mongodb://127.0.0.1:27017"; // اتصال به دیتابیس محلی
let reservationsCollection, usersCollection, requestsCollection;

// اتصال به MongoDB
MongoClient.connect(uri)
  .then((client) => {
    // هر بخش دیتابیس جداگانه
    const dbFood = client.db("foodReserveDB");
    const dbAuth = client.db("authapp");
    const dbUni = client.db("uni");

    reservationsCollection = dbFood.collection("reservations"); // food reserve
    usersCollection = dbAuth.collection("users"); // signup/login
    requestsCollection = dbUni.collection("requests"); // requests

    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------------------------------- food reserve --------------------------------------
app.get("/reservations", async (req, res) => {
  const data = await reservationsCollection.find().toArray();
  res.json(data);
});

app.post("/reservations", async (req, res) => {
  const result = await reservationsCollection.insertOne(req.body);
  res.json({ ...req.body, _id: result.insertedId });
});

app.delete("/reservations/:id", async (req, res) => {
  const id = req.params.id;
  await reservationsCollection.deleteOne({ _id: new ObjectId(id) });
  res.json({ success: true });
});

app.put("/reservations/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    await reservationsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "خطا در بروزرسانی رزرو" });
  }
});

// ---------------------------------- signup & login --------------------------------------
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await usersCollection.findOne({ username });
    if (existing) {
      return res.json({ message: "User already exists" });
    }
    await usersCollection.insertOne({ username, password });
    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during signup" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await usersCollection.findOne({ username, password });
    if (user) {
      return res.json({ message: "Login successful" });
    }
    res.json({ message: "Invalid credentials" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during login" });
  }
});

// ---------------------------------- requests part --------------------------------------
app.get("/requests", async (req, res) => {
  try {
    const requests = await requestsCollection.find().toArray();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "مشکل در دریافت اطلاعات" });
  }
});

app.post("/requests", upload.single("file"), async (req, res) => {
  try {
    const { title, trackingNumber, description } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : "";
    const newRequest = {
      title,
      trackingNumber,
      description,
      filePath,
      status: "بررسی نشده",
    };

    const result = await requestsCollection.insertOne(newRequest);
    res.json({ ...newRequest, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "مشکل در ذخیره اطلاعات" });
  }
});

app.delete("/requests/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await requestsCollection.deleteOne({ _id: new ObjectId(id) });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "مشکل در حذف درخواست" });
  }
});

app.put("/requests/:id/title", async (req, res) => {
  try {
    const id = req.params.id;
    const { title } = req.body;
    await requestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "مشکل در ویرایش درخواست" });
  }
});

app.put("/requests/:id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    const updateFields = { title, description };

    if (req.file) {
      updateFields.filePath = `/uploads/${req.file.filename}`;
    }

    await requestsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: "مشکل در ویرایش درخواست" });
  }
});






// ------------------- Profile: Get Password by Username -------------------
app.get("/get-password/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "کاربر یافت نشد" });
        }

        res.json({ password: user.password });
    } catch (err) {
        res.status(500).json({ message: "خطا در دریافت رمز عبور" });
    }
});

// ------------------- Profile: Change Password -------------------
app.put("/change-password", async (req, res) => {
    try {
        const { username, newPassword } = req.body;
        const result = await usersCollection.updateOne(
            { username },
            { $set: { password: newPassword } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "کاربر یافت نشد یا تغییر رمز عبور انجام نشد" });
        }

        res.json({ message: "رمز عبور شما با موفقیت تغییر یافت" });
    } catch (err) {
        res.status(500).json({ message: "خطا در تغییر رمز عبور" });
    }
});
