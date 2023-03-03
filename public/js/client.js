// fetch post request for soft deleting data

function popupFunc(currSelector) {
  const deleteId = currSelector.getAttribute("deleteId");
  const siteName = currSelector.getAttribute("deleteName");
  let alert = confirm(`Are you sure, you want to delete ${siteName} record?`);
  if (alert) {
    console.log("success");
    const url = "http://localhost:8000/delete/" + deleteId;
    fetch(url, {
      method: "POST",
    })
      .then((res) => {
        res.json();
      })
      .then((res) => window.location.reload());
  } else {
    console.log("cancel");
  }
}


// fetch post request for Adding Data

$("#add-btn").click(function () {
  let name = $("#name-input").val();
  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.exists) {
        alert("Record already exists in database!");
      } else {
        alert("Record saved successfully!");
        window.location.href = '/home';
      }
    })
    .catch((error) => {
      alert("Error saving data!");
      window.location.href = '/add';
    });
});
