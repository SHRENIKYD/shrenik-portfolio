// The canonical public origin of the site.
//
// Social scrapers — LinkedIn, Slack, WhatsApp, X — do not resolve relative
// URLs, so og:image has to be absolute or the card silently never appears.
// Next builds those absolute URLs from metadataBase, which is what this is
// for. Override with NEXT_PUBLIC_SITE_ORIGIN if the site ever moves to a
// custom domain.
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://shrenikyd.github.io";

export const SITE_TITLE = "Shrenik YD — Senior Software Engineer";

export const SITE_DESCRIPTION =
  "Full-stack .NET engineer in Bengaluru — C#, VB.NET, .NET Core, Angular, SQL Server, Azure. " +
  "Scaled a payroll integration to 20,000+ employers.";
