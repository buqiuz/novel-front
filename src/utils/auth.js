
const TokenKey = 'Authorization'

const nickNameKey = 'nickName'

const uidKey = 'uid'

const goldCoinKey = 'goldCoin';


export const getToken = () => {
    return localStorage.getItem(TokenKey);
}

export const setToken = (token) => {
  return localStorage.setItem(TokenKey, token)
}

export const removeToken = () =>  {
  return localStorage.removeItem(TokenKey)
}

export const removeNickName = () =>  {
  return localStorage.removeItem(nickNameKey)
}

export const setNickName = (nickName) => {
  console.log('setNickName', nickName)
  return localStorage.setItem(nickNameKey, nickName)
}

export const getNickName = () => {
  return localStorage.getItem(nickNameKey);
}

export const setUid = (uid) => {
  return localStorage.setItem(uidKey, uid)
}

export const getUid = () => {
  return localStorage.getItem(uidKey);
}

export const removeUid = () =>  {
  return localStorage.removeItem(uidKey)
}

export const setGoldCoin = (goldCoin) => {
  return localStorage.setItem(goldCoinKey, goldCoin);
};

export const getGoldCoin = () => {
  return localStorage.getItem(goldCoinKey);
};

export const removeGoldCoin = () => {
  return localStorage.removeItem(goldCoinKey);
};

