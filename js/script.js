document.addEventListener('DOMContentLoaded', function() {
    // Student data from database (will be fetched from PHP in real implementation)
    const studentsData = {
        'TK A1': [
            'Nasha', 'Annasya', 'Aisyah', 'Malihah', 'Shafira', 'Zyana', 'Shanza', 'Emran', 
            'Esrshad', 'Rafa', 'Saki', 'Haikal', 'Aby', 'Kahfi', 'Haqqi', 'Arshaka'
        ],
        'TK A2': [
            'Eyza', 'Arshiyla', 'Azril', 'Fakhri', 'Khodie', 'Selina', 'Aresha', 'Jene', 
            'Zafran', 'Zahir', 'Zachry', 'Barra', 'Khawla', 'Arzan', 'Milka', 'Razzaz'
        ],
        'TK A3': [
            'Tisha', 'Alma', 'Marzia', 'Devy', 'Naurah', 'Aqilla', 'Arra', 'Aiza', 
            'Khai', 'Altezza', 'Den', 'Ibrahim', 'Cleo', 'Rakha', 'Razzaq', 'Rajasa'
        ],
        'TK A4': [
            'Abian', 'Zhea', 'Luffy', 'Nindya', 'Dewi', 'Kalandra', 'Ghazi', 'Azka', 
            'Zaim', 'Pradana', 'Rasya', 'Rania', 'Rifa', 'Luna', 'Hanif'
        ],
        'TK B1': [
            'Shanum', 'Khaula', 'Naima', 'Fatih', 'Alesha', 'Zidan', 'Kala', 'Asha', 
            'Humaira', 'Malik', 'Mikayla', 'Arlo', 'Nuno', 'Annisa', 'Birru', 'Shafiyya', 
            'Ghazi', 'Ruma', 'Aghnia'
        ],
        'TK B2': [
            'Fawwas', 'Rashad', 'Bima', 'Alula', 'Rania', 'Keina', 'Arrumi', 'Sheeqa', 
            'Eza', 'Yumma', 'Regn', 'Hasna', 'Rafa', 'Uwais', 'Ghania', 'Shafiqa', 
            'Fidan', 'Athan', 'Aqmar'
        ],
        'TK B3': [
            'Keira', 'Khayla', 'Raffasya', 'Kallula', 'Filla', 'Ibna', 'Hamish', 'Umair', 
            'Ainaaz', 'Aftar', 'Bia', 'Ahnaf', 'Haza', 'Allea', 'Athaya', 'Ersya', 'Zain'
        ],
        'TK B4': [
            'Raffa', 'Alesha', 'Raiqa', 'Kirana', 'Sultan', 'Arrasya', 'Shakila', 'Maleeq', 
            'Nino', 'Albirru', 'Mayla', 'Zia', 'Azka', 'Qirani', 'Naila', 'Ben', 'Keyko', 'Ayesha'
        ],
        'KB B1': [
            'Keenan', 'Sakha', 'Abimayu', 'Hizam', 'Ezhar', 'Gyan', 'Syanum', 'Hadid', 
            'Rumaisha', 'Kareem', 'Tarrak', 'Aisyah', 'Nabila'
        ],
        'KB B2': [
            'Eloise', 'Zahra', 'Renjana', 'Richie', 'Fatih', 'Razka', 'Shila', 'Ommar', 
            'Farel', 'Nadhira', 'Awan', 'Biru', 'Vino'
        ]
    };

    // Available seats by rows
    const availableSeats = {
        'D': Array.from({length: 28}, (_, i) => `D${i+1}`),
        'E': Array.from({length: 30}, (_, i) => `E${i+1}`),
        'F': Array.from({length: 30}, (_, i) => `F${i+1}`),
        'G': Array.from({length: 32}, (_, i) => `G${i+1}`),
        'H': Array.from({length: 32}, (_, i) => `H${i+1}`),
        'I': Array.from({length: 32}, (_, i) => `I${i+1}`),
        'J': Array.from({length: 34}, (_, i) => `J${i+1}`),
        'K': Array.from({length: 34}, (_, i) => `K${i+1}`),
        'L': Array.from({length: 36}, (_, i) => `L${i+1}`)
    };

    // Student attendance and seat allocation
    let attendanceList = [];
    let allocatedSeats = [];

    // DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    const classButtons = document.querySelectorAll('.class-btn');
    const studentSelectionModal = document.getElementById('studentSelectionModal');
    const seatNotificationModal = document.getElementById('seatNotificationModal');
    const closeModal = document.querySelector('.close');
    const studentsList = document.getElementById('studentsList');
    const seatNumber = document.getElementById('seatNumber');
    const closeNotification = document.getElementById('closeNotification');
    const attendanceListElement = document.getElementById('attendanceList');

    // Initialize by fetching existing attendance data from server
    fetchAttendanceData();

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.innerHTML = '';
        let resultsFound = false;

        Object.entries(studentsData).forEach(([className, students]) => {
            students.forEach(student => {
                if (student.toLowerCase().includes(searchTerm)) {
                    const resultItem = document.createElement('div');
                    resultItem.textContent = `${student} (${className})`;
                    resultItem.addEventListener('click', function() {
                        selectStudent(student, className);
                        searchInput.value = '';
                        searchResults.style.display = 'none';
                    });
                    searchResults.appendChild(resultItem);
                    resultsFound = true;
                }
            });
        });

        searchResults.style.display = resultsFound ? 'block' : 'none';
    });

    searchButton.addEventListener('click', function() {
        if (searchInput.value.trim().length >= 2) {
            searchResults.style.display = searchResults.style.display === 'block' ? 'none' : 'block';
        }
    });

    // Hide search results when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchButton.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Class buttons functionality
    classButtons.forEach(button => {
        button.addEventListener('click', function() {
            const className = this.getAttribute('data-class');
            openStudentSelection(className);
        });
    });

    // Close modal
    closeModal.addEventListener('click', function() {
        studentSelectionModal.style.display = 'none';
    });

    // Close notification
    closeNotification.addEventListener('click', function() {
        seatNotificationModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === studentSelectionModal) {
            studentSelectionModal.style.display = 'none';
        }
        if (event.target === seatNotificationModal) {
            seatNotificationModal.style.display = 'none';
        }
    });

    // Function to open student selection modal
    function openStudentSelection(className) {
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.textContent = `Pilih Nama Anak ${className}`;
        
        studentsList.innerHTML = '';
        
        studentsData[className].forEach(student => {
            // Skip already registered students
            if (isStudentRegistered(student, className)) {
                return;
            }
            
            const studentCard = document.createElement('div');
            studentCard.className = 'student-card';
            studentCard.textContent = student;
            studentCard.addEventListener('click', function() {
                selectStudent(student, className);
                studentSelectionModal.style.display = 'none';
            });
            
            studentsList.appendChild(studentCard);
        });
        
        studentSelectionModal.style.display = 'block';
        studentsList.classList.add('fadeIn');
    }

    // Function to check if a student is already registered
    function isStudentRegistered(name, className) {
        return attendanceList.some(item => item.name === name && item.class === className);
    }

    // Function to select a student and allocate seats
    function selectStudent(name, className) {
        // Check if student already registered
        if (isStudentRegistered(name, className)) {
            alert(`${name} sudah terdaftar dan memiliki nomor bangku!`);
            return;
        }

        // Get two random available seats
        const seats = allocateSeats();
        
        if (seats.length !== 2) {
            alert('Maaf, tidak cukup kursi tersedia!');
            return;
        }

        // Register student with seats
        const studentData = {
            name: name,
            class: className,
            seats: seats
        };

        // Save to database via AJAX
        saveAttendance(studentData);
    }

    // Function to allocate two adjacent seats starting from row D
    function allocateSeats() {
        const rows = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        let selectedSeats = [];

        for (let row of rows) {
            const availableSeatsInRow = availableSeats[row].filter(seat => !allocatedSeats.includes(seat));
            for (let i = 0; i < availableSeatsInRow.length - 1; i++) {
                if (parseInt(availableSeatsInRow[i].slice(1)) + 1 === parseInt(availableSeatsInRow[i + 1].slice(1))) {
                    selectedSeats.push(availableSeatsInRow[i], availableSeatsInRow[i + 1]);
                    allocatedSeats.push(availableSeatsInRow[i], availableSeatsInRow[i + 1]);
                    return selectedSeats;
                }
            }
        }

        return selectedSeats;
    }

    // Helper function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to save attendance data
    function saveAttendance(studentData) {
        // In a real implementation, this would be an AJAX call to the server
        // For now, we'll simulate a successful save
        
        // Add to local array
        attendanceList.push(studentData);
        
        // Update the UI
        updateAttendanceTable();
        showSeatNotification(studentData.seats);
        displaySeats(); // Update seat display

        // In real implementation, you would use AJAX:
        /*
        fetch('save_attendance.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                attendanceList.push(studentData);
                updateAttendanceTable();
                showSeatNotification(studentData.seats);
                displaySeats(); // Update seat display
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to save data. Please try again.');
        });
        */
    }

    // Function to show seat notification
    function showSeatNotification(seats) {
        seatNumber.textContent = seats.join(' & ');
        seatNotificationModal.style.display = 'block';
    }

    // Function to update the attendance table
    function updateAttendanceTable() {
        attendanceListElement.innerHTML = '';
        
        attendanceList.forEach(student => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = student.name;
            
            const classCell = document.createElement('td');
            classCell.textContent = student.class;
            
            const seatsCell = document.createElement('td');
            seatsCell.textContent = student.seats.join(' & ');
            
            row.appendChild(nameCell);
            row.appendChild(classCell);
            row.appendChild(seatsCell);
            
            attendanceListElement.appendChild(row);
        });
    }

    // Function to fetch attendance data from server
    function fetchAttendanceData() {
        // In a real implementation, this would be an AJAX call to the server
        // For now, we'll initialize with empty data
        
        // In real implementation, you would use AJAX:
        /*
        fetch('get_attendance.php')
        .then(response => response.json())
        .then(data => {
            attendanceList = data.attendance;
            allocatedSeats = [];
            
            // Extract all allocated seats
            attendanceList.forEach(student => {
                allocatedSeats.push(...student.seats);
            });
            
            updateAttendanceTable();
            displaySeats(); // Update seat display
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load attendance data.');
        });
        */
    }

    // Function to display seats and mark occupied ones
    function displaySeats() {
        const seatContainer = document.getElementById('seatContainer');
        seatContainer.innerHTML = '';

        Object.entries(availableSeats).forEach(([row, seats]) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'seat-row';

            seats.forEach(seat => {
                const seatElement = document.createElement('div');
                seatElement.className = 'seat';
                seatElement.innerText = seat;

                if (allocatedSeats.includes(seat)) {
                    seatElement.classList.add('occupied');
                }

                rowElement.appendChild(seatElement);
            });

            seatContainer.appendChild(rowElement);
        });
    }

    // Call displaySeats on page load or when needed
    document.addEventListener('DOMContentLoaded', function() {
        fetchAttendanceData();
        displaySeats();
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-section input');
    const searchButton = document.querySelector('.search-section button');
    const tableRows = document.querySelectorAll('table tr');

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase();
        let found = false;

        tableRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const nameCell = cells[0]; // Assuming the name is in the first column
                if (nameCell.textContent.toLowerCase().includes(query)) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.classList.add('highlight');
                    found = true;
                } else {
                    row.classList.remove('highlight');
                }
            }
        });

        if (!found) {
            alert('Name not found or seat already assigned.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const attendanceList = document.getElementById('attendanceList');

    // Fetch students from the backend
    fetch('/students')
        .then(response => response.json())
        .then(data => {
            data.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${student.nama_siswa}</td>
                    <td>${student.nomor_kursi}</td>
                `;
                attendanceList.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching students:', error));
});