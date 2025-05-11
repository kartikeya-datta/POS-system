document.addEventListener('DOMContentLoaded', async function () {

    const employeesList = await fetch('/admin/getEmployees', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())
    console.log(employeesList);
    if(employeesList.users){
        var x  = '';
        employeesList.users.forEach( (data) => {
            x = `<tr>
                <td class="name">${data.name}</td>
                <td class="email">${data.email}</td>
                <td>
                <button data-id=${data._id} class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
                </td>
            </tr>`
            document.getElementById('employeesTable').innerHTML += x;
        })
        const editButtons = document.querySelectorAll('.edit-button');
        const deleteButtons = document.querySelectorAll('.delete-button');
        editButtons.forEach(editButton => {
            editButton.addEventListener('click', async() => {
                const row = editButton.closest('tr');
                const nameCell = row.querySelector('.name');
                const emailCell = row.querySelector('.email');
                const id = row.querySelector('.edit-button').dataset.id
        
                nameCell.contentEditable = !nameCell.isContentEditable;
                emailCell.contentEditable = !emailCell.isContentEditable;
        
                editButton.textContent = nameCell.isContentEditable ? 'Save' : 'Edit';
                
                if (!nameCell.isContentEditable) {
                const updatedData = {
                    name: nameCell.textContent,
                    email: emailCell.textContent,
                    id: id
                };
                console.log('Updated Data:', updatedData);
                const editData = await fetch('/admin/editEmp', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                })
                .then((res) => res.json());
                console.log(editData);
                if(editData.success){
                    console.log(editData.success);
                    alert("Employee data edited successfully")
                    window.location.reload();
                } else {
                    alert("Failed to edit employee")
                } 
                }
            });
            });

            deleteButtons.forEach(deleteButton => {
                deleteButton.addEventListener('click', async() => {
                    const row = deleteButton.closest('tr');
                    const id = row.querySelector('.edit-button').dataset.id

                    const updatedData = {
                        id: id
                    };
                    console.log('Delete Data:', updatedData);
                    const editData = await fetch('/admin/deleteEmp', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    })
                    .then((res) => res.json());
                    console.log(editData);
                    if(editData.success){
                        console.log(editData.success);
                        alert("Employee data deleted successfully")
                        window.location.reload();
                    } else {
                        alert("Failed to delete employee")
                    } 
                });
                });
    }
})