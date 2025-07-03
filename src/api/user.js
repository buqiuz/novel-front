import request from '../utils/request'

export function register(params) {
    return request.post('/front/user/register', params);
}

export function login(params) {
    return request.post('/front/user/login', params);
}

export function submitFeedBack(params) {
    return request.post('/front/user/feedback', params);
}

export function comment(params) {
    return request.post('/front/user/comment',params);
}

export function deleteComment(id) {
    return request.delete(`/front/user/comment/${id}`);
}

export function updateComment(id,content) {
    return request.putForm(`/front/user/comment/${id}`,content);
}

export function getUserinfo() {
    return request.get('/front/user');
}

export function updateUserInfo(userInfo) {
    return request.put('/front/user',userInfo);
}

export function listComments(params) {
    return request.get('/front/user/comments', { params });
}

export function deleteUser() {
    return request.delete("/front/user/delete");
}

export function listHistory(params) {
    return request.get('/front/user/read_history', { params });
}

export function listBookshelf(params){
    return request.get('/front/user/bookshelf', { params });
}

export function addBookshelf(params) {
    return request.post(`/front/user/addBookshelf?bookId=${params.bookId}&preContentId=${params.preContentId}`);
}

export function deleteBookshelf(params) {
    return request.delete('/front/user/deleteBookshelf', { params });
}

export function isInBookshelf(params) {
    return request.get('/front/user/isInBookshelf', { params });
}