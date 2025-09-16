type AccessToken = {
    error: string | null,
    accessToken: string | null
}
export default async function getAccessToken(refreshToken: string): Promise<AccessToken> {
    let tokenResult: AccessToken = {
        error: null,
        accessToken: null
    }
    let res = await fetch((process.env.API_DOMAIN as string) + "/api/getAccessToken", {
        method: "POST",
        body: JSON.stringify({
            refreshToken
        }),
        headers: {
            "Content-Type": 'application/json'
        }
    });
    let data = await res.json();
    if(!data.code){
        tokenResult.error = "AccessToken 獲取失敗"
        return tokenResult;
    }
    tokenResult.accessToken = data.data.accessToken
    return tokenResult;
}