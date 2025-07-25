// src/api/script.js
import axios from 'axios';

export const generateScript = async (conversation) => {
    try {
        const res = await axios.post("http://localhost:8000/generate/script", {
            conversation, // Wrap in { conversation: [...] }
        });

        return { success: true, script: res.data.script };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
