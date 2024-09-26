export const sortMessagesByTime = (messages) => {
    return messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const getLastName = (fullName) => {
    const nameParts = fullName.split(' ');
    return nameParts[nameParts.length - 1];
};

export const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
};
