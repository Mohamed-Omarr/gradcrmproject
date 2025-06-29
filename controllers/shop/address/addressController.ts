import { NextApiResponse, NextApiRequest } from "next";
import { validationCreateAddress, validationDeleteAddress, validationSetToDefaultAddress, validationUpdateAddress } from "../../../_lib_backend/validation/addressValidation";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { addingAddress, deletingAddress, gettingAddress, setAddressToDefault, updatingAddress } from "../../../models/shop/address/addressModels";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";
import prisma from "../../../_lib_backend/prismaClient/PrismaClient";

export const createAddress = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    const data:Address = zodValidatorHelper(validationCreateAddress,req.body,res)

    const creatingAddress = await addingAddress(data);

    if (creatingAddress.success) {
      return res.status(201).json({
        message: "Created Successfully",
      });
    } else {
      return res.status(500).json({ error: creatingAddress.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const deleteAddress = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    
    const data:DeleteAddress = zodValidatorHelper(validationDeleteAddress,req.body,res)

    const scan = await prisma.address.findMany(({
      where:{
        customerId:data.customerId
      }
    }))

    if (scan.length === 1) return res.status(409).json({ message: "You must have at least one address." }); 
    
    const removingAddress = await deletingAddress(data);

    if (removingAddress.success) {
      return res.status(200).json({
        message: " Removed successfully",
      });
    } else {
      return res.status(500).json({ error: removingAddress.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const updateAddress = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    // if the following condition is true , will handle set to default address only
    if (req.body.previousDefaultAddressId && req.body.default && req.body.id !== req.body.previousDefaultAddressId ) {
      
      const data:setToDefaultAddress = zodValidatorHelper(validationSetToDefaultAddress,req.body,res)
      const settingToDefault = await setAddressToDefault(data);
      if (settingToDefault.success) {
        return res.status(200).json({message:"default updated"})
      } else {
        return res.status(500).json({ error: settingToDefault.error });
      }
    }
    // else will handle rest of address info
    const data:Address = zodValidatorHelper(validationUpdateAddress,req.body,res)
    const updatingTheAddress = await updatingAddress(data);
    if (updatingTheAddress.success) {
      return res.status(200).json({
        message: "Updated Successfully",
        updatedAddress:updatingTheAddress.address
      });
    } else {
      return res.status(500).json({ error: updatingTheAddress.error });
    }

  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const getAddress = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    const tokenData = await decodeToken(req.headers.authorization);

    if (typeof tokenData !== "string") {
      return res
        .status(401)
        .json({ message: " Invalid token ", error: tokenData.error });
    }

    const gettingTheAddress = await gettingAddress(tokenData);

    if (gettingTheAddress.success) {
      return res.status(200).json({
        all_Address:gettingTheAddress.allAddress
      });
    } else {
      return res.status(500).json({ error: gettingTheAddress.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};
