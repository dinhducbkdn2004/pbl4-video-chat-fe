import { Avatar, Button } from 'antd';
import React from 'react'

const UserCard = ({data}) => {
    const {name, email, isFriend, avatar} = data
  return ( <div
    className="flex items-center bg-white-default gap-[10px] p-4 rounded-2xl"
>
<Avatar src={avatar} size={40} />
<div
    style={{
        flex: 1,
    }}
>
    <h1 className="text-[17px] text-[#050505]">{name}</h1>
    <h2 className="text-[15px] text-[#050505]">{email}</h2>
</div>
<Button onClick={()=>{
    if(isFriend){
        //nhawns tin
        return;
    }
    
}}>
    {isFriend ? "Nhắn tin" : "Kết bạn"}
</Button>
</div>
)
   
}

export default UserCard
