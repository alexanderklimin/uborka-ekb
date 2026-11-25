import { googleAdsRequest } from "/opt/google-ads-mcp/src/googleAdsClient.js";
import { readConfigFromEnv } from "/opt/google-ads-mcp/src/googleAuth.js";
const c = readConfigFromEnv();
const r = await googleAdsRequest(c, { method: "POST", path: "/geoTargetConstants:suggest", body: { locale: "ru", countryCode: "RU", locationNames: { names: ["Екатеринбург", "Свердловская область"] } } });
for (const s of r.geoTargetConstantSuggestions || []) console.log(s.geoTargetConstant.resourceName, s.geoTargetConstant.name, s.geoTargetConstant.targetType, s.reach);
