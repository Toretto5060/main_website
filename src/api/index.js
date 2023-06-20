import axios from "./resouce";


export const getAgePicture = (params) => {
    return axios.get('/api/index/age/getPicture', { params });
};
// export const ChatGptCompletions = params => { // chatGpt文本对话
//   return axios.post('/v1/completions', params);
// };