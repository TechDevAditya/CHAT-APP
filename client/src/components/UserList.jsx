import React from 'react';

function UserList({ users, onSelectUser }) {
    return (
        <div className="user-list">
            <h2>Users</h2>
            <ul>
                {users.map((user) => (
                    <li key={user._id} onClick={() => onSelectUser(user)}>
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;