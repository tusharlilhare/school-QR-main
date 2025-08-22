// Load student data and initialize the application
fetch('7th_student.json')
    .then(response => response.json())
    .then(data => {
        const students = data.students;
        generateIDCards(students);
        setupEventListeners();
        checkUrlForStudentData(students);
    })
    .catch(error => console.error('Error loading student data:', error));

/**
 * Generates ID cards for all students
 * @param {Array} students - Array of student objects
 */
function generateIDCards(students) {
    const cardsContainer = document.getElementById('cardsContainer');
    
    if (!cardsContainer) {
        console.error('Container element not found');
        return;
    }

    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded!');
        return;
    }

    students.forEach(student => {
        // Create front of ID card
        const frontCard = document.createElement('article');
        frontCard.className = 'id-card';
        frontCard.innerHTML = `
           

            <header class="school-card__header">
    <h1 class="school-name">${student.school.name}</h1>
    <div class="school-details">
        <p class="school-address">${student.school.address}</p>
                <p class="school-address">${student.school.addre}</p>
          <p class="school-number >Phone: ${student.school.contact.phone }</p>
        <p class="school-session">
       
            <span class="session-label">Session:</span>
            <span class="session-value">${student.school.session}</span>
        </p>
    </div>
</header>
            <section class="body-section">
                <div class="qr-code">
                    <div id="qr-${student.id}" class="qr-code-container"></div>
                    <p>Scholar No: ${student.school.codes.Scholar}</p>


                </div>
                <div class="photo">
                    <img 
                        src="${student.photo}" 
                        alt="Student Photo" 
                        onerror="this.src='https://via.placeholder.com/110x120?text=Photo+Not+Available'"
                    />
                </div>
                <div class="details">
                   <div>
    <div class="chairman-sign">
        <img src="/img/chairman_signature.jpg" alt="Chairman's Signature">
    </div>
    <div class="chairman-title">Chairman</div>
</div>
                    <h1 class="name"> <span> </span>${student.name.toUpperCase()}</h1>
                  <div class="info-list">
    <div class="info-item"><span>Class: </span> ${student.class}&nbsp;</div>
    <div class="info-item"><span>Father's Name: </span> ${student.father || 'N/A'}&nbsp;</div>
    <div class="Contact"><span>Contact: </span> ${student.contact}&nbsp;</div>
    <div class="info-item"><span>DOB: </span> ${student.dob}&nbsp;</div>
    <div class="info-item address"><span>Add:</span> ${student.address.replace(/,/g, ',')}&nbsp;</div>
</div>
                </div>
            </section>
        `;

        // Create back of ID card
        const backCard = document.createElement('article');
        backCard.className = 'id-card back';
        backCard.innerHTML = `
            <img src="${student.school.logo}" alt="School Logo" class="back-logo">
            <h2 class="back-title">${student.school.name}</h2>
                            <p>Dise Code: ${student.school.codes.udise}</p>
        
                       <img src="${student.school.building}" alt="School Logo" class="building">
            <div class="back-info">
                <p>${student.school.addres}</p>     
              

            </div>
            <div class="back-contact">
            
                <p>Email: ${student.school.contact.email}</p>
              
            </div>
        `;

        cardsContainer.appendChild(frontCard);
        cardsContainer.appendChild(backCard);

        generateQRCodeForStudent(student);
    });
}

/**
 * Generates QR code for a student
 * @param {Object} student - Student object
 */
function generateQRCodeForStudent(student) {
    const qrContainer = document.getElementById(`qr-${student.id}`);
    if (!qrContainer) return;

    const url = `${window.location.origin}${window.location.pathname}?id=${student.id}`;
    qrContainer.innerHTML = '';

    const wrapper = document.createElement('div');
wrapper.style.textAlign = 'center';
wrapper.style.paddingTop = '60px'; 
    new QRCode(qrContainer, {
        text: url,
        width: 90,
        height: 90,
        
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    qrContainer.addEventListener('click', () => {
        window.open(url, '_blank');
    });
}

/**
 * Displays student verification information
 * @param {Object} student - Student object to verify
 */
function showVerification(student) {
    // Activate verification tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-tab="verification"]').classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById('verification').classList.add('active');

    // Create photo HTML with fallback
    const photoHtml = `
        <div class="verification-photo">
            <div class="photo-container">
                <img src="${student.photo}" 
                     alt="${student.name}" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/200x250?text=Student+Photo'">
            </div>
            <div class="photo-meta">${student.name}'s Photo</div>
        </div>
    `;

    // Generate verification details HTML
    document.getElementById('verificationDetails').innerHTML = `
        ${photoHtml}
        <div class="detail-grid">
            <div class="detail-card">
                <h3><i class="fas fa-user-graduate"></i> Student Information</h3>
                <p><strong>Name:</strong> ${student.name}</p>
                <p><strong>Class:</strong> ${student.class}</p>
                <p><strong>Roll No:</strong> ${student.roll || 'N/A'}</p>
                <p><strong>Student ID:</strong> ${student.id}</p>
                <p><strong>Date of Birth:</strong> ${student.dob}</p>
                <p><strong>Contact:</strong> ${student.contact}</p>
                <p><strong>Address:</strong> ${student.address}</p>
            </div>
            
            <div class="detail-card">
                <h3><i class="fas fa-school"></i> School Information</h3>
                <p><strong>School Name:</strong> ${student.school.name}</p>
                <p><strong>Address:</strong> ${student.school.address}</p>
                <p><strong>Session:</strong> ${student.school.session}</p>

                <p><strong>Dise Code:</strong> ${student.school.codes.udise}</p>
            </div>
            
            <div class="detail-card">
                <h3><i class="fas fa-phone"></i> School Contact</h3>
                <p><strong>Phone:</strong> ${student.school.contact.phone}</p>
                <p><strong>Email:</strong> ${student.school.contact.email}</p>

            </div>
            
            <div class="detail-card">
                <h3><i class="fas fa-calendar-check"></i> Validity</h3>
                <p><strong>Valid Through:</strong> ${student.valid || '2027'}</p>
              
                <p><strong>Status:</strong> <span class="status-active">Active</span></p>
            </div>
        </div>
    `;

    document.getElementById('statusText').innerHTML = `
        <i class="fas fa-check-circle"></i> ID Verified Successfully!
        <small>Verified on ${new Date().toLocaleDateString()}</small>
    `;
}
    // Rest of your function...

/**
 * Sets up event listeners for UI interactions
 */
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Download button
    document.getElementById('downloadAll')?.addEventListener('click', () => {
        alert('Export feature will be implemented soon');
    });
}

/**
 * Checks URL for student ID parameter and shows verification if found
 * @param {Array} students - Array of student objects
 */
function checkUrlForStudentData(students) {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get('id');
    
    if (studentId) {
        const student = students.find(s => s.id === studentId);
        if (student) {
            showVerification(student);
            // Scroll to verification section
            setTimeout(() => {
                document.getElementById('verification').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            document.getElementById('statusText').innerHTML = `
                <i class="fas fa-times-circle"></i> Invalid Student ID
                <small>No student found with ID: ${studentId}</small>
            `;
        }
    }
}

// ✅ Download All ID Cards as PDF (same as shown on webpage, same size, multiple cards per page)
document.getElementById('downloadAll')?.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const wrappers = document.querySelectorAll('.id-card-wrapper');

    if (wrappers.length === 0) {
        alert("No ID cards found to download.");
        return;
    }

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",      // use pixel for exact same size
        format: "a4"
    });

    for (let i = 0; i < wrappers.length; i++) {
        const wrapper = wrappers[i];

        // Convert wrapper (front+back together) to canvas
        const canvas = await html2canvas(wrapper, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // Get wrapper size
        const wrapperWidth = canvas.width;
        const wrapperHeight = canvas.height;

        // Add image at natural size (same as on screen)
        pdf.addImage(imgData, "PNG", 20, 20, wrapperWidth / 2, wrapperHeight / 2);

        if (i < wrappers.length - 1) {
            pdf.addPage();
        }
    }

    pdf.save("Student_ID_Cards.pdf");
});
