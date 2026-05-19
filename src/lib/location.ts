export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
].sort();

export async function lookupPincode(pincode: string) {
  if (!/^\d{6}$/.test(pincode)) return null;
  
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    
    if (data[0].Status === "Success") {
      const postOffice = data[0].PostOffice[0];
      return {
        city: postOffice.District,
        state: postOffice.State,
      };
    }
  } catch (error) {
    console.error("Pincode lookup failed:", error);
  }
  return null;
}

export async function lookupByCity(cityName: string) {
  if (cityName.length < 3) return [];
  
  try {
    const response = await fetch(`https://api.postalpincode.in/postoffice/${cityName}`);
    const data = await response.json();
    
    if (data[0].Status === "Success") {
      // Get unique pincodes and their districts
      const suggestions = data[0].PostOffice.map((po: any) => ({
        pincode: po.Pincode,
        city: po.District,
        state: po.State,
        area: po.Name
      }));
      return suggestions.slice(0, 10); // Return top 10 matches
    }
  } catch (error) {
    console.error("City lookup failed:", error);
  }
  return [];
}
