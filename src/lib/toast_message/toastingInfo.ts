import {  toast } from 'react-toastify';
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
export const toastingInfo = (msgOfInfo:string,router:AppRouterInstance) => {
        toast.info(msgOfInfo,{
            autoClose:1100,
            onClose: () => {
                router.push("/auth/login");
            },
        });
}
