import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export const generatePaymentLink = (udid: string): { link: string; reffCode: string } => {
  const reffCode = uuidv4(); // Generate a unique reference code
  const link = `https://ams1gn.id/payment/process.php?udid=${udid}&reff_code=${reffCode}`;
  return { link, reffCode };
};


export const verifyPaymentStatus = async (reffCode: string): Promise<boolean> => {
  try {
    const response = await axios.get(`https://ams1gn.id/api/check_payment.php?reff_code=${reffCode}`);
    return response.data.status === "paid"; // Replace with your API's actual structure
  } catch (error: any) {
    console.error("Payment verification failed:", error.message);
    return false;
  }
};