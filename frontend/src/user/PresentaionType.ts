export type PresentationType = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  slides: SlideType[];
  theme?: PresentationTheme;
};

export type SlideType = {
  id: string;
  background?: SlideBackground;
  elements: SlideElement[];
};

export type SlideElement =
  | TextElement
  | ImageElement
  | VideoElement
  | CodeElement;

type BaseElement = {
  id: string;
  type: 'text' | 'image' | 'video' | 'code';
  width: number;   // 0-100
  height: number;  // 0-100
  x: number;       // 0-100
  y: number;       // 0-100
  layer: number;
};

export type TextElement = BaseElement & {
  type: 'text';
  text: string;
  fontSize: number;
  color: string;
  fontFamily?: string;
};

export type ImageElement = BaseElement & {
  type: 'image';
  src: string;
  alt: string;
};

export type VideoElement = BaseElement & {
  type: 'video';
  src: string;
  autoplay: boolean;
};

export type CodeElement = BaseElement & {
  type: 'code';
  code: string;
  fontSize: number;
  language?: 'c' | 'python' | 'javascript';
};

export type SlideBackground =
  | { kind: 'solid'; color: string }
  | { kind: 'gradient'; from: string; to: string; direction: string }
  | { kind: 'image'; src: string };

export type PresentationTheme = {
  defaultBackground?: SlideBackground;
  fontFamily?: string;
};
