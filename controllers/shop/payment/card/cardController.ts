import { NextApiResponse, NextApiRequest } from "next";
import { zodValidatorHelper } from "../../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { ValidateCreateCard, ValidateUpdateCard, validationDeleteCard, validationSetToDefaultCard } from "../../../../_lib_backend/validation/cardValidation";
import { addingCard, deletingCard, gettingCard, setCardToDefault, updatingCard } from "../../../../models/shop/payment/card/cardModels";
import prisma from "../../../../_lib_backend/prismaClient/PrismaClient";
import { decodeToken } from "../../../../_lib_backend/token/decodeToken";

export const createCard = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    const data:Card = zodValidatorHelper(ValidateCreateCard,req.body,res)

    const creatingCard = await addingCard(data);

    if (creatingCard.success) {
      return res.status(201).json({
        message: "Created Successfully",
      });
    } else {
      return res.status(500).json({ error: creatingCard.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const deleteCard = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    
    const data:DeleteCard = zodValidatorHelper(validationDeleteCard,req.body,res)

    const scan = await prisma.card.findMany(({
      where:{
        customerId:data.customerId
      }
    }))

    if (scan.length === 1) return res.status(409).json({ message: "You must have at least one card." }); 
    
    const removingCard = await deletingCard(data);

    if (removingCard.success) {
      return res.status(200).json({
        message: " Removed successfully",
      });
    } else {
      return res.status(500).json({ error: removingCard.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const updateCard = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    // if the following condition is true , will handle set to default card only
    if (req.body.previousDefaultCardId && req.body.default && req.body.id !== req.body.previousDefaultCardId ) {
      const data:setToDefaultCard = zodValidatorHelper(validationSetToDefaultCard,req.body,res)
      const settingToDefault = await setCardToDefault(data);
      if (settingToDefault.success) {
        return res.status(200).json({message:"default updated"})
      } else {
        return res.status(500).json({ error: settingToDefault.error });
      }
    }
    // else will handle rest of Card info
    // const data:Card = zodValidatorHelper(ValidateUpdateCard,req.body,res)
    // const updatingTheCard= await updatingCard(data);
    // if (updatingTheCard.success) {
    //   return res.status(200).json({
    //     message: "Updated Successfully",
    //     updatedCard:updatingTheCard.card
    //   });
    // } else {
    //   return res.status(500).json({ error: updatingTheCard.error });
    // }

  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const getCard = async (res: NextApiResponse, req: NextApiRequest) => {
  try {
    const tokenData = await decodeToken(req.headers.authorization);

    if (typeof tokenData !== "string") {
      return res
        .status(401)
        .json({ message: " Invalid token ", error: tokenData.error });
    }

    const gettingTheCard = await gettingCard(tokenData);

    if (gettingTheCard.success) {
      return res.status(200).json({
        all_Card:gettingTheCard.all_Card
      });
    } else {
      return res.status(500).json({ error: gettingTheCard.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};
