// ========================================
// Root document
// ========================================
export interface PopupConfig {
  id: string;
  name: string;
  version: 1;
  container: ContainerConfig;
  elements: PopupElement[];
  displayRules: DisplayRules;
  closeButton: CloseButtonConfig;
  overlay: OverlayConfig;
  animation: AnimationConfig;
  customCSS?: string;
  customJS?: string;
}

// ========================================
// Container
// ========================================
export interface ContainerConfig {
  width: ResponsiveValue<string>;
  height: ResponsiveValue<string>;
  maxWidth?: ResponsiveValue<string>;
  maxHeight?: ResponsiveValue<string>;
  position: PopupPosition;
  offsetX: number;
  offsetY: number;
  backgroundColor: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  borderStyle: 'solid' | 'dashed' | 'none';
  boxShadow: BoxShadowConfig;
  padding: SpacingConfig;
  zIndex: number;
}

export type PopupPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ResponsiveValue<T> {
  mobile: T;
  tablet?: T;
  desktop: T;
}

export interface BoxShadowConfig {
  enabled: boolean;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
}

export interface SpacingConfig {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// ========================================
// Elements
// ========================================
export type PopupElement =
  | TextElement
  | ImageElement
  | ButtonElement
  | DividerElement
  | SpacerElement
  | BoxElement
  | CarouselElement
  | FormElement
  | HtmlElement;

export type ElementType = PopupElement['type'];

export interface BaseElement {
  id: string;
  type: string;
  margin?: SpacingConfig;
  padding?: SpacingConfig;
  visible?: ResponsiveValue<boolean>;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  linkUrl?: string;
  linkTarget?: '_self' | '_blank';
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt: string;
  width: string;
  height: string;
  objectFit: 'cover' | 'contain' | 'fill' | 'none';
  borderRadius: number;
  linkUrl?: string;
  linkTarget?: '_self' | '_blank';
  alignment: 'left' | 'center' | 'right';
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  label: string;
  linkUrl: string;
  linkTarget: '_self' | '_blank';
  width: string;
  height: string;
  backgroundColor: string;
  hoverBackgroundColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  alignment: 'left' | 'center' | 'right';
  action: 'link' | 'close' | 'custom';
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  color: string;
  thickness: number;
  style: 'solid' | 'dashed' | 'dotted';
}

export interface SpacerElement extends BaseElement {
  type: 'spacer';
  height: number;
}

export interface BoxElement extends BaseElement {
  type: 'box';
  direction: 'vertical' | 'horizontal';
  gap: number;
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  backgroundColor?: string;
  borderRadius?: number;
  children: PopupElement[];
}

export interface CarouselElement extends BaseElement {
  type: 'carousel';
  slides: CarouselSlide[];
  autoPlay: boolean;
  interval: number;
  showDots: boolean;
  showArrows: boolean;
}

export interface CarouselSlide {
  id: string;
  elements: PopupElement[];
}

export interface FormElement extends BaseElement {
  type: 'form';
  fields: FormField[];
  submitLabel: string;
  submitUrl: string;
  submitMethod: 'post' | 'get';
  successMessage: string;
}

export interface FormField {
  id: string;
  fieldType: 'text' | 'email' | 'tel' | 'select' | 'checkbox';
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface HtmlElement extends BaseElement {
  type: 'html';
  content: string;
}

// ========================================
// Display Rules
// ========================================
export interface DisplayRules {
  trigger: TriggerConfig;
  frequency: FrequencyConfig;
  targeting: TargetingConfig;
  scheduling: SchedulingConfig;
}

export interface TriggerConfig {
  type: 'immediate' | 'delay' | 'scroll' | 'exit-intent' | 'click';
  delaySeconds?: number;
  scrollPercent?: number;
  clickSelector?: string;
}

export interface FrequencyConfig {
  type: 'always' | 'once' | 'once-per-session' | 'every-n-days';
  days?: number;
}

export interface TargetingConfig {
  urlMatch: UrlMatchRule[];
  deviceTypes: ('mobile' | 'tablet' | 'desktop')[];
}

export interface UrlMatchRule {
  type: 'exact' | 'contains' | 'starts-with' | 'regex';
  value: string;
  exclude: boolean;
}

export interface SchedulingConfig {
  enabled: boolean;
  startDate?: string;
  endDate?: string;
}

// ========================================
// Close Button
// ========================================
export interface CloseButtonConfig {
  enabled: boolean;
  position: 'top-right' | 'top-left';
  size: number;
  color: string;
  offsetX: number;
  offsetY: number;
  outsidePopup: boolean;
}

// ========================================
// Overlay
// ========================================
export interface OverlayConfig {
  enabled: boolean;
  color: string;
  closeOnClick: boolean;
}

// ========================================
// Animation
// ========================================
export interface AnimationConfig {
  entrance: 'none' | 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom-in';
  exit: 'none' | 'fade-out' | 'slide-up' | 'slide-down' | 'zoom-out';
  duration: number;
}
