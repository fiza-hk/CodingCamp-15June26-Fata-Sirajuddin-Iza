/* 1. INISIALISASI & ELEMEN DOM */
// Elemen Tema
const themeToggleBtn = document.getElementById('theme-toggle');

// Elemen Waktu & Nama
const clockDisplay = document.getElementById('digital-clock');
const dateDisplay = document.getElementById('current-date');
const greetingText = document.getElementById('time-greeting');
const userNameText = document.getElementById('user-name');

// Elemen Timer
const timerDisplay = document.getElementById('timer-display');
const timerDurationInput = document.getElementById('timer-duration');
const startTimerBtn = document.getElementById('start-timer');
const stopTimerBtn = document.getElementById('stop-timer');
const resetTimerBtn = document.getElementById('reset-timer');

// Elemen To-Do List
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// Elemen Quick Links
const linksForm = document.getElementById('links-form');
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const linksContainer = document.getElementById('links-container');

// State Data Global
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let links = JSON.parse(localStorage.getItem('links')) || [];

/* 2. FITUR TEMA (LIGHT/DARK MODE) & NAMA (CUSTOM NAME) */
// Memuat tema tersimpan
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = 'Mode Terang';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.textContent = 'Mode Terang';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggleBtn.textContent = 'Mode Gelap';
    }
});

// Memuat nama tersimpan
const savedName = localStorage.getItem('userName');
if (savedName) userNameText.textContent = savedName;

// Menyimpan nama setiap kali pengguna selesai mengetik
userNameText.addEventListener('blur', () => {
    localStorage.setItem('userName', userNameText.textContent);
});

// Mencegah enter membuat baris baru pada nama
userNameText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        userNameText.blur();
    }
});

/* 3. FITUR JAM, TANGGAL & UCAPAN */
function updateClock() {
    const now = new Date();
    
    // Format Jam
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Format Tanggal
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('id-ID', options);
    
    // Format Ucapan Berdasarkan Waktu
    let currentHour = now.getHours();
    if (currentHour < 11) {
        greetingText.textContent = 'Selamat Pagi';
    } else if (currentHour < 15) {
        greetingText.textContent = 'Selamat Siang';
    } else if (currentHour < 19) {
        greetingText.textContent = 'Selamat Sore';
    } else {
        greetingText.textContent = 'Selamat Malam';
    }
}
setInterval(updateClock, 1000);
updateClock(); // Jalankan sekali saat dimuat

/* 4. FITUR FOCUS TIMER */
let timerInterval;
let timeLeft = parseInt(timerDurationInput.value) * 60;
let isTimerRunning = false;

function updateTimerDisplay() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Update timer jika input durasi diubah
timerDurationInput.addEventListener('change', () => {
    if (!isTimerRunning) {
        timeLeft = parseInt(timerDurationInput.value) * 60;
        updateTimerDisplay();
    }
});

startTimerBtn.addEventListener('click', () => {
    if (!isTimerRunning && timeLeft > 0) {
        isTimerRunning = true;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                alert("Waktu fokus telah selesai!");
            }
        }, 1000);
    }
});

stopTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
});

resetTimerBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = parseInt(timerDurationInput.value) * 60;
    updateTimerDisplay();
});

/* 5. FITUR TO-DO LIST */
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    todoList.innerHTML = '';
    tasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="todo-left">
                <input type="checkbox" onchange="toggleTask(${task.id})" ${task.completed ? 'checked' : ''}>
                <span class="todo-text">${task.text}</span>
            </div>
            <div>
                <button class="btn-secondary btn-delete-task" onclick="editTask(${task.id})">Edit</button>
                <button class="btn-danger btn-delete-task" onclick="deleteTask(${task.id})">Hapus</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// Tambah Tugas
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (text !== '') {
        tasks.push({ id: Date.now(), text: text, completed: false });
        todoInput.value = '';
        saveTasks();
        renderTasks();
    }
});

// Centang/Selesai Tugas (Global Function)
window.toggleTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
};

// Edit Tugas (Global Function - Wajib MVP)
window.editTask = function(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt("Edit tugas:", task.text);
        if (newText !== null && newText.trim() !== "") {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
};

// Hapus Tugas (Global Function)
window.deleteTask = function(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
};

/* 6. FITUR QUICK LINKS */
function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach((link) => {
        const linkEl = document.createElement('a');
        linkEl.href = link.url;
        linkEl.target = '_blank';
        linkEl.className = 'link-chip';
        
        linkEl.innerHTML = `
            ${link.name} 
            <button class="btn-delete-link" onclick="deleteLink(event, ${link.id})">✖</button>
        `;
        linksContainer.appendChild(linkEl);
    });
}

// Tambah Link Baru
linksForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();
    
    // Pastikan URL valid memiliki format http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    if (name !== '' && url !== '') {
        links.push({ id: Date.now(), name: name, url: url });
        linkNameInput.value = '';
        linkUrlInput.value = '';
        saveLinks();
        renderLinks();
    }
});

// Hapus Link (Global Function)
window.deleteLink = function(event, id) {
    event.preventDefault(); // Mencegah browser membuka tautan saat tombol hapus diklik
    links = links.filter(l => l.id !== id);
    saveLinks();
    renderLinks();
};

/* 7. INISIALISASI AWAL SAAT HALAMAN DIMUAT */
renderTasks();
renderLinks();
updateTimerDisplay();