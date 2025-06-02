import {  toast } from 'react-toastify';


// using RTQ changed the way the message comes so i have changed the function to accepts the new way.

// interface successMsg extends AxiosResponse {
//     data:{
//         message:string
//     }
// }

export const toastingSuccess = (msgOfSuccess:string,onClose?: ()=>void) => {
    
    // check if the following provided
    if (msgOfSuccess) {
        toast.success(msgOfSuccess,{
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
