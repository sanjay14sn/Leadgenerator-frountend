export function formatLeadData(lead = {}) {
  return {
    name: lead.name || "",
    phone: lead.phone || "",
    address: lead.address || "",
    category: lead.category || "",
    rating: lead.rating || 0,
    reviews: lead.reviews || 0,
    gmap_link: lead.gmap_link || ""
  };
}
