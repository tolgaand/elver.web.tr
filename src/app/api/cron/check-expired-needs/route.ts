import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";

export async function GET(request: NextRequest) {
  if (
    request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const result = await db.needPost.updateMany({
      where: {
        expiresAt: {
          lt: new Date(), // Şu andan önce sona eren ilanlar
        },
        isExpired: false, // Henüz zaman aşımına uğramamış olanlar
      },
      data: {
        isExpired: true, // Zaman aşımına uğradı olarak işaretle
      },
    });

    return NextResponse.json({
      ok: true,
      markedAsExpired: result.count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking expired need posts:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "İlanları kontrol ederken bir hata oluştu",
      },
      { status: 500 },
    );
  }
}
