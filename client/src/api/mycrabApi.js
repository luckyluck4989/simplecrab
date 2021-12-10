import axiosClient from "./axiosClient";

class MyCrabApi {
    getMyCrab = (params) => {
        const url = '/mycrab';
        return axiosClient.get(url, {params});
    };
}

const myCrabApi = new MyCrabApi();
export default myCrabApi;