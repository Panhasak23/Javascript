let allMovies = [];
let currentPage = 1;
const itemsPerPage = 10;

function hideSpinner(){
    document.getElementById('loader-overlay').style.display = 'none';
}

function showSpinner(){
    document.getElementById('loader-overlay').style.display = 'flex';
}

async function loadTable() {
    showSpinner();
    const url = "https://api.tvmaze.com/shows/30/episodes";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const resData = await response.json();
        allMovies = resData;
        currentPage = 1;
        displayPage(currentPage);
        setTimeout(hideSpinner, 2000);
    } catch (error) {
        console.error(error.message);
        setTimeout(hideSpinner, 3000);
    }
}

function displayPage(pageNumber) {
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = allMovies.slice(startIndex, endIndex);
    
    LoadTableData(pageData);
    updatePaginationControls();
    document.getElementById('pagination').style.display = 'flex';
}

function LoadTableData(jsonData){
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    let i = 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    jsonData.forEach((arrayItem) => {
        i++;
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class='text-center'>${startIndex + i}</td>
            <td class='text-left'>${arrayItem.name}</td>
            <td class='text-center'>
                ${arrayItem.type}
            </td>
            <td class='text-center'><img src='${arrayItem.image.medium}' style='max-width: 300px;'></td>
            <td class='text-center'>
                ${arrayItem.airdate}
            </td>
            <td class='text-center'>
                ${arrayItem.runtime}
            </td>
            <td class='text-center'>
                ${arrayItem.rating.average}
            </td>
        `;
        tableBody.appendChild(newRow);
    });
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allMovies.length / itemsPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function goToPreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(allMovies.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
}

document.getElementById('BtShow').addEventListener('click', function(){
    loadTable();
});

document.getElementById('prevBtn').addEventListener('click', goToPreviousPage);
document.getElementById('nextBtn').addEventListener('click', goToNextPage);