const addCards = (items) => {
  // Prevent duplicate cards if we ever re-fetch.
  $("#card-section").empty()
  items.forEach(item => {
    let itemToAppend =
      '<div class="col s12 m6 l3 center-align">' +
        '<div class="card medium">' +
          '<div class="card-image waves-effect waves-block waves-light">' +
            '<img class="activator" src="' + item.image + '">' +
          '</div>' +
          '<div class="card-content">' +
            '<span class="card-title activator grey-text text-darken-4">' +
              item.title +
              '<i class="material-icons right">more_vert</i>' +
            '</span>' +
            '<p><a href="#">' + item.link + '</a></p>' +
          '</div>' +
          '<div class="card-reveal">' +
            '<span class="card-title grey-text text-darken-4">' +
              item.title +
              '<i class="material-icons right">close</i>' +
            '</span>' +
            '<p class="card-text">' + item.desciption + '</p>' +
          '</div>' +
        '</div>' +
      '</div>'

    $("#card-section").append(itemToAppend)
  })
}

const submitForm = () => {
  const formData = {
    title: $("#book_title").val(),
    author: $("#book_author").val(),
    desciption: $("#book_desciption").val(),
    image: $("#book_image").val()
  }

  // For this practical, we just log the values (same pattern as the PDF).
  console.log("Book Submitted:", formData)
}

$(document).ready(function () {
  fetch("/api/books")
    .then(res => res.json())
    .then(items => {
      addCards(items)
    })
    .catch(err => console.error("Failed to load books:", err))

  // Initialize Materialize modal component.
  $(".modal").modal()

  // Hook up submit action for the modal form.
  $("#formSubmit").click(() => {
    submitForm()
  })
})