let allMovies = [];
let currentPage = 1;
const itemsPerPage = 10;
const showBtn = document.getElementById('BtShow');
const tableBody = document.getElementById('tableBody');
const statusMsg = document.getElementById('statusMsg');
const pagination = document.getElementById('pagination');
const loaderOverlay = document.getElementById('loader-overlay');
const url = "https://api.tvmaze.com/shows/30/episodes";

function hideSpinner(){
    loaderOverlay.style.display = 'none';
}

function showSpinner(){
    loaderOverlay.style.display = 'flex';
}

async function loadTable() {
    tableBody.innerHTML = '';
    statusMsg.textContent = 'Loading movies...';
    pagination.style.display = 'none';
    showSpinner();

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const resData = await response.json();
        allMovies = resData;
        currentPage = 1;

        if (allMovies.length === 0) {
            statusMsg.textContent = 'No movies found.';
            return;
        }

        statusMsg.textContent = '';
        displayPage(currentPage);
    } catch (error) {
        statusMsg.textContent = 'Error: Could not connect to the server.';
        console.error(error.message);
    } finally {
        hideSpinner();
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
                ${arrayItem.type || 'N/A'}
            </td>
            <td class='text-center'>${arrayItem.image?.medium ? `<img src='${arrayItem.image.medium}' alt='${arrayItem.name}' style='max-width: 300px;'>` : 'N/A'}</td>
            <td class='text-center'>
                ${arrayItem.airdate || 'N/A'}
            </td>
            <td class='text-center'>
                ${arrayItem.runtime ?? 'N/A'}
            </td>
            <td class='text-center'>
                ${arrayItem.rating?.average ?? 'N/A'}
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

showBtn.addEventListener('click', function(){
    loadTable();
});

document.getElementById('prevBtn').addEventListener('click', goToPreviousPage);
document.getElementById('nextBtn').addEventListener('click', goToNextPage);