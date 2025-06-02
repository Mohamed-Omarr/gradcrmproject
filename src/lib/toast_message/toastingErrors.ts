import {  toast } from 'react-toastify';
import { ZodError } from 'zod';
import { formatZodError } from '../../../_lib_backend/validation/zodHelper/zodError';

/* 
type of error could be coming from RTQ which is will be design as the following ( type Error)
or it could be from ZodError in both ways, i used if condition to check.
*/

type RTQError = {
    data:{
        error:string
    }
}

export const toastingError = (msgOfError: RTQError) => {
        // check if error contain data and message
    if (msgOfError.data.error ){
            toast.error(msgOfError.data.error,{
                autoClose:1000
    })
    } else if (msgOfError instanceof ZodError){
        toast.error(formatZodError(msgOfError),{
            autoClose:1000
        })
    }else {
        toast.error("An unexpected error occurred",{
            autoClose:1000
        })
    }
}