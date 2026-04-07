loadTable();

function loadTable() {
    // Concatenate and Base64 encode the credentials
    let encodedCredentials = getCookie('session_token');
    const url = "http://10.12.1.50/api/course";

    fetch(url, {
        method: "get",
        headers: {
            'Authorization': `Basic ${encodedCredentials}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        //console.log(data);
        loadTableContent(data);
    })
    .catch(error => {
        console.log(`Fetch error: `, error.message);
    });
}

function loadTableContent(JSONDataList) {
    let myTable = document.getElementById('myTable').getElementsByTagName('tbody')[0];
    // Clear Data in Table
    myTable.innerHTML = '';
    let i = 0;

    JSONDataList.forEach(function (arrayItem) {
        i++;

        let row = myTable.insertRow();

        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        let cell4 = row.insertCell(3);
        let cell5 = row.insertCell(4);
        let cell6 = row.insertCell(5);
        let cell7 = row.insertCell(6);
        let cell8 = row.insertCell(7);

        cell1.setAttribute('align', 'center');
        cell1.innerHTML = i;
        cell2.setAttribute('align', 'left');
        cell2.innerHTML = arrayItem.CourseTypeName;
        cell3.innerHTML = '<div>' + arrayItem.CourseName + '</div>';
        cell4.setAttribute('class', 'text-center');
        cell4.innerHTML = arrayItem.HourAmount;

        let CreateDate = new Date(arrayItem.CreateDate);
        cell5.setAttribute('class', 'text-center');
        cell5.innerHTML = CreateDate.toLocaleDateString('en-GB');

        cell6.setAttribute('class', 'text-center');
        if (arrayItem.EnableStatus === true) {
            cell6.innerHTML = "<button type='button' class='btn btn-success btn-xs' onclick='OnOff_Fn(" + arrayItem.CourseId + ")'>On</button>";
        }
        else {
            cell6.innerHTML = "<button type='button' class='btn btn-danger btn-xs' onclick='OnOff_Fn(" + arrayItem.CourseId + ")'>Off</button>";
        }

        cell7.setAttribute('class', 'text-center');
        cell7.innerHTML = "<button type='button' class='btn btn-danger btn-xs' onclick='Delete_Fn(" + arrayItem.CourseId + ")'>Delete</button>";

        cell8.setAttribute('class', 'text-center');
        cell8.innerHTML = "<button type='button' class='btn btn-success btn-xs' onclick='Edit_Fn(" + arrayItem.CourseId + ")'>Edit</button>";
    });
}

function OnOff_Fn(CourseId) {
    // transfer id value to OnOffYes Button
    document.getElementById('OnOffYes').value = CourseId;
    const myModal = new bootstrap.Modal(document.getElementById('OnOffModal'));
    myModal.show();
}

function OnOffYes_Fn() {
    let val = document.getElementById('OnOffYes').value;
    let encodedCredentials = getCookie('session_token');
    const url = 'http://10.12.1.50/api/course';
    let Parameters = {
        Id: val
    };

    fetch(buildUrl(url, Parameters), {
        method: 'put',
        headers: {
            'Authorization': `Basic ${encodedCredentials}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data !== '') {
            alert(data);
        }
        loadTable();
    })
    .catch(error => {
        console.log(`Fetch error: `, error.message);
    });
}

function Delete_Fn(CourseId) {
    // transfer id value to Delete Button
    document.getElementById('DeleteYes').value = CourseId;
    const myModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    myModal.show();
}

function DeleteYes_Fn() {
    let val = document.getElementById('DeleteYes').value;
    let encodedCredentials = getCookie('session_token');
    const url = 'http://10.12.1.50/api/course';
    let Parameters = {
        Id: val
    };

    fetch(buildUrl(url, Parameters), {
        method: 'delete',
        headers: {
            'Authorization': `Basic ${encodedCredentials}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data !== '') {
            alert(data);
        }
        loadTable();
    })
    .catch(error => {
        console.log(`Fetch error: `, error.message);
    });
}

function Edit_Fn(CourseId) {
    alert(CourseId);
}
