import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export default function useLayoutDimension() {
  const [windowInfo, setWindowInfo] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = ({ window }) => setWindowInfo(window);
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove?.();
  }, []);

  const { width, height } = windowInfo;

  // Width categories
  const isXSmall = width < 360;
  const isSmall = width >= 360 && width < 400;
  const isMedium = width >= 400 && width < 480;
  const isLarge = width >= 480 && width < 600;
  const isXLarge = width >= 600 && width < 840;
  const isTablet = width >= 840 && width < 1025;
  const isDesktop = width >= 1025;

  // Height categories
  const isShort = height < 600;
  const isMediumHeight = height >= 600 && height < 800;
  const isTall = height >= 800 && height < 1000;
  const isExtraTall = height >= 1000;

  // Orientation
  const isPortrait = height >= width;
  const isLandscape = width > height;

  return {
    width,
    height,
    aspectRatio: width / height,
    isXSmall,
    isSmall,
    isMedium,
    isLarge,
    isXLarge,
    isTablet,
    isDesktop,
    isShort,
    isMediumHeight,
    isTall,
    isExtraTall,
    isPortrait,
    isLandscape,
  };
}
