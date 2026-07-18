
fetch('/assets/master/addenda.json')
    .then(response => response.json())
    .then(data => {
        // Call function to display table
        createFooter(data.description);
    })
    .catch(error => console.error('Error:', error));

function createFooter(data) {
    const table = document.createElement('table');
    table.classList.add('page-footer');
    const colGroup = document.createElement('colgroup');

    const col_a = document.createElement('col');
    col_a.setAttribute('span', '1');
    col_a.setAttribute('style', 'width: 100%;');

    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');

    // Append the table head and body to table
    table.appendChild(colGroup);
    colGroup.appendChild(col_a);
    table.appendChild(tableBody);

    // Initially
    let row = tableBody.insertRow();
    let cell = row.insertCell();
    cell.classList.add('page-footer');
    cell.innerHTML = '<span style="font-variant: small-caps;">In Depth</span> | &copy; ' + new Date().getFullYear().toString();

    // Creating table body
    data.forEach(declaration => {
        let row = tableBody.insertRow();
        Object.values(declaration).forEach(value => {
            let cell = row.insertCell();
            cell.classList.add('page-footer');
            // noinspection JSValidateTypes
            cell.innerHTML = value;
        });
    });

    // Append the table to the HTML document
    document.getElementById('footer').appendChild(table);
}
