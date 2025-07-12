import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../_lib_backend/prismaClient/PrismaClient";
import { decodeToken } from "../../../_lib_backend/token/decodeToken";
import { zodValidatorHelper } from "../../../_lib_backend/validation/zodHelper/zodValidatorHelper";
import { validationAddToWishlist, validationDeleteWishlist } from "../../../_lib_backend/validation/wishlistValidation";
import { addingToWishlistItems, deletingWishlistItems, getWishlistItems } from "../../../models/shop/wishlist/wishlistItemsModels";

export const addToWishlistItems = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {

    const data: WishlistItems = zodValidatorHelper(
      validationAddToWishlist,
      req.body,
      res
    );

    const scan = await prisma.wishlistItems.findUnique({
      where: {
        customerId_productId: {
          customerId: data.customerId,
          productId: data.productId,
        },
      },
    });

    if (scan) {
      return res.status(400).json({ error: "Product Exits In Wishlist" });
    }

    const addedToWishlist = await addingToWishlistItems(data);

    if (addedToWishlist.success) {
      return res.status(201).json({
        message: "Added to wishlist successfully",
      });
    } else {
      return res.status(500).json({ error: `${addedToWishlist.error}` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const deleteWishlist = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const data: DeleteWishlistItems = zodValidatorHelper(
      validationDeleteWishlist,
      req.body,
      res
    );

    const scan = await prisma.wishlistItems.findUnique({
      where: {
        customerId_productId: {
          customerId: data.customerId,
          productId: data.productId,
        },
      },
    });

    if (!scan) {
      return res.status(400).json({ error: "Product does not  exits in wishlist" });
    }

    const deleting = await deletingWishlistItems(data);

    if (deleting.success) {
      return res
        .status(200)
        .json({ message: "Deleted successfully " });
    } else {
      return res.status(400).json({ error: `${deleting.error}` });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};

export const getWishlist = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const tokenData = await decodeToken(req.headers.authorization);

    if (typeof tokenData !== "string") {
      return res
        .status(401)
        .json({ message: " Invalid token ", error: tokenData.error });
    }

    // tokenData all include the ownerId and it being passed to function.
    const get_wishlists= await getWishlistItems(tokenData);

    if (get_wishlists.success) {
      return res.status(200).json({
        message: " Fetched all wishlist successfully ",
        wishlistItems: get_wishlists.wishlistItems,
      });
    } else {
      return res.status(500).json({ error: get_wishlists.error });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};
