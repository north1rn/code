
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAd4nWLEz-WkOQBHPoTRLijC7niSKO1R6E",
  authDomain: "code-1002a.firebaseapp.com",
  databaseURL: "https://code-1002a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "code-1002a",
  storageBucket: "code-1002a.firebasestorage.app",
  messagingSenderId: "432475893112",
  appId: "1:432475893112:web:7d61952fe29c50081e2c8d",
  measurementId: "G-71XZK3EJ9M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Функция для добавления времени
function addTime() {
    const timeInput = document.getElementById("timeInput").value;
    if (!timeInput) {
        alert("Пожалуйста, введите время.");
        return;
    }

    let [hours, minutes] = timeInput.split(":").map(Number);
    
    // Устанавливаем время окончания (текущее время + 37 минут)
    const endTime = new Date();
    endTime.setHours(hours, minutes + 37, 0);
    
    // Форматируем время
    const formattedTime = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`;
    document.getElementById("timeResult").textContent = `Заспавнится в: ${formattedTime}`;

    // Сохраняем в Realtime Database
    const newRequestRef = db.ref('requests').push();
    newRequestRef.set({
        originalTime: timeInput,
        endTime: formattedTime
    });

    // Добавляем в список отображаемых запросов
    updateRequestList();
}

// Функция для обновления списка запросов
function updateRequestList() {
    const requestList = document.getElementById('requestList');
    requestList.innerHTML = '';

    // Получаем данные из Realtime Database
    db.ref('requests').once('value').then(snapshot => {
        const requests = snapshot.val();
        for (let id in requests) {
            const request = requests[id];
            const li = document.createElement('li');
            li.textContent = `${request.originalTime} -> ${request.endTime}`;
            requestList.appendChild(li);
        }
    });
}

// Отслеживаем изменения в реальном времени
db.ref('requests').on('child_added', function(snapshot) {
    const request = snapshot.val();
    const li = document.createElement('li');
    li.textContent = `${request.originalTime} -> ${request.endTime}`;
    document.getElementById('requestList').appendChild(li);
});
