import axios from "axios";
import { BASE_URL } from "../config";


export default class SportApp {
    static async login(username, password) {
        const bodyFormData = new FormData();
        bodyFormData.append('username', username);
        bodyFormData.append('password', password);

        const response = await axios.post(`${BASE_URL}/token`, bodyFormData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
        );
        return response;
    }

    static async registration(nickname, email, password) {
        const response = await axios.post(`${BASE_URL}/user/`, { nickname, email, password });
        return response;
    }

    static async getUser(token) {
        const response = await axios.get(`${BASE_URL}/user/`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response;
    }

    static async getTraning(id, token) {
        const response = await axios.get(`${BASE_URL}/item/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response;
    }

    static async create_traning(traning, token) {
        const response = await axios.post(`${BASE_URL}/item/`, traning,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }

    static async create_exercise(exercise, token) {
        const response = await axios.post(`${BASE_URL}/exercise/`, exercise,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }

    static async delete_exercise(id, token) {
        const response = await axios.delete(`${BASE_URL}/exercise/${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }

    static async create_approuch(approach, token) {
        const response = await axios.post(`${BASE_URL}/approach/`, approach,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }

    static async delete_approuch(id, token) {
        const response = await axios.delete(`${BASE_URL}/approach/${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }

    static async update_item(id, item, token) {
        const response = await axios.put(`${BASE_URL}/item/${id}`, item,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }

    static async remove_item(id, token) {
        const response = await axios.delete(`${BASE_URL}/item/${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }

    static async upload_images(formData, token) {
        console.log(BASE_URL);
        const response = await axios.post(`${BASE_URL}/images/`,formData,
            {
                headers: {
                    'content-type': 'multipart/form-data',
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }

    static async remove_image(id, token) {
        const response = await axios.delete(`${BASE_URL}/images/${id}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
        return response;
    }
}