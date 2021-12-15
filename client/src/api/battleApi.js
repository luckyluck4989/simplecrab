import axiosClient from "./axiosClient";

class BattleApi {
    getBattle = () => {
        const url = '/battle';
        return axiosClient.get(url);
    };

    getBattleById = (params) => {
        const url = '/battle_detail';
        return axiosClient.get(url, {params});
    }
}

const battleApi = new BattleApi();  
export default battleApi;