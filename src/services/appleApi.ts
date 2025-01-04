import axios from "axios";
import jwt from "jsonwebtoken";
import { APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY } from "../utils/env";

const APPLE_API_BASE_URL = "https://api.appstoreconnect.apple.com/v1";

// Generate JWT for Apple API
const generateJWT = (): string => {
  try {
    const teamId = APPLE_TEAM_ID
    const keyId = APPLE_KEY_ID
    const privateKey = APPLE_PRIVATE_KEY
  
    const payload = {
      iss: teamId,
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // Expires in 10 minutes
      aud: "appstoreconnect-v1",
    };
  
    return jwt.sign(payload, privateKey, {
      algorithm: "ES256",
      header: {
        alg: "ES256",
        kid: keyId,
      },
    });
  } catch (error) {
    console.log(error.message);
    
    return error.message
  }
};

// Check UDID registration
export const checkUDIDRegistration = async (udid: string): Promise<any> => {
  const token = generateJWT();

  try {
    const response = await axios.get(`${APPLE_API_BASE_URL}/devices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        "filter[udid]": udid,
      },
    });

    if (response.data.data.length > 0) {
      return response.data.data[0]; // Returning the first matching device
    }

    return null; // Return null if no device found
  } catch (error) {
    console.error("Error checking UDID registration:", error.response?.data || error.message);
    throw new Error("Failed to check UDID registration.");
  }
};

// Register a new UDID
export const registerUDID = async (udid: string, name: string, platform = "ios") => {
  const token = generateJWT();

  try {
    const response = await axios.post(
      `${APPLE_API_BASE_URL}/devices`,
      {
        data: {
          type: "devices",
          attributes: {
            name,
            udid,
            platform,
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error registering UDID:", error.response?.data || error.message);
    throw new Error("Failed to register UDID.");
  }
};
