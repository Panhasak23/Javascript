function loadTableContent(JSONDataList)
{
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

        cell1.setAttribute("align", "center");
        cell1.innerHTML = i;
        cell2.setAttribute("align", "left");
        cell2.innerHTML = arrayItem.CourseTypeName;
        cell3.innerHTML = "<div>" + arrayItem.CourseName + "</div>";
        cell4.setAttribute("class", "text-center");
        cell4.innerHTML = arrayItem.HourAmount;

        let CreateDate = new Date(arrayItem.CreateDate);
        cell5.setAttribute("class", "text-center");
        cell5.innerHTML = CreateDate.toLocaleDateString('en-GB');

        cell6.setAttribute("class", "text-center");
        if (arrayItem.EnableStatus === true) {
            cell6.innerHTML = "<button type='button' class='btn btn-success btn-xs' onclick='OnOff_Fn(" + arrayItem.CourseId + ")'>On</button>";
        }
        else {
            cell6.innerHTML = "<button type='button' class='btn btn-danger btn-xs' onclick='OnOff_Fn(" + arrayItem.CourseId + ")'>Off</button>";
        }

        cell7.setAttribute("class", "text-center");
        cell7.innerHTML = "<button type='button' class='btn btn-danger btn-xs' onclick='Delete_Fn(" + arrayItem.CourseId + ")'>Delete</button>";

        cell8.setAttribute("class", "text-center");
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
    //console.log("DeleteYes function at " + val);
    let encodedCredentials = getCookie('session_token');
    const url = "http://10.12.1.50/api/course";
    let Parameters = {
        Id: val
    };

    fetch(buildUrl(url, Parameters), {
        method: "put",
        //body: JSON.stringify(Parameters),
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
        // console.log(data);
        if (data !== "") {
            alert(data);
        }
        loadTable();
        //loadCourseTypeContent(data);
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
    //console.log("DeleteYes function at " + val);
    let encodedCredentials = getCookie('session_token');
    const url = "http://10.12.1.50/api/course";
    let Parameters = {
        Id: val
    };

    fetch(buildUrl(url, Parameters), {
        method: "delete",
        //body: JSON.stringify(Parameters),
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
        // console.log(data);
        if (data !== "") {
            alert(data);
        }
        loadTable();
        //loadCourseTypeContent(data);
    })
    .catch(error => {
        console.log(`Fetch error: `, error.message);
    });
}

function Edit_Fn(CourseId) {
    alert(CourseId);
}

const CourseName = document.getElementById('CourseName');
const Hour = document.getElementById('Hour');
loadCourseType();

function loadCourseType() {
    // Concatenate and Base64 encode the credentials
    let encodedCredentials = getCookie('session_token');
    const url = "http://10.12.1.50/api/coursetype";

    fetch(url, {
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
        // console.log(data);
        loadCourseTypeContent(data);
    })
    .catch(error => {
        console.log(`Fetch error: `, error.message);
    });
}

function loadCourseTypeContent(JSONDataList) {
    const selectElement = document.getElementById("CourseType");
    // const dataArray = ["Volvo", "Saab", "Mercedes", "Audi"];
    let optionsHTML = [];

    // Assign the whole string to innerHTML in a single operation
    selectElement.innerHTML += optionsHTML.join('\n');
    JSONDataList.forEach(function (arrayItem) {
        optionsHTML.push(`<option value="${arrayItem.CourseTypeId}">${arrayItem.CourseTypeName}</option>`);
    });
    selectElement.innerHTML += optionsHTML.join('\n');
}

function clearForm() {
    CourseName.value = '';
    setError(CourseName, 'Course name is required');
    //document.getElementById("CourseName").nextElementSibling.innerHTML='';

    Hour.value = '';
    setError(Hour, 'Hour is required');

    const selectElement = document.getElementById("CourseType");
    selectElement.selectedIndex = 0;
    selectElement.focus();
}

function createCourse() {
    if (validateInputs() === true) {
        // // Concatenate and Base64 encode the credentials
        let courseTypeId = document.getElementById('CourseType').value;
        let courseName = document.getElementById('CourseName').value;
        let hour = document.getElementById('Hour').value;

        let encodedCredentials = getCookie('session_token');
        const url = "http://10.12.1.50/api/course";
        let Parameters = {
            CourseTypeId: courseTypeId,
            CourseName: courseName,
            HourAmount: hour
        };

        fetch(buildUrl(url, Parameters), {
            method: "post",
            //body: JSON.stringify(Parameters),
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
            // console.log(data);
            if (data.slice(0, 12) === "Successfully") {
                clearForm();
            }
            document.getElementById('MsgArea').innerHTML = data;
            //loadCourseTypeContent(data);
        })
        .catch(error => {
            console.log(`Fetch error: `, error.message);
        });
    }
    else {
        document.getElementById("MsgArea").innerHTML = "Warning! Invalid input(s).";
    }
}

const validateInputs = () => {
    const CourseNameValue = CourseName.value.trim();
    const HourValue = Hour.value.trim();

    let Result = false;
    let V1 = false;
    let V2 = false;

    if (CourseNameValue === '') {
        setError(CourseName, 'Course name is required');
    } else if (CourseNameValue.length < 3) {
        setError(CourseName, 'Course name must be at least 3 character.');
    }
    else {
        setSuccess(CourseName);
        V1 = true;
    }

    if (HourValue === '') {
        setError(Hour, 'Hour is required');
    }
    else if (isPositiveNumberString(HourValue) !== true) {
        setError(Hour, 'Hour must be a positve value.');
    }
    else {
        setSuccess(Hour);
        V2 = true;
    }

    if (V1 === true && V2 === true) {
        Result = true;
    }
    return Result;
};

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

function isPositiveNumberString(str) {
    // Convert the string to a number. If conversion fails, it results in NaN.
    const num = Number(str);

    // Check if it's not NaN and is greater than 0
    return !isNaN(num) && num > 0;
}
