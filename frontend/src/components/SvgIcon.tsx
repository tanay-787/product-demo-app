import React from 'react';

interface SvgIconProps {
  svgString: string;
  className?: string;
}

const SvgIcon: React.FC<SvgIconProps> = ({ svgString, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};

export default SvgIcon;
