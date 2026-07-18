
let url = document.getElementById("desc").getAttribute("url");

fetch(url)
        .then(response => response.json())
        .then(data => {
            // Call function to display table
            createTable(data.description);
        })
        .catch(error => console.error('Error:', error));

function createTable(data) {
    const table = document.createElement('table');
    table.classList.add('open');
    const colGroup = document.createElement('colgroup');

    const col_a = document.createElement('col');
    col_a.setAttribute('span', '1');
    col_a.setAttribute('style', 'width: 85%;');

    const tableBody = document.createElement('tbody');

    // Append the table head and body to table
    table.appendChild(colGroup);
    colGroup.appendChild(col_a);
    table.appendChild(tableBody);

    // Creating table body
    data.forEach(item => {
        let row = tableBody.insertRow();
        Object.values(item).forEach(value => {
        let cell = row.insertCell();
        cell.classList.add('open');
        // noinspection JSValidateTypes
        cell.innerHTML = value;
        });
    });

    // Append the table to the HTML document
    document.getElementById('desc').appendChild(table);
}
