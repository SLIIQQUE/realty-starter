import Image from "next/image";

/** Header mark: the real SLIIQQUE app-tile icon (black rounded tile, white double-Q, blue accent), already the right look for the 26x26 dark badge the nav uses. */
export function LogoMark() {
  return (
    <Image
      src="/brand/sliiqque-logo.png"
      width={26}
      height={26}
      alt=""
      className="logo__mark-img"
      priority
    />
  );
}

/** Footer mark: white-on-transparent variant, legible on the dark footer background. */
export function LogoMarkFooter() {
  return (
    <Image
      src="/brand/sliiqque-icon-white.png"
      width={40}
      height={25}
      alt=""
      className="logo__mark-img logo__mark-img--footer"
    />
  );
}
