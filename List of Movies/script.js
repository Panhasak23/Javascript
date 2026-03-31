function hideSpinner(){
    document.getElementById('loader-overlay').style.display = 'none';
}

function showSpinner(){
    document.getElementById('loader-overlay').style.display = 'flex';
}

async function loadTable() {
    showSpinner();
    const url = "http://api.tvmaze.com/shows/30/episodes";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const resData = await response.json();
        LoadTableData(resData);
        setTimeout(hideSpinner, 2000);
    } catch (error) {
        console.error(error.message);
        setTimeout(hideSpinner, 3000);
    }
}

function LoadTableData(jsonData){
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    let i = 0;
    
    jsonData.forEach((arrayItem) => {
        i++;
        let newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class='text-center'>${i}</td>
            <td class='text-left'>${arrayItem.name}</td>
            <td class='text-center'>
                ${arrayItem.type}
            </td>
            <td class='text-center'><img src='${arrayItem.image.medium}' style='max-width: 200px;'></td>
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

document.getElementById('BtShow').addEventListener('click', function(){
    loadTable();
});