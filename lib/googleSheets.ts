import { createSign } from "node:crypto";

const tokenUrl = "https://oauth2.googleapis.com/token";
const sheetsScope = "https://www.googleapis.com/auth/spreadsheets";

export type ContactSheetRow = {
  timestamp: string;
  name: string;
  email: string;
  reason: string;
  message: string;
  userAgent: string;
};

type GoogleSheetsConfig = {
  clientEmail: string;
  privateKey: string;
  spreadsheetId: string;
  range: string;
};

function getGoogleSheetsConfig(): GoogleSheetsConfig {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(/^"|"$/g, "").trim();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const range = process.env.GOOGLE_SHEETS_CONTACT_RANGE || "Contact!A:F";

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error("Missing Google Sheets contact form environment variables.");
  }

  return {
    clientEmail,
    privateKey,
    spreadsheetId,
    range
  };
}

function base64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function signJwt(config: GoogleSheetsConfig) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT"
  };
  const claimSet = {
    iss: config.clientEmail,
    scope: sheetsScope,
    aud: tokenUrl,
    exp: now + 3600,
    iat: now
  };
  const unsignedJwt = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claimSet))}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  signer.end();

  return `${unsignedJwt}.${signer.sign(config.privateKey).toString("base64url")}`;
}

async function getGoogleAccessToken(config: GoogleSheetsConfig) {
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: signJwt(config)
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google OAuth token request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("Google OAuth token response did not include an access token.");
  }

  return data.access_token;
}

function asSafeSheetCell(value: string) {
  const trimmed = value.trim();
  const formulaPrefixes = ["=", "+", "-", "@"];

  if (formulaPrefixes.some((prefix) => trimmed.startsWith(prefix))) {
    return `'${trimmed}`;
  }

  return trimmed;
}

export async function appendContactSubmission(row: ContactSheetRow) {
  const config = getGoogleSheetsConfig();
  const accessToken = await getGoogleAccessToken(config);
  const encodedRange = encodeURIComponent(config.range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${encodedRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      values: [
        [
          row.timestamp,
          asSafeSheetCell(row.name),
          asSafeSheetCell(row.email),
          asSafeSheetCell(row.reason),
          asSafeSheetCell(row.message),
          asSafeSheetCell(row.userAgent)
        ]
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets append failed: ${response.status} ${errorText}`);
  }
}
