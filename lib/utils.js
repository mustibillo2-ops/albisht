export const formatPrice = (value = 0) =>
  new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));

const colorPalette = {
  أسود: "#0c0c0c",
  أبيض: "#f4f4f4",
  ذهبي: "#d4af37",
  بني: "#2b1b12",
  كحلي: "#0f1a2b",
};

export const colorToHex = (colorLabel = "") =>
  colorPalette[colorLabel.trim()] || "#d4af37";

export const statusBadgeClass = (status = "") => {
  switch (status) {
    case "paid":
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "processing":
      return "bg-amber-100 text-amber-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    case "cancelled":
    case "failed":
      return "bg-rose-100 text-rose-700";
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "inactive":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

