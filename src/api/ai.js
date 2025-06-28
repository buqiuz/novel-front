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

export function getTTSStreamUrl(text, voiceType) {
    const params = new URLSearchParams({ text, voiceType });
    return `http://localhost:20001/api/front/ai/tts/qwen/stream?${params.toString()}`;
}

