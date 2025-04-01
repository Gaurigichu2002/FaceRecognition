import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHRqAoJ7Xobf3lNwwzLmf0Y2G3TyglwDw",
  authDomain: "project-92c91.firebaseapp.com",
  projectId: "project-92c91",
  storageBucket: "project-92c91.appspot.com",
  messagingSenderId: "314283381970",
  appId: "1:314283381970:web:f110e526bfbe352eabc90b",
  measurementId: "G-H2BMNGXC6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ✅ Function to upload image and return its URL
async function uploadImage(photoFile, userUid) {
  try {
    console.log("Uploading photo...");
    const photoRef = ref(storage, `user_photos/${userUid}`);
    await uploadBytes(photoRef, photoFile);
    const photoURL = await getDownloadURL(photoRef);
    console.log("Photo uploaded:", photoURL);
    return photoURL; // ✅ Return the photoURL
  } catch (error) {
    console.error("Upload Error:", error);
    Swal.fire("Error!", "Image upload failed. Try again.", "error");
    return null;
  }
}

// ✅ Function to handle sign-up
async function signUpUser(event) {
  event.preventDefault();

  const name = document.querySelector('.sign-up input[name="name"]').value;
  const branch = document.querySelector('.sign-up input[name="branch"]').value;
  const number = document.querySelector('.sign-up input[name="number"]').value;
  const email = document.querySelector('.sign-up input[name="eemail"]').value;
  const password = document.querySelector('.sign-up input[name="ppwd"]').value;
  const photoFile = document.getElementById('photoInput').files[0];

  if (name && branch && number && email && password && photoFile) {
    try {
      // ✅ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created:", user);

      // ✅ Upload Image and get URL
      const photoURL = await uploadImage(photoFile, user.uid);
      if (!photoURL) {
        throw new Error("Failed to upload image");
      }

      // ✅ Store user data in Firestore
      console.log("Storing user data in Firestore...");
      await setDoc(doc(db, "students", user.uid), {
        name: name,
        branch: branch,
        number: number,
        email: email,
        photoURL: photoURL // ✅ Store photoURL correctly
      });

      console.log("User data stored successfully in Firestore!");
      Swal.fire("Success!", "User registered successfully!", "success");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error!", error.message, "error");
    }
  } else {
    Swal.fire("Error!", "Please fill all fields.", "error");
  }
}

// ✅ Function to handle login
async function loginUser(event) {
  event.preventDefault();

  const email = document.querySelector('.login input[name="email"]').value;
  const password = document.querySelector('.login input[name="pwd"]').value;

  if (email && password) {
    try {
      // ✅ Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Swal.fire("Success!", "Login successful!", "success").then(() => {
        window.location.href = "student.html"; // ✅ Redirect to student dashboard
      });
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
      console.error("Error logging in: ", error);
    }
  } else {
    Swal.fire("Error!", "Please fill all fields.", "error");
  }
}

// ✅ Attach event listeners
document.querySelector('.sign-up button').addEventListener("click", signUpUser);
document.querySelector('.login button').addEventListener("click", loginUser);
