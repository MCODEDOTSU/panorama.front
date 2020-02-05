import axios from 'axios';

export const addAuthorizationHeader = (userState: any) => {
    // noinspection TsLint
    axios.defaults.headers.common['Authorization'] = userState.token;
};

export const addAuthorizationHeaderFromLocalStorage = (storage: any) => {
    const token = JSON.parse(storage).user.token;
    // noinspection TsLint
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
    }
};
