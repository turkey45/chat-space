$(function(){
  var search_list = $("#user-search-result");

  function appendUser(user){
    var html = `<div class="chat-group-user clearfix">
                  <p class="chat-group-user__name">${user.name}</p>
                  <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id=${user.id} data-user-name=${user.name}>追加</a>
               </div>`;
    search_list.append(html);
  }
  // appendで引数の値を取得し対象の要素に追加している
  // 該当する名前があったときに、対象になる名前を表記している
  function appendnoUser(user){
    var html = `<div class="chat-group-user clearfix">${user}</div>`;
    search_list.append(html);
  }
  // 該当する名前がない場合に、一致するユーザーがないと表示するHTMLの部分
  function appendGroupUser(user_id,user_name){
    var html = `<div class='chat-group-user clearfix js-chat-member' id='chat-group-user-8'>
                  <input name='group[user_ids][]' type='hidden' value='${user_id}'>
                  <p class='chat-group-user__name'>${user_name}</p>
                  <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn'>削除</a>
                </div>`
    $('#chat-group-users').append(html);
    // チャットメンバーに追加した名前を表示させる関数。削除ボタンも必要。
  }
  $('#user-search-field').on('keyup', function(){
    // 文字が入力されるたびにイベントを発生させるkeyupを使う！!
    var input = $(this).val();
    // serch-fieldに値が入力されたら、inputに代入する。フォームの値は.val();を使う
    if(input != ""){
      // ここからはajaxのデータ指定だが、空じゃないとき、（!=は否定)つまり、何か入力されたら、下記の通り、発動しdoneする
      $.ajax({
        type: 'GET',
        url: '/users',
        data: {keyword: input},
        dataType: 'json'
      })
      .done(function(users){
        $('#user-search-result').empty();
        // まずこのuser-serch-resultの子要素を空にしてから、下の通りに動かす。
        // これがないと永遠に情報が出てしまう
        if(users.length!=0){
          users.forEach(function(user){
            appendUser(user);
          });
        }else{
          appendnoUser("一致する名前がありません。");
        }
      })
      .fail(function(){
        alert("ユーザーの検索に失敗しました。")
      })
    }else{
      $('.user-search-add').parent().remove();
    }
    // 万が一ajaxに失敗したら、親要素をリムーブする
  });

  $('#user-search-result').on('click', '.user-search-add', function(){
    var user_id = $(this).data('user-id');
    var user_name = $(this).data('user-name');
    appendGroupUser(user_id, user_name);
    $(this).parent().remove();
    $('#user-search-field').val('')
  });
     // ユーザーを追加する

  $('#chat-group-users').on('click', '.user-search-remove', function() {
     $(this).parent().remove();
   });
  // 追加したユーザーを削除する項目
});
