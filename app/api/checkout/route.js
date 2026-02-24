import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const SHIPPING_FEE = 45;

export async function POST(request) {
  try {
    const userSession = request.cookies.get("user_session")?.value;
    const userId = Number(userSession || 0) || null;

    if (!userId) {
      return NextResponse.json(
        { error: "يرجى تسجيل الدخول لإتمام الطلب" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const {
      customerName,
      phone,
      country,
      city,
      address,
      notes,
      paymentMethod = "COD",
      cartItems,
    } = body || {};

    const sanitizeText = (value) => String(value ?? "").trim();
    const customerNameValue = sanitizeText(customerName);
    const phoneValue = sanitizeText(phone);
    const countryValue = sanitizeText(country);
    const cityValue = sanitizeText(city);
    const addressValue = sanitizeText(address);

    if (
      !customerNameValue ||
      !phoneValue ||
      !countryValue ||
      !cityValue ||
      !addressValue
    ) {
      return NextResponse.json(
        { error: "الرجاء تعبئة بيانات التوصيل" },
        { status: 400 }
      );
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "السلة فارغة" },
        { status: 400 }
      );
    }

    const itemsPayload = cartItems.map((item) => ({
      productId: Number(item?.productId ?? item?.id),
      productName: sanitizeText(item?.productName ?? item?.name ?? item?.nameAr),
      quantity: Number(item?.quantity || 0),
      unitPrice: Number(item?.price || 0),
    }));

    if (
      itemsPayload.some(
        (item) => !item.productId || item.quantity <= 0 || !item.productName
      )
    ) {
      return NextResponse.json(
        { error: "بيانات المنتجات غير صالحة" },
        { status: 400 }
      );
    }

    const subtotal = itemsPayload.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const totalAmount = subtotal + SHIPPING_FEE;
    const paymentStatus = paymentMethod === "CARD" ? "paid" : "pending";

    const order = await prisma.order.create({
      data: {
        customerName: customerNameValue,
        phone: phoneValue,
        country: countryValue,
        city: cityValue,
        address: addressValue,
        notes: notes || null,
        paymentMethod,
        paymentStatus,
        totalAmount,
        status: "new",
        userId,
        items: {
          create: itemsPayload.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(
      { message: "تم إنشاء الطلب بنجاح", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Checkout error", error);
    return NextResponse.json(
      { error: "تعذر إنشاء الطلب" },
      { status: 500 }
    );
  }
}

