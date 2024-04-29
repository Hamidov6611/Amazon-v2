import { Prisma } from "@prisma/client";
import { returnCategoryObject } from "src/category/return-category.object";

export const productReturnObject: Prisma.ProductSelect = {
    images: true,
    name: true,
    price: true,
    description: true,
    id: true,
    createdAt: true,
    slug: true,
}

export const productReturnObjectFullest: Prisma.ProductSelect = {
    ...productReturnObject,
    category: {
        select: returnCategoryObject
    }
}