import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

interface IListingParams {
  listingId?: string;
}

export async function DELETE(request: Request, params: IListingParams) {
  const currenUser = await getCurrentUser();

  if (!currenUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    return new NextResponse("Invalid ID", { status: 400 });
  }

  const listing = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currenUser.id,
    },
  });

  return NextResponse.json(listing);
}
