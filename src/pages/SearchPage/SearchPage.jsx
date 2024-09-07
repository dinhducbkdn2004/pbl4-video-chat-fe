import React from "react";
import { Avatar, Button, Input } from "antd";
import { Container } from "postcss";
import UserCard from "../../components/Search/UserCard";
const { Search } = Input;
const SearchPage = () => {
    const users = [
        {
            name: "Thao nguyen",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXb4pT4uOsvRQYT4H9MI9TwfkMAMRHXWscAw&s",
            email: "nguyen123@gmail.com",
            isFriend: true,
        },
        {
            name: "Thao nguyen",
            avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXb4pT4uOsvRQYT4H9MI9TwfkMAMRHXWscAw&s",
            email: "nguyen123@gmail.com",
            isFriend: false,
        },
    ];
    return (
        <div className="max-w-[500px] mx-auto">
            <Search placeholder="input search loading default" loading />
            <div
                className="flex flex-col gap-5 "
                onClick={() => {

                }}
            >
                {users.map((user, index) => 
                   <UserCard key={index} data={user}/>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
