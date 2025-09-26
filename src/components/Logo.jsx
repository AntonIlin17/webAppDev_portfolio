import React from 'react';
import logo from 'webAppDev_portfolio/src/components/Logo.html';

const Logo = () => {
    return (
        <div dangerouslySetInnerHTML={{ __html: logo }} />
    );
};

export default Logo;
