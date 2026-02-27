// Student List 3 Specific JavaScript

// Pagination variables
const recordsPerPage = 10;
let currentPage = 1;
let totalPages = 1;

// Override renderTable to add pagination
const originalRenderTable = renderTable;
renderTable = function() {
    const tableBody = document.getElementById('studentTableBody');
    
    if (!tableBody) {
        return;
    }
    
    tableBody.innerHTML = '';

    // Calculate pagination
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, filteredStudents.length);
    const pageStudents = filteredStudents.slice(startIndex, endIndex);

    if (pageStudents.length === 0) {
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
    }

    pageStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        const fullName = `${student.last_name} ${student.first_name}`;
        const sexDisplay = `[${student.gender}]`;
        const globalIndex = startIndex + index;

        row.innerHTML = `
            <td>${globalIndex + 1}</td>
            <td>${student.student_code}</td>
            <td>${fullName}</td>
            <td>${sexDisplay}</td>
            <td>${student.contact}</td>
            <td>${student.created_date}</td>
            <td>
                <button class="btn btn-onoff" onclick="toggleStatus(${globalIndex})">
                    On/Off
                </button>
            </td>
            <td>
                <button class="btn btn-delete" onclick="deleteStudent(${globalIndex})">
                    Delete
                </button>
            </td>
            <td>
                <button class="btn btn-edit" onclick="editStudent(${globalIndex})">
                    Edit
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });

    updatePagination();
};

// Update pagination controls
function updatePagination() {
    totalPages = Math.ceil(filteredStudents.length / recordsPerPage);
    
    const paginationInfo = document.getElementById('paginationInfo');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.getElementById('pageNumbers');

    if (!paginationInfo) return;

    const startIndex = (currentPage - 1) * recordsPerPage + 1;
    const endIndex = Math.min(currentPage * recordsPerPage, filteredStudents.length);
    
    if (filteredStudents.length === 0) {
        paginationInfo.textContent = 'No students found';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    paginationInfo.textContent = `Showing ${startIndex}-${endIndex} of ${filteredStudents.length} students`;

    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    // Update page numbers
    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'page-number-btn' + (i === currentPage ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.onclick = function() {
            goToPage(i);
        };
        pageNumbers.appendChild(pageBtn);
    }
}

// Go to specific page
function goToPage(page) {
    currentPage = page;
    renderTable();
}

// Override filterStudents to reset pagination
const originalFilterStudents = filterStudents;
filterStudents = function(searchTerm) {
    currentPage = 1;
    originalFilterStudents(searchTerm);
};

// Override deleteStudent to update pagination
const originalDeleteStudent = deleteStudent;
deleteStudent = function(index) {
    const studentName = `${filteredStudents[index].last_name} ${filteredStudents[index].first_name}`;
    
    if (confirm(`Are you sure you want to delete ${studentName}?`)) {
        const studentId = filteredStudents[index].id;
        students = students.filter(s => s.id !== studentId);
        filteredStudents = filteredStudents.filter(s => s.id !== studentId);
        
        // Adjust current page if needed
        const maxPage = Math.ceil(filteredStudents.length / recordsPerPage);
        if (currentPage > maxPage && maxPage > 0) {
            currentPage = maxPage;
        }
        
        renderTable();
    }
};

// Initialize pagination on DOM load
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
    }

    // Initial render
    renderTable();
});
