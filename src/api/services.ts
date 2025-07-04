
import api from "./axios";
export const getSubmissionData = async () => {
    const response = await api.get('/user/submissions')
    return response.data
};
