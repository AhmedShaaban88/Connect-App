//catch all backend error
export default function catchError(response) {
    switch (response?.status) {
        case 400:
        case 409:
        case 404:
            return response.data.errors ? response.data.errors : response.data.error;
        case 401:
            return response.data?.data?.message;
        default:
            return 'Something wrong has happened'
    }
}
