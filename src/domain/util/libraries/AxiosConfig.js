import axios from 'axios';
export const addAuthorizationHeader = (userState) => {
    // noinspection TsLint
    axios.defaults.headers.common['Authorization'] = userState.token;
};
export const addAuthorizationHeaderFromLocalStorage = (storage) => {
    const token = JSON.parse(storage).user.token;
    // noinspection TsLint
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
    }
};
//# sourceMappingURL=AxiosConfig.js.map