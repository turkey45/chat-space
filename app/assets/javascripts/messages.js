$(function(){
  function buildHTML(message){
    // HTMLを生成するための関数を決めている。messageは引数。
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
// `で囲む方法(テンプレートリテラル記法)で書くことで複数行文字列や文字列内挿入ができる。
};
  $('#new_message').on('submit', function(e){
    // $セレクタonでイベントを発火。なくてもいいが、基本はonを使う。submitされた時にイベント発火
    e.preventDefault();
    // これを書くことで本来のsubmitが押された時の動きをキャンセルしてくれる

    var url = $(this).attr('action');
    // フォーム入力の場合はaction属性を入れる必要あるのでattrの値あはaction
    // action属性に送信先のURLが入っている。これでurlを定義できた。
    var $form = $('form')
    var $inputs = $('input[type="file"]:not([disabled])', $form)
    $inputs.each(function(_, input) {
    if (input.files.length > 0) return
    $(input).prop('disabled', true)
})
    var formData = new FormData(this);
    $inputs.prop('disabled', false)
    // 変数に代入し、引数はthisにすることで、submitが実行された時にこれが行われる
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      // processDataはデフォルトだとtrueになり、自動でクエリ文字列に変換してしまう。
      // 今回はDomdocumentそのものでデータを送りたいので自動変換しないようにfalseにする
      contentType: false,
      // デフォルトだとtext/xmlでコンテンツタイプXMLで返してしまう。
      // FromDataの場合はfalseにすることで上書きを防ぐので必ず書く。
   }).done(function(data){
      var html = buildHTML(data);
      $('.chat-main__body').append(html);
      $('.form__message').val('');
      $('#message_image').val('');
      $('.chat-main__body').animate({scrollTop:$('.chat-main__body')[0].scrollHeight }, 'fast');
      $('.form__submit').prop('disabled', false);
      // disabledはHTMLの属性 無効化する
      // この記述書かないと連続投稿ができない。
    }).fail(function(data){
     alert('error');
    })
    // .doneの逆でfailの記述を書く
  });

   $(function(){
    setInterval(update, 5000);
  });
  function update(){
    if(location.pathname.match(/\/groups\/\d+\/messages/))
      // この画面でのみ適用。これがないと全ての画面でセットインターバルが起きてしまう
    // location.hrefでもいいが、デプロイエラーが起きることがあるのでpathnameで！
    $.ajax({
      url: location.href,
      type: 'GET',
      dataType: 'json'
      // setIntervalではFromDataが関係ないのでここまででOK
    })
    .done(function(data){
      var message_id = $(".chat-main__message").last().data("message-id");
      // 表示されたメッセージの最新のものをidに代入する。.dataで要素に紐づいているキーを指定してデータを所得する。.lastは要素の一番最後ということ。今回は最新のものにあたる
      data.messages.forEach(function(message) {
        // forEachで配列データを繰り返し処理する(引数はmessageにすることで機能する)
        if(message.id > message_id){
          // データベースにある最新のmessage.idの方が表示されているidよりも大きい場合に
          // buildHTMLを生成するようにしてHTMLに代入する
            var html = buildHTML(message);
            // ここの引数も(messageで！)
            $(".chat-main__body").append(html)
            $('.chat-main__body').animate({ scrollTop: $('.chat-main__body')[0].scrollHeight }, 'fast');
        }
        // あとは送信と同じ。最新のmessage.idのものが表示される。
      });
    })
    .fail(function(data) {
     alert('エラーのためメッセージの送信ができませんでした。');
    })
  };
  });





