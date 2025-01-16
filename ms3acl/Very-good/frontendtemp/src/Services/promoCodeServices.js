import axios from 'axios';

export const createPromoCode = async (promoCodeData) => {
    try {
        const response = await axios.post('http://localhost:4000/api/promoCodes', promoCodeData);
        return response.data.promoCode;
    } catch (error) {
        console.error('Error creating promo code:', error);
        return null;
    }
};

export const fetchAllPromoCodes = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/promoCodes');
        return response.data.promoCodes;
    } catch (error) {
        console.error('Error fetching promo codes:', error);
        return [];
    }
};

export const fetchPromoCodeById = async (promoCodeId) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/promoCodes/${promoCodeId}`);
        return response.data.promoCode;
    } catch (error) {
        console.error('Error fetching promo code:', error);
        return null;
    }
};

export const updatePromoCode = async (promoCodeId, updatedData) => {
    try {
        const response = await axios.patch(`http://localhost:4000/api/promoCodes/${promoCodeId}`, updatedData);
        return response.data.promoCode;
    } catch (error) {
        console.error('Error updating promo code:', error);
        return null;
    }
};

export const deletePromoCode = async (promoCodeId) => {
    try {
        await axios.delete(`http://localhost:4000/api/promoCodes/${promoCodeId}`);
        console.log('Promo code deleted successfully');
    } catch (error) {
        console.error('Error deleting promo code:', error);
    }
};
