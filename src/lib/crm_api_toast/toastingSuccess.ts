import {  toast } from 'react-toastify';
import { AxiosResponse } from 'axios';

interface successMsg extends AxiosResponse {
    data:{
        message:string
    }
}

export const toastingSuccess = (msgOfSuccess:successMsg,onClose?: ()=>void) => {
    
    // check if the following provided
    if (msgOfSuccess && msgOfSuccess.data && msgOfSuccess.data.message) {
        toast.success(msgOfSuccess.data.message,{
            autoClose:1000,
            ...(onClose && { onClose: () => onClose() }),
        });
    } else{
        toast.success("Done Successfully",{
            autoClose:1000,
            ...(onClose && { onClose: () => onClose() }),
        });
    }
}
