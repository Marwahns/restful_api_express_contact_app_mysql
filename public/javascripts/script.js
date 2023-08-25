// const contactId = $('#id').val();
// console.log(contactId)

function processUpdate() {
    event.preventDefault();

    const contactId = document.getElementById('id').value; // Ganti dengan ID kontak yang ingin di-update
    const name = document.getElementById('name').value;
    const noHP = document.getElementById('noHP').value;
    const email = document.getElementById('email').value;

    const url = `/contact/${contactId}`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, noHP, email })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to update contact');
            }
        })
        .then(data => {
            alert(data.message);
            window.location.href = `/contact/${contactId}`; // Arahkan ke halaman detail
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengupdate data kontak.');
        });
}

function processDelete() {
    event.preventDefault();
    const contactId = document.getElementById('id').value;

    const url = `/contact/${contactId}`;
    fetch(url, {
        method: 'DELETE',
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to delete contact');
            }
        })
        .then(data => {
            alert(data.message);
            window.location.href = '/contacts';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat menghapus data kontak.');
        });
}
