export const getHeaderContainerClasses = (className?: string) => {
  return `mb-6 w-full flex-row items-center justify-between ${className ?? ''}`.trim();
};
export const getHeaderContentClasses = () => {
  return 'flex-1';
};
export const getHeaderTextContainerClasses = (
  hasLeftComponent: boolean,
  hasRightComponent: boolean
) => {
  const leftSpacing = hasLeftComponent ? 'pl-3' : '';
  const rightSpacing = hasRightComponent ? 'pr-3' : '';

  return `flex-1 ${leftSpacing} ${rightSpacing}`.trim();
};
