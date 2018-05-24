$(function(){
  function buildHTML(message){
    if( message.image) {
      var image = `<img src="${message.image}" class="lower-message__image">`
    } else {
      var image = '';
    }
   var html = `
            <div class="chat-main__message" data-message-id="${message.id}">
              <div class="chat-main__message-name">
                ${message.name}
              </div>
              <div class="chat-main__message-time">
                ${message.created_at}
              </div>
              <p class="lower-message__content">
                ${message.content}
              </p>
              ${image}
            </div>
             `
    return html;
};
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var href = $(this).attr('action');
    var formData = new FormData(this);
    $.ajax({
      url: href,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
   }).done(function(data){
      var html = buildHTML(data);
      $('.chat-main__body').append(html);
      $('.form__message').val('');
      $('.chat-main__body').animate({scrollTop:$('.chat-main__body')[0].scrollHeight }, 'fast');
      $('.form__submit').prop('disabled', false);
    }).fail(function(data){
     alert('error');
    })
  });

   $(function(){
    setInterval(update, 5000);
  });
  function update(){
    if(location.pathname.match(/\/groups\/\d+\/messages/))
    $.ajax({
      url: location.href,
      type: 'GET',
      dataType: 'json'
    })
    .done(function(data){
      var message_id = $(".chat-main__message").last().data("message-id");
      data.messages.forEach(function(message) {
        if(message.id > message_id){
            var html = buildHTML(message);
            $(".chat-main__body").append(html)
            $('.chat-main__body').animate({ scrollTop: $('.chat-main__body')[0].scrollHeight }, 'fast');
        }
      });
    })
    .fail(function(data) {
     alert('エラーのためメッセージの送信ができませんでした。');
    })
  };
  });








