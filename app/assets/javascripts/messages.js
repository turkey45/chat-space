$(function(){
  function buildHTML(message){
   image = message.image ? '<img src=${message.image}' : '';
   var html = `<div class="chat-main__message clearfix">
                 <div class="chat-main__message-name">
                   ${message.user_name}
                 </div>
                 <div class="chat-main__message-time">
                   ${message.time}
                 </div>
                 <div class="chat-main__message-body">
                   <div class="lower-message__content">
                    ${message.content}
                   </div>
                   ${image}
                 </div>
               </div>
             `
    return html;
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
   })
    .done(function(data){
      console.log(data)
      var html = buildHTML(data);
      $('.chat-main__body').append(html);
      $('.form__message').val('');
      $('.chat-main__body').animate({scrollTop:$('.chat-main__body')[0].scrollHeight }, 'fast');
      $('.form__submit').attr('disabled', false);
      $('#new_message')[0].reset();
      return false;
    })
    .fail(function(){
     alert('error');
    })
  })
});









