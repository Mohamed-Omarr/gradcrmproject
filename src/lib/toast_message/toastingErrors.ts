import { AxiosError } from 'axios';
import {  toast } from 'react-toastify';
import { ZodError } from 'zod';
import { formatZodError } from '../../../_lib_backend/validation/zodHelper/zodError';

export const toastingError = (msgOfError:unknown) => {

    // check if th error is instance of AxiosError
    if (msgOfError instanceof AxiosError) {
        // check if error contain response and data 
        if (msgOfError.response && msgOfError.response.data && msgOfError.response.data.error){
            toast.error(msgOfError.response.data.error,{
                autoClose:1000
            })
        } 
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