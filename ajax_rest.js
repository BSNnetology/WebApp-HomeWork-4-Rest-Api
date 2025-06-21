$(document).ready(function () {
  
  var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=";

  var secret;
  $.get("../security_dadata.txt", function(data) {  
    secret = data;  
  });

  $("form").submit(function (event) {
    $("#result").slideUp(400);
    
    var formData = {
      query: $("#ip").val(),
    };

    $.ajax({
      type: "GET",
      url: url + formData.query,
      beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", "Token " + JSON.parse(atob(secret, true)).token) 
      },
      data: '',
      dataType: "json",
      encode: true,
    })
    .done(function (response) {
      console.log(response);
      //----------
      if(response.location === null) {
        $("#result").html(
          'Результат:<br><br>' 
          + 'API Dafata не содержит информацию об IP-адресе: ' + formData.query
        );
      }
      else {
        $("#result").html(
          'Результат:<br><br>' 
          + response.location.value + '<br><br>'
          + 'Дополнительная информация:<br>' + JSON.stringify(response.location.data, null, "<br>")
        ); 
      }  
    })
    .fail(function(xhr) {
      console.log(xhr.responseJSON);
      $("#result").html(
        'Результат:<br><br>' 
        + 'Error:<br><br>'  + xhr.status + ': ' + xhr.responseJSON.message
      )
    });

    $("#result").slideDown(400);
    event.preventDefault();
  });
});
