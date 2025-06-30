// src/api/payment.js
import request from "@/utils/request";

/**
 * 获取用户金币余额
 */
export function getGoldBalance(userId) {
    return request.get("/front/payment/coins", {
        params: { userId },
        responseType: 'text'
    });
}