import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "the two — Wedding marketplace, made clear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Google Fonts serves TTF when no browser user agent is sent; Satori needs TTF/OTF. */
async function googleFont(family: string, text: string) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}&text=${encodeURIComponent(text)}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/the-two-monogram.png"));
  const script = "the two";
  const headline = "Mọi thứ cho đám cưới, ở đúng một nơi.";
  const tagline = "Wedding marketplace, made clear";
  const [scriptFont, headingFont, bodyFont] = await Promise.all([googleFont("Mrs Saint Delafield", script), googleFont("Old Standard TT", headline), googleFont("Mulish", tagline)]);
  const fonts = [
    scriptFont && { name: "Script", data: scriptFont, weight: 400 as const },
    headingFont && { name: "Heading", data: headingFont, weight: 400 as const },
    bodyFont && { name: "Body", data: bodyFont, weight: 400 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 }[];

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff" }}>
      <div style={{ width: 28, height: "100%", background: "#8e0413" }}/>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 90px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={`data:image/png;base64,${logo.toString("base64")}`} width={150} height={150} alt=""/>
          <span style={{ fontFamily: "Script", fontSize: 130, color: "#8e0413", lineHeight: 1 }}>{script}</span>
        </div>
        <span style={{ fontFamily: "Heading", fontSize: 56, color: "#231d1e", marginTop: 36, lineHeight: 1.2 }}>{headline}</span>
        <span style={{ fontFamily: "Body", fontSize: 26, color: "#6b6465", marginTop: 22 }}>{tagline}</span>
      </div>
    </div>,
    { ...size, fonts },
  );
}
