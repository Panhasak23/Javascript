/**
 * Main Application Script
 * Handles table rendering, search functionality, and user interactions.
 * Requires student-data.js to be loaded first.
 */

// Initialize the Student class and get the data
const studentData = new Student();
let students = studentData.StudentList();
let filteredStudents = [...students];

/**
 * Renders the student table based on the current data array.
 */
function renderTable() {
    const tableBody = document.getElementById('studentTableBody');
    
    // Check if table body exists (in case script runs on wrong page)
    if (!tableBody) {
        return;
    }
    
    tableBody.innerHTML = '';

    if (filteredStudents.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="no-results">
                        <div class="no-results-icon">🔍</div>
                        <div>No students found matching your search criteria.</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    filteredStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        
        // Format FullName as "LastName FirstName" to match the design image
        const fullName = `${student.last_name} ${student.first_name}`;
        
        // Format Gender with brackets to match [Sex] column
        const sexDisplay = `[${student.gender}]`;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.student_code}</td>
            <td>${fullName}</td>
            <td>${sexDisplay}</td>
            <td>${student.contact}</td>
            <td>${student.created_date}</td>
            <td>
                <button class="btn btn-onoff" onclick="toggleStatus(${index})">
                    On/Off
                </button>
            </td>
            <td>
                <button class="btn btn-delete" onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
            <td>
                <button class="btn btn-edit" onclick="editStudent(${index})">
                    Edit
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    updateSearchInfo();
}

/**
 * Updates the search information text
 */
function updateSearchInfo() {
    const searchInfo = document.getElementById('searchInfo');
    
    // Check if search info element exists
    if (!searchInfo) {
        return;
    }
    
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (searchTerm === '') {
        searchInfo.textContent = `Showing all ${students.length} students`;
        searchInfo.classList.remove('highlight');
    } else {
        searchInfo.textContent = `Found ${filteredStudents.length} student(s) matching "${searchTerm}"`;
        searchInfo.classList.add('highlight');
    }
}

/**
 * Filters students based on search term
 * @param {string} searchTerm - The term to search for
 */
function filterStudents(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        filteredStudents = [...students];
        renderTable();
        return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    filteredStudents = students.filter(student => {
        const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
        const studentCode = student.student_code.toLowerCase();
        const contact = student.contact.toLowerCase();
        const gender = student.gender.toLowerCase();
        
        return (
            fullName.includes(term) ||
            studentCode.includes(term) ||
            contact.includes(term) ||
            gender.includes(term)
        );
    });

    renderTable();
}

/**
 * Toggles the On/Off status visually for demonstration.
 * @param {number} index - The array index of the student.
 */
function toggleStatus(index) {
    const btn = event.target;
    const originalText = btn.textContent;
    
    // Visual feedback
    btn.textContent = 'Active';
    btn.style.backgroundColor = '#1b5e20';
    
    // Reset after 1 second
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = ''; // Revert to CSS default
    }, 1000);
}

/**
 * Deletes a student from the list after confirmation.
 * @param {number} index - The array index in filteredStudents.
 */
function deleteStudent(index) {
    const studentName = `${filteredStudents[index].last_name} ${filteredStudents[index].first_name}`;
    
    if (confirm(`Are you sure you want to delete ${studentName}?`)) {
        // Find the student in the original array and remove it
        const studentId = filteredStudents[index].id;
        students = students.filter(s => s.id !== studentId);
        filteredStudents = filteredStudents.filter(s => s.id !== studentId);
        renderTable();
    }
}

/**
 * Edits a student's name via prompt.
 * @param {number} index - The array index in filteredStudents.
 */
function editStudent(index) {
    const student = filteredStudents[index];
    const currentName = `${student.first_name} ${student.last_name}`;
    const newName = prompt('Enter new full name (First Last):', currentName);
    
    if (newName && newName.trim() !== '') {
        const names = newName.trim().split(' ');
        if (names.length >= 2) {
            student.first_name = names[0];
            student.last_name = names.slice(1).join(' ');
        } else {
            student.first_name = newName.trim();
            student.last_name = '';
        }
        renderTable();
    }
}

/**
 * Initializes the application when the DOM is fully loaded.
 */
function initApp() {
    renderTable();

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Check if search elements exist (in case script runs on wrong page)
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            filterStudents(searchInput.value);
        });
    }

    if (searchInput) {
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                filterStudents(searchInput.value);
            }
        });
    }

    if (clearBtn) {
        // Clear search
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            filterStudents('');
            searchInput.focus();
        });
    }
}

// Real-time search (optional - uncomment to enable)
const searchInputEl = document.getElementById('searchInput');
if (searchInputEl) {
    searchInputEl.addEventListener('input', function() {
        filterStudents(searchInputEl.value);
    });
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);