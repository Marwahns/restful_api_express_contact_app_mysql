// Proses update
function processUpdate() {
  event.preventDefault();

  const contactId = document.getElementById("id").value; // Ganti dengan ID kontak yang ingin di-update
  const name = document.getElementById("name").value;
  const noHP = document.getElementById("noHP").value;
  const email = document.getElementById("email").value;

  const url = `/contact/${contactId}`;
  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, noHP, email }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to update contact");
      }
    })
    .then((data) => {
      alert(data.message);
      window.location.href = `/contact/${contactId}`; // Arahkan ke halaman detail
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengupdate data kontak.");
    });
}

// Proses delete
function processDelete() {
  event.preventDefault();
  const contactId = document.getElementById("id").value;

  const url = `/contact/${contactId}`;
  fetch(url, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to delete contact");
      }
    })
    .then((data) => {
      alert(data.message);
      // window.location.href = '/contacts';
      req.flash("msg", "Data contact berhasil dihapus!");
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error:", error);
      // alert('Terjadi kesalahan saat menghapus data kontak.');
      window.location.href = "/";
    });
}

// Proses delete multiple
function processDeleteMultiple() {
  event.preventDefault();

  const checkedCheckboxes = document.querySelectorAll(".check-input:checked");
  const contactIds = Array.from(checkedCheckboxes).map((checkbox) =>
    checkbox.getAttribute("data-id")
  );
  const url = `/contacts/delete/${contactIds.join(",")}`;

  fetch(url, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to delete contacts");
      }
    })
    .then((data) => {
      alert(data.message);
      // window.location.href = '/contacts';
      req.flash("msg", "Contacts successfully deleted!");
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error:", error);
      // alert('An error occurred while deleting contacts.');
      window.location.href = "/";
    });
}

// sort by name
function sortByName() {
  const url = `/contact?sort=name`;
  window.location.href = url;
}

function sortAscending() {
  fetch("/sort", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sortBy: "name" }),
  })
    .then((response) => {
      console.log("Response status:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("Data:", data);
      // Handle the sorted data
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// sort data by name from database
function sortName() {
  const sortButton = document.getElementById("sortButton");
  // sortButton.addEventListener('click', sortAscending);
  $("#sortButton").on("click", function (e) {
    e.preventDefault();
    const iconSort = $("#iconSort");

    if (iconSort.hasClass("fas fa-caret-down")) {
      iconSort.removeClass("fas fa-caret-down").addClass("fas fa-caret-up");
    } else if (iconSort.hasClass("fas fa-caret-up")) {
      iconSort.removeClass("fas fa-caret-up").addClass("fas fa-caret-down");
    }

    // Your sorting logic or AJAX request can go here
    // ...
  });
}

// Checkbox pada header table
function HeadCheckbox() {
  const flexCheckDefault = document.getElementById("flexCheckDefault");
  flexCheckDefault.addEventListener("click", function (e) {
    // Toggle the checked state of the clicked checkbox
    if (this.checked) {
      $(".check-input").prop("checked", true);
      $("#trash").removeClass("d-none");

      const checkedCheckboxes = document.querySelectorAll(
        ".check-input:checked"
      );
      const checkedIds = Array.from(checkedCheckboxes).map((checkbox) =>
        checkbox.getAttribute("data-id")
      );
      console.log("IDs of checked data:", checkedIds);
    } else {
      $(".check-input").prop("checked", false);
      $("#trash").addClass("d-none");
    }

    // Check if any of the form-check-input checkboxes are checked
    const anyChecked = $(".check-input:checked").length > 0;

    // Update the value of the clicked checkbox based on the state of the other checkboxes
    if (anyChecked) {
      $(this).val("checked");
    } else {
      $(this).val("");
    }

    console.log($(this).val());
  });
}

// Checkbox
function Checkbox() {
  const formCheckInputs = document.getElementsByClassName("check-input");
  // console.log(formCheckInputs.length);
  // Loop through each checkbox and add the event listener
  for (const checkbox of formCheckInputs) {
    checkbox.addEventListener("click", function (e) {
      // Prevent the checkbox click event from propagating to the row's click event
      e.stopPropagation();

      const checkedCheckboxes = document.querySelectorAll(
        ".check-input:checked"
      );
      // const checkboxes = document.querySelectorAll('.check-input');
      const numChecked = checkedCheckboxes.length;
      const checkedIds = Array.from(checkedCheckboxes).map((checkbox) =>
        checkbox.getAttribute("data-id")
      );
      console.log("IDs of checked data:", checkedIds);
      console.log(`Number of checked checkboxes: ${numChecked}`);

      if (numChecked > 1) {
        $("#trash").removeClass("d-none");
        if (numChecked === formCheckInputs.length) {
          $("#flexCheckDefault").prop("checked", true);
        } else {
          $("#flexCheckDefault").prop("checked", false);
        }
      } else {
        $("#flexCheckDefault").prop("checked", false);
        $("#trash").addClass("d-none");
      }
    });
  }
}

// get detail data based on row
function RowData() {
  const rowDataElements = document.getElementsByClassName("row-data");

  // Convert the collection to an array for easier iteration
  const rowDataArray = Array.from(rowDataElements);

  // Add event listener to each row-data element
  rowDataArray.forEach(function (row) {
    row.addEventListener("click", function (e) {
      // Find the checkbox element within the clicked row
      const checkbox = row.querySelector(".check-input");

      // Get the value of the 'data-id' attribute
      const contactId = checkbox.getAttribute("data-id");
      const contactName = checkbox.getAttribute("data-name");
      const contactPhone = checkbox.getAttribute("data-phone");
      const contactEmail = checkbox.getAttribute("data-email");

      // Now you have the contact.id based on the clicked row
    //   alert(`ID: ${contactId}\n`
    //   + `Name: ${contactName}\n`
    //   + `Phone: ${contactPhone}\n`
    //   + `Email: ${contactEmail}`
    //   );

      // window.location.href = `/contact/${contactId}`; // Arahkan ke halaman detail
      // Open the modal based on the contact ID
      openModal(contactId, contactName, contactPhone, contactEmail);
    });
  });
}

function openModal(contactId, contactName, contactPhone, contactEmail) {
  // Get a reference to the modal
  const modal = document.getElementById("exampleModal");

  // Populate the modal content based on the contact ID
  const modalTitle = modal.querySelector(".modal-title");
  const modalBody = modal.querySelector(".modal-body");
  let modalName = modal.querySelector(".contact-name");
  let modalPhone = modal.querySelector(".contact-phone");
  let modalEmail = modal.querySelector(".contact-email");
  let updateContact = modal.querySelector(".contact-update");

  // Update the title and body content based on the contact ID
  modalTitle.textContent = "Contact Details"; // You can set a suitable title here
//   modalBody.innerHTML = `You clicked on the row with contact ID: ${contactId}`;
  modalName.textContent = `${contactName}`;
  modalPhone.textContent = `${contactPhone}`;
  modalEmail.textContent = `${contactEmail}`;
  updateContact.href = `/contact/edit/${contactId}`;
  $('.contact-id').val(contactId);

  // Open the modal
  $(modal).modal("show");

  const close = document.getElementsByClassName("close-modal");
  close[0].addEventListener("click", function () {
    $(modal).modal("hide");
  });
}

// Load function
sortName();
HeadCheckbox();
Checkbox();
RowData();
