$(function(){
  var search_list = $("#user-search-result");

  function appendUser(user){
    var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${user.id} data-user-name=${user.name}>追加</a>
               </div>`;
    search_list.append(html);
  }

  function appendnoUser(user){
    var html = `<div class="chat-group-user clearfix">${user}</div>`;
    search_list.append(html);
  }
  function appendGroupUser(user_id,user_name){
    var html = `<div class='chat-group-user clearfix js-chat-member' id='chat-group-user-8'>
                  <input name='group[user_ids][]' type='hidden' value='${user_id}'>
                  <p class='chat-group-user__name'>${user_name}</p>
                  <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
                </div>`
    $('#chat-group-users').append(html);
  }

  $('#user-search-field').on('keyup', function(){
    var input = $(this).val();
    if(input != ""){
      $.ajax({
        type: 'GET',
        url: '/users',
        data: {keyword: input},
        dataType: 'json'
      })
      .done(function(users){
        $('#user-search-result').empty();
        if(users.length!=0){
          users.forEach(function(user){
            appendUser(user);
          });
        }else{
          appendnoUser("一致する名前が存在しません。");
        }
      })
      .fail(function(){
        alert("ユーザー検索に失敗しました。")
      })
    }else{
      $('.user-search-add').parent().remove();
    }
  });

  $('#user-search-result').on('click', '.user-search-add', function(){
    var user_id = $(this).data('user-id');
    var user_name = $(this).data('user-name');
    // dataで取得する場合、「data-」以降を指定
    appendGroupUser(user_id, user_name);
    $(this).parent().remove();
    //親要素の取得後それを削除
    $('#user-search-field').val('');
    //入力した文字を消す
  });

  $('#chat-group-users').on('click', '.user-search-remove', function() {
     $(this).parent().remove();
   });
});
