import React, {useState} from 'react';
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                {email,password}
            );

            const {token} = response.data;
            localStorage.setItem('token', token);

            axios.defaults.headers.common['Authorization'] = 'Bearer ${token}';

            alert('Login successful!');
        }
        catch(error) {
            console.error('Login error:', error.response.data.message);
            alert(`Login failed: ${error.response.data.message}`);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );

}

export default LoginPage;