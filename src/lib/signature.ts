export type SignatureDetails = {
  name: string;
  title: string;
  department: string;
  phone: string;
  email: string;
  website: string;
  address: string;
};

export const CEO_SIGNATURE: SignatureDetails = {
  name: "Kehinde Olashore",
  title: "Chief Executive Officer",
  department: "",
  phone: "+234 802 222 5701",
  email: "ko@datacrestgroup.com",
  website: "www.datacrestgroup.com",
  address: "281A Ajose Adeogun Street | Victoria Island | Lagos | Nigeria",
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });

const safeHref = (value: string, protocol: "mailto:" | "tel:" | "https://") => {
  const trimmed = value.trim();
  if (protocol === "https://") {
    const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
    return `https://${escapeHtml(withoutProtocol)}`;
  }
  return `${protocol}${encodeURIComponent(trimmed).replace(/%20/g, " ")}`;
};

export function signatureHtml(details: SignatureDetails, bannerUrl: string) {
  const name = escapeHtml(details.name);
  const title = escapeHtml(details.title);
  const department = escapeHtml(details.department);
  const phone = escapeHtml(details.phone);
  const email = escapeHtml(details.email);
  const website = escapeHtml(details.website.replace(/^https?:\/\//i, ""));
  const address = escapeHtml(details.address);
  const cleanBannerUrl = escapeHtml(bannerUrl);

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:760px;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#30443a;">
  <tr><td style="padding:0 8px 4px 8px;font-size:24px;line-height:1.25;font-weight:700;color:#203e2e;">${name}</td></tr>
  <tr><td style="padding:0 8px 20px 8px;font-size:16px;line-height:1.4;font-weight:700;color:#bd7d36;">${title}${department ? ` <span style="font-weight:400;color:#718078;">| ${department}</span>` : ""}</td></tr>
  ${phone ? `<tr><td style="padding:0 8px 8px 8px;font-size:15px;line-height:1.45;"><a href="${safeHref(details.phone, "tel:")}" style="color:#405347;text-decoration:none;">☎ &nbsp;${phone}</a></td></tr>` : ""}
  ${email ? `<tr><td style="padding:0 8px 8px 8px;font-size:15px;line-height:1.45;"><a href="${safeHref(details.email, "mailto:")}" style="color:#405347;text-decoration:none;">✉ &nbsp;${email}</a></td></tr>` : ""}
  ${website ? `<tr><td style="padding:0 8px 8px 8px;font-size:15px;line-height:1.45;"><a href="${safeHref(details.website, "https://")}" style="color:#405347;text-decoration:none;">● &nbsp;${website}</a></td></tr>` : ""}
  ${address ? `<tr><td style="padding:0 8px 20px 8px;font-size:15px;line-height:1.45;color:#405347;">⌖ &nbsp;${address}</td></tr>` : ""}
  <tr><td style="padding:0;"><img src="${cleanBannerUrl}" alt="Datacrest Technologies Limited — Enterprise Systems | AI | Cloud | Automation | Cyber Security" width="760" style="display:block;width:100%;max-width:760px;height:auto;border:0;" /></td></tr>
</table>`;
}