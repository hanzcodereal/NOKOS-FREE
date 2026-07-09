const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/api/otps', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        
        const response = await axios.get('https://weak-deloris-nothing672434-fe85179d.koyeb.app/api/otps', {
            params: { limit: limit },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        if (response.data && response.data.success) {
            res.json(response.data);
        } else {
            res.status(404).json({ 
                success: false, 
                error: 'Data not found',
                message: 'API endpoint returned invalid response'
            });
        }
    } catch (error) {
        console.error('API Error:', error.message);
        
        if (error.response) {
            res.status(error.response.status).json({
                success: false,
                error: `API Error: ${error.response.status}`,
                message: error.response.data?.message || 'External API error'
            });
        } else if (error.request) {
            res.status(503).json({
                success: false,
                error: 'Service Unavailable',
                message: 'Cannot connect to external API'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error',
                message: error.message
            });
        }
    }
});

app.listen(PORT, () => {
    console.log('NOKOS FREE Server Running');
    console.log('Access the application in your browser');
});
