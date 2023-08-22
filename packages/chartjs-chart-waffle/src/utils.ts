const isOlderPart = (act: string, req: string) =>
  act.length > req.length && act.slice(0, req.length) === req;

/**
 * @param {string} pkg
 * @param {string} min
 * @param {string} ver
 * @param {boolean} [strict=true]
 * @returns {boolean}
 */
export function requireVersion(
  pkg: string,
  min: string,
  ver: string,
  strict: boolean = true
) {
  const parts = ver.split(".");
  let i = 0;
  for (const req of min.split(".")) {
    const act = parts[i++];
    if (parseInt(req, 10) < parseInt(act, 10)) {
      break;
    }
    if (isOlderPart(act, req)) {
      if (strict) {
        throw new Error(
          `${pkg} v${ver} is not supported. v${min} or newer is required.`
        );
      } else {
        return false;
      }
    }
  }
  return true;
}
