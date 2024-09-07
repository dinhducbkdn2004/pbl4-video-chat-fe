import ChatList from "../../components/ChatList/ChatList";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

const MessagePage = () => {
    return (
        <>
            <div className="chat-list-container">
                <ChatList />
            </div>
            <div className="chat-window-container">
                <ChatWindow />
            </div>
        </>
    );
};

export default MessagePage;
