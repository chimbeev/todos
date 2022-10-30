// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMYqgxpGQcIbhL5hXd4jiHePZlK4mcBCU",
    authDomain: "todos-85650.firebaseapp.com",
    projectId: "todos-85650",
    storageBucket: "todos-85650.appspot.com",
    messagingSenderId: "1050048543252",
    appId: "1:1050048543252:web:856b7eaba6542456038501",
    databaseURL: "https://todos-85650-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Initialize Firebase
//Функция initializeApp выполняет подключение к серверному приложению Google Firebase
//В качестве параметра принимает обьект с параметрами подключения и возвращает обьект - серверное приложение
//Экспортируем его из модуля
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;