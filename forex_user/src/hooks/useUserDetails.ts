//Dets
import { useQuery } from "@tanstack/react-query";
import { capMarketServer } from "../constant/apiclient";
import { getToken } from "../utils/getTocken";
const userDetailsApi = async (): Promise<any> =>
    capMarketServer
        .get("/profile",)
        .then((res) => res.data);;
export const useUserDetails = () => {
    return useQuery({
        queryKey: ["admin-details"],
        queryFn: userDetailsApi,
        enabled: !!getToken(),
    });
};
