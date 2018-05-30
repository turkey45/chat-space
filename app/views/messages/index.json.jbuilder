json.messages @messages do |message|
    json.id           message.id
    json.content      message.content
    json.name         message.user.name
    json.created_at   message.created_at
    json.image        message.image.url
end
