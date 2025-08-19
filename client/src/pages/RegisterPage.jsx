import React, {useState} from 'react';
import axios from 'axios';      //later

function RegisterPage(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // POST request using axios 
            const response = await axios.post(
                'http://localhost:5000/api/auth/register', // Backend endpoint
                { name, email, password }                 // data in the post request
            );

            console.log('Registration successful:', response.data);
            alert('Registration successful! You can now log in.');

        } catch (error) {
            console.error('Registration error:', error.response.data.message);
            alert(`Registration failed: ${error.response.data.message}`);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit">Register</button>
            </form>
        </div>
    );

}

export default RegisterPage;