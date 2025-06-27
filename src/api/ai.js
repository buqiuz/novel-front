import request from "@/utils/request";

export function ttsRead(params) {
    const formData = new FormData();
    Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
    });

    return request.post('/front/ai/tts/qwen', formData, {
        timeout: 60000
    });
}



