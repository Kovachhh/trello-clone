export const getUserById = (users, targetId) => {
    const user = users.find(item => item.id.value === targetId);

    return user || null;
}