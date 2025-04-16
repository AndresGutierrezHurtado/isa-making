export const useGetData = async (endpoint) => {
    const response = await fetch(process.env.NEXTAUTH_URL + "/api" + endpoint);
    const data = await response.json();
    return data;
};

export const usePostData = async (endpoint, data) => {
    const response = await fetch(process.env.NEXTAUTH_URL + "/api" + endpoint, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return await response.json();
};

export const usePutData = async (endpoint, data) => {
    const response = await fetch(process.env.NEXTAUTH_URL + "/api" + endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
    });
    return await response.json();
};

export const useDeleteData = async (endpoint, data) => {
    const response = await fetch(process.env.NEXTAUTH_URL + "/api" + endpoint, {
        method: "DELETE",
        body: JSON.stringify(data),
    });
    return await response.json();
};
