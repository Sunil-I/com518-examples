$(document).ready(() => {
  $(".delete").click((event) => {
    event.preventDefault();
    $.ajax({
      type: "DELETE",
      url: event.currentTarget.href,
      success: (response) => {
        location.reload(true);
      },
      error: (error) => {
        var err = error;
        console.log(err);
      },
    });
  });
});

$(document).ready(() => {
  $(".buy").click((event) => {
    event.preventDefault();
    $.ajax({
      type: "POST",
      url: event.currentTarget.href,
      success: (response) => {
        alert(response.message);
        location.reload(true);
      },
      error: (error) => {
        var err = error.responseJSON;
        alert(err.message);
      },
    });
  });
});
