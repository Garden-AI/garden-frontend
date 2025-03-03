import React from 'react';

const MITLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 1680 1040"
        enableBackground="new 0 0 1680 1040"
        xmlSpace="preserve"
        className="fill-current"
        {...props}
    >
        <path
            d="M880,880h160V400H880V880z M1120,320h400V160h-400V320z M880,160.00003h160v160H880V160.00003z M640,880h160V160H640V880z
        M400,720h160V160H400V720z M160,880h160V160H160V880z M1120,880h160V400h-160V880z"
            />
    </svg>
  );
};

export default MITLogo;