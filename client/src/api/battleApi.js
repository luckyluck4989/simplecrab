import axiosClient from "./axiosClient";

class BattleApi {
    getBattle = () => {
        const url = '/battle';
        return axiosClient.get(url);
    };
}

const battleApi = new BattleApi();  
export default battleApi;