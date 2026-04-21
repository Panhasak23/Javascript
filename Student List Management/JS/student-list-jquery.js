(function () {
    const recordsPerPage = 10;

    let students = [];
    let filteredStudents = [];
    let currentPage = 1;

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getTotalPages() {
        return Math.max(1, Math.ceil(filteredStudents.length / recordsPerPage));
    }

    function updateSearchInfo(term) {
        if (!term) {
            $('#searchInfo')
                .text(`Showing all ${students.length} students`)
                .removeClass('highlight');
            return;
        }

        $('#searchInfo')
            .text(`Found ${filteredStudents.length} student(s) matching \"${term}\"`)
            .addClass('highlight');
    }

    function renderPageNumbers(totalPages) {
        const $pageNumbers = $('#pageNumbers');
        $pageNumbers.empty();

        for (let page = 1; page <= totalPages; page++) {
            const isActive = page === currentPage ? ' active' : '';
            const button = `<button class=\"page-number-btn${isActive}\" data-page=\"${page}\">${page}</button>`;
            $pageNumbers.append(button);
        }
    }

    function updatePagination() {
        const totalPages = getTotalPages();

        if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        if (filteredStudents.length === 0) {
            $('#paginationInfo').text('No students found');
            $('#prevBtn').prop('disabled', true);
            $('#nextBtn').prop('disabled', true);
            $('#pageNumbers').empty();
            return;
        }

        const start = (currentPage - 1) * recordsPerPage + 1;
        const end = Math.min(currentPage * recordsPerPage, filteredStudents.length);

        $('#paginationInfo').text(`Showing ${start}-${end} of ${filteredStudents.length} students`);
        $('#prevBtn').prop('disabled', currentPage === 1);
        $('#nextBtn').prop('disabled', currentPage === totalPages);

        renderPageNumbers(totalPages);
    }

    function renderTable() {
        const $tbody = $('#studentTableBody');
        $tbody.empty();

        if (filteredStudents.length === 0) {
            $tbody.html(
                '<tr>' +
                    '<td colspan="9">' +
                        '<div class="no-results">' +
                            '<div class="no-results-icon">🔍</div>' +
                            '<div>No students found matching your search criteria.</div>' +
                        '</div>' +
                    '</td>' +
                '</tr>'
            );
            updatePagination();
            return;
        }

        const startIndex = (currentPage - 1) * recordsPerPage;
        const pageItems = filteredStudents.slice(startIndex, startIndex + recordsPerPage);

        pageItems.forEach((student, index) => {
            const fullName = `${student.last_name} ${student.first_name}`;
            const safeCode = escapeHtml(student.student_code);
            const rowNumber = startIndex + index + 1;

            const rowHtml =
                '<tr>' +
                    `<td>${rowNumber}</td>` +
                    `<td>${safeCode}</td>` +
                    `<td>${escapeHtml(fullName)}</td>` +
                    `<td>[${escapeHtml(student.gender)}]</td>` +
                    `<td>${escapeHtml(student.contact)}</td>` +
                    `<td>${escapeHtml(student.created_date)}</td>` +
                    '<td><button class="btn btn-onoff js-toggle-status" data-code="' + safeCode + '">On/Off</button></td>' +
                    '<td><button class="btn btn-delete js-delete-student" data-code="' + safeCode + '">Delete</button></td>' +
                    '<td><button class="btn btn-edit js-edit-student" data-code="' + safeCode + '">Edit</button></td>' +
                '</tr>';

            $tbody.append(rowHtml);
        });

        updatePagination();
    }

    function applyFilter() {
        const term = $('#searchInput').val().toString().trim().toLowerCase();

        if (!term) {
            filteredStudents = students.slice();
            currentPage = 1;
            updateSearchInfo('');
            renderTable();
            return;
        }

        filteredStudents = students.filter((student) => {
            const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();

            return (
                fullName.includes(term) ||
                student.student_code.toLowerCase().includes(term) ||
                student.contact.toLowerCase().includes(term) ||
                student.gender.toLowerCase().includes(term)
            );
        });

        currentPage = 1;
        updateSearchInfo($('#searchInput').val().toString().trim());
        renderTable();
    }

    function getStudentByCode(code) {
        return students.find((student) => student.student_code === code);
    }

    function bindEvents() {
        $('#searchBtn').on('click', applyFilter);

        $('#clearBtn').on('click', function () {
            $('#searchInput').val('');
            applyFilter();
            $('#searchInput').trigger('focus');
        });

        $('#searchInput').on('keypress', function (event) {
            if (event.key === 'Enter') {
                applyFilter();
            }
        });

        $('#searchInput').on('input', applyFilter);

        $('#prevBtn').on('click', function () {
            if (currentPage > 1) {
                currentPage -= 1;
                renderTable();
            }
        });

        $('#nextBtn').on('click', function () {
            if (currentPage < getTotalPages()) {
                currentPage += 1;
                renderTable();
            }
        });

        $('#pageNumbers').on('click', '.page-number-btn', function () {
            const page = Number($(this).data('page'));
            if (!Number.isNaN(page)) {
                currentPage = page;
                renderTable();
            }
        });

        $('#studentTableBody').on('click', '.js-toggle-status', function () {
            const $button = $(this);
            const previousText = $button.text();
            $button.text('Active').css('background-color', '#1b5e20');

            setTimeout(function () {
                $button.text(previousText).css('background-color', '');
            }, 1000);
        });

        $('#studentTableBody').on('click', '.js-delete-student', function () {
            const code = $(this).data('code').toString();
            const target = getStudentByCode(code);

            if (!target) {
                return;
            }

            const studentName = `${target.last_name} ${target.first_name}`;
            if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) {
                return;
            }

            students = students.filter((student) => student.student_code !== code);
            filteredStudents = filteredStudents.filter((student) => student.student_code !== code);

            if (currentPage > getTotalPages()) {
                currentPage = getTotalPages();
            }

            renderTable();
            updateSearchInfo($('#searchInput').val().toString().trim());
        });

        $('#studentTableBody').on('click', '.js-edit-student', function () {
            const code = $(this).data('code').toString();
            const target = getStudentByCode(code);

            if (!target) {
                return;
            }

            const currentName = `${target.first_name} ${target.last_name}`;
            const newName = window.prompt('Enter new full name (First Last):', currentName);

            if (!newName || !newName.trim()) {
                return;
            }

            const nameParts = newName.trim().split(/\s+/);
            target.first_name = nameParts[0] || target.first_name;
            target.last_name = nameParts.slice(1).join(' ');
            renderTable();
        });
    }

    $(function () {
        const studentData = new Student();
        students = studentData.StudentList();
        filteredStudents = students.slice();

        bindEvents();
        updateSearchInfo('');
        renderTable();
    });
})();
