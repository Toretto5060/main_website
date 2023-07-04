import axios from "./resouce";

export const loginInput = (params) => {
    return axios.post('/lybaby/index/age/login', params);
};

export const getAgePicture = (params) => {
    return axios.post('/lybaby/index/age/getPicture', params );
};
