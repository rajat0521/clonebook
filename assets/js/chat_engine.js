// client side i.e. us


let message=document.getElementById('send-message').value;
        // console.log(message);


class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect("https://clonebook-app.herokuapp.com/" , { transports : ['websocket'] });
        
        if (this.userEmail){
            // console.log(chatBoxId, userEmail, "Client side code");
            this.connectionHandler();
        }

    }


    connectionHandler(){

        let self=this;

        this.socket.on('connect', function(){
            // console.log('connection established using sockets...!');
            

            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:'clonebook'
            });

            self.socket.on('user_joined',function(data){
                // console.log('a user joined',data);
            });
        });

        


        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            // console.log(msg);
            if(msg!=''){
                self.socket.emit('send_message',{
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'clonebook'
                });
            }
        });

        self.socket.on('recieve_message',function(data){
            // console.log('message recieved',data.message);


            let newMessage=$('<li>');

            let messageType = 'other-message';

            if(data.user_email== self.userEmail){
                messageType='self-message';
            }

            newMessage.append($('<span>',{
                'html': data.message
            }));

            newMessage.append($('<sub>',{
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        })
    }
}




