import axiosClient from "./axiosClient";

class CrabApi {
    getMyCrab = (params) => {
        const url = '/mycrab';
        return axiosClient.get(url, {params});
    };

    getCrabById = (params) => {
        const url = '/crab_detail';
        return axiosClient.get(url, {params});
    };
}

const crabApi = new CrabApi();
export default crabApi;