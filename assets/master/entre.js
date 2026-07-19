
fetch('/assets/master/entre.json')
        .then(response => response.json())
        .then(data => {
            // Call function to display table
            createTable(data.desc);
        })
        .catch(error => console.error('Error:', error));

function createTable(data) {
    const table = document.createElement('table');
    table.classList.add('entre');
    const colGroup = document.createElement('colgroup');

    const col_a = document.createElement('col');
    col_a.setAttribute('span', '1');
    col_a.setAttribute('style', 'width: 15.5%;');

    const col_b = document.createElement('col');
    col_b.setAttribute('span', '1');
    col_b.setAttribute('style', 'width: 15.5%;');

    const col_c = document.createElement('col');
    col_c.setAttribute('span', '1');
    col_c.setAttribute('style', 'width: 15.5%;');

    const col_e = document.createElement('col');
    col_e.setAttribute('span', '1');
    col_e.setAttribute('style', 'width: 15.5%;');

    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // Append the table head and body to table
    table.appendChild(colGroup);
    colGroup.appendChild(col_a);
    colGroup.appendChild(col_b);
    colGroup.appendChild(col_c);
    colGroup.appendChild(col_e);
    table.appendChild(tableBody);

    // Creating table body
    data.forEach(item => {
        let row = tableBody.insertRow();
        Object.values(item).forEach(value => {
        let cell = row.insertCell();
        cell.classList.add('entre');
        // noinspection JSValidateTypes
        cell.innerHTML = value;
        });
    });

    // Append the table to the HTML document
    document.getElementById('data').appendChild(table);
}
