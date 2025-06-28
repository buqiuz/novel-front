import request from '../utils/request'

export function getImgVerifyCode() {
    return request.get('/front/resource/img_verify_code');
}
// 发送短信验证码
export function sendSmsCode(phone) {
    return request.get("/front/resource/sms_verify_code", {
        params: { phone },
    });
}

// 校验图形验证码
export function verifyImgCode(data) {
    return request.post("/front/resource/img_verify_code/verify", data);
}
