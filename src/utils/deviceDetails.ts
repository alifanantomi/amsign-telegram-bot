import { format } from "date-fns";

/**
 * Formats device details into a string for the bot response.
 */
export const formatDeviceDetails = (device: any): string => {
  const addedOn = format(new Date(device.attributes.addedDate), "dd/MM/yyyy HH:mm:ss");
  const expiry = device.attributes.expiry
    ? format(new Date(device.attributes.expiry), "dd/MM/yyyy HH:mm:ss")
    : format(
        new Date(new Date(device.attributes.addedDate).setFullYear(new Date(device.attributes.addedDate).getFullYear() + 1)),
        "dd/MM/yyyy HH:mm:ss"
      );

  return `
Device Details:
**ID** : ${device.id}
**Name** : ${device.attributes.name}
**Model** : ${device.attributes.model}
**UDID** : ${device.attributes.udid}
**Added On** : ${addedOn}
**Expiry** : ${expiry}

**Status** : ${device.attributes.status === "ENABLED" ? "Active 🟢" : "Inactive 🔴"}
  `;
};
