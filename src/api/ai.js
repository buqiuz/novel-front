import request from "@/utils/request";
import {reactive} from "vue";

export function ttsRead(params) {
    const formData = new FormData();
    Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
    });

    return request.post('/front/ai/tts/qwen', formData, {
        timeout: 60000
    });
}

const state = reactive({
    baseUrl: process.env.VUE_APP_BASE_API_URL,
});
export function getTTSStreamUrl(text, voiceType) {
    const params = new URLSearchParams({ text, voiceType });
    // 假如后端也暴露就用这个
    // return `http://ai.buqiu.icu/api/front/ai/tts/qwen/stream?${params.toString()}`;
    // 直接代理给后端127.0.0.1:8888
    return `${state.baseUrl}/front/ai/tts/qwen/stream?${params.toString()}`;
}
export async function getTTSStreamWithPost(text, voiceType) {
    const url = `${state.baseUrl}/front/ai/tts/qwen/stream-post`;
    const data = { text, voiceType };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error("TTS请求失败:", error);
        throw error;
    }
}

